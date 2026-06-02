from pathlib import Path
import json
import argparse

import cv2
from ultralytics import YOLO

from config import load_camera_config
from emit import build_event


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

OUTPUT_DIR = ROOT_DIR / "output"
EVENTS_PATH = OUTPUT_DIR / "events.jsonl"


def role_to_zone(role: str):
    if role == "MAIN_FLOOR_A":
        return "MAIN_FLOOR_A", "SKINCARE"
    if role == "MAIN_FLOOR_B":
        return "MAIN_FLOOR_B", "COSMETICS"
    if role == "BILLING_COUNTER":
        return "BILLING", "BILLING_COUNTER"
    if role == "ENTRY_EXIT":
        return "ENTRY", None

    return role, None


def emit_event(event_file, event):
    event_file.write(json.dumps(event) + "\n")
    event_file.flush()
    print("EVENT:", event)


def get_bbox_center(x1, y1, x2, y2):
    return int((x1 + x2) / 2), int((y1 + y2) / 2)


def infer_crossing_event(previous_x, current_x, line_x, direction):
    crossed_right_to_left = previous_x > line_x and current_x <= line_x
    crossed_left_to_right = previous_x < line_x and current_x >= line_x

    if direction == "RIGHT_TO_LEFT":
        if crossed_right_to_left:
            return "ENTRY"
        if crossed_left_to_right:
            return "EXIT"

    if direction == "LEFT_TO_RIGHT":
        if crossed_left_to_right:
            return "ENTRY"
        if crossed_right_to_left:
            return "EXIT"

    return None


def point_in_polygon(point, polygon):
    x, y = point
    inside = False
    n = len(polygon)

    p1x, p1y = polygon[0]

    for i in range(n + 1):
        p2x, p2y = polygon[i % n]

        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        x_intersection = (
                            (y - p1y)
                            * (p2x - p1x)
                            / (p2y - p1y)
                            + p1x
                        )
                    else:
                        x_intersection = p1x

                    if p1x == p2x or x <= x_intersection:
                        inside = not inside

        p1x, p1y = p2x, p2y

    return inside


def is_inside_queue_roi(camera, center):
    queue_roi = camera.get("queue_roi")

    if not queue_roi:
        return False

    return point_in_polygon(center, queue_roi)


def infer_is_staff_from_crop(frame, bbox, role):
    if role == "STAFF_ONLY":
        return True

    x1, y1, x2, y2 = bbox

    h, w = frame.shape[:2]

    x1 = max(0, min(x1, w - 1))
    x2 = max(0, min(x2, w - 1))
    y1 = max(0, min(y1, h - 1))
    y2 = max(0, min(y2, h - 1))

    if x2 <= x1 or y2 <= y1:
        return False

    person_crop = frame[y1:y2, x1:x2]

    if person_crop.size == 0:
        return False

    crop_h = person_crop.shape[0]

    # Focus on upper body because uniform/shirt is more reliable than legs.
    upper_body = person_crop[: max(1, int(crop_h * 0.6)), :]

    hsv = cv2.cvtColor(upper_body, cv2.COLOR_BGR2HSV)

    # Dark/black clothing heuristic.
    dark_mask = hsv[:, :, 2] < 70
    dark_ratio = dark_mask.sum() / dark_mask.size

    return bool(dark_ratio > 0.45)


def process_entry_exit_camera(
    event_file,
    store_id,
    camera_id,
    camera,
    track_id,
    visitor_id,
    confidence,
    cx,
    is_staff,
    track_last_center_x,
    track_session_seq,
):
    entry_line_x = int(camera.get("entry_line_x", 960))
    entry_direction = camera.get("entry_direction", "RIGHT_TO_LEFT")

    previous_x = track_last_center_x.get(track_id)
    track_last_center_x[track_id] = cx

    if previous_x is None:
        return

    event_type = infer_crossing_event(
        previous_x=previous_x,
        current_x=cx,
        line_x=entry_line_x,
        direction=entry_direction,
    )

    if event_type is None:
        return

    last_event_key = f"last_entry_exit_event_{track_id}"
    last_event_type = track_session_seq.get(last_event_key)

    if last_event_type == event_type:
        return

    track_session_seq[last_event_key] = event_type
    track_session_seq[track_id] = track_session_seq.get(track_id, 0) + 1

    event = build_event(
        store_id=store_id,
        camera_id=camera_id,
        visitor_id=visitor_id,
        event_type=event_type,
        confidence=confidence,
        session_seq=track_session_seq[track_id],
        is_staff=is_staff,
    )

    emit_event(event_file, event)


def process_camera(model, store_id, camera, event_file):
    camera_id = camera["camera_id"]
    role = camera["role"]
    fps = float(camera.get("fps", 25))
    video_path = ROOT_DIR / camera["video_path"]

    zone_id, sku_zone = role_to_zone(role)

    print(f"Processing {camera_id} ({role}) → {video_path}")

    results = model.track(
        source=str(video_path),
        stream=True,
        persist=True,
        classes=[0],
        conf=0.35,
    )

    seen_tracks = set()
    track_missing_frames = {}
    track_session_seq = {}
    track_zone_start_frame = {}
    track_last_dwell_frame = {}
    track_last_center_x = {}
    track_is_staff = {}

    max_missing_frames = int(fps * 4)
    dwell_frame_interval = int(fps * 30)

    current_people_in_billing = set()

    for frame_index, result in enumerate(results):
        frame = result.orig_img.copy()
        active_track_ids = set()

        if result.boxes is not None:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])

                track_id = None
                if box.id is not None:
                    track_id = int(box.id[0])

                if track_id is None:
                    continue

                active_track_ids.add(track_id)
                track_missing_frames[track_id] = 0
                track_session_seq.setdefault(track_id, 0)

                visitor_id = f"{camera_id}_VIS_{track_id}"
                cx, cy = get_bbox_center(x1, y1, x2, y2)

                is_staff = infer_is_staff_from_crop(
                    frame=frame,
                    bbox=(x1, y1, x2, y2),
                    role=role,
                )
                track_is_staff[track_id] = is_staff

                if role == "ENTRY_EXIT":
                    process_entry_exit_camera(
                        event_file=event_file,
                        store_id=store_id,
                        camera_id=camera_id,
                        camera=camera,
                        track_id=track_id,
                        visitor_id=visitor_id,
                        confidence=confidence,
                        cx=cx,
                        is_staff=is_staff,
                        track_last_center_x=track_last_center_x,
                        track_session_seq=track_session_seq,
                    )

                    label = f"{camera_id} ID {track_id} {confidence:.2f}"

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                    cv2.putText(
                        frame,
                        label,
                        (x1, max(y1 - 10, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 0, 0),
                        2,
                    )

                    entry_line_x = int(camera.get("entry_line_x", 960))
                    cv2.line(
                        frame,
                        (entry_line_x, 0),
                        (entry_line_x, frame.shape[0]),
                        (0, 255, 255),
                        2,
                    )

                    continue

                if track_id not in seen_tracks:
                    seen_tracks.add(track_id)
                    track_session_seq[track_id] += 1

                    zone_enter_event = build_event(
                        store_id=store_id,
                        camera_id=camera_id,
                        visitor_id=visitor_id,
                        event_type="ZONE_ENTER",
                        zone_id=zone_id,
                        confidence=confidence,
                        sku_zone=sku_zone,
                        session_seq=track_session_seq[track_id],
                        is_staff=is_staff,
                    )

                    emit_event(event_file, zone_enter_event)

                    track_zone_start_frame[track_id] = frame_index
                    track_last_dwell_frame[track_id] = frame_index

                    if role == "BILLING_COUNTER":
                        is_customer_queue_person = is_inside_queue_roi(camera, (cx, cy))

                        if is_customer_queue_person and not is_staff:
                            current_people_in_billing.add(track_id)
                            track_session_seq[track_id] += 1

                            queue_event = build_event(
                                store_id=store_id,
                                camera_id=camera_id,
                                visitor_id=visitor_id,
                                event_type="BILLING_QUEUE_JOIN",
                                zone_id="BILLING",
                                confidence=confidence,
                                queue_depth=len(current_people_in_billing),
                                sku_zone="BILLING_COUNTER",
                                session_seq=track_session_seq[track_id],
                                is_staff=False,
                            )

                            emit_event(event_file, queue_event)

                if role in {"MAIN_FLOOR_A", "MAIN_FLOOR_B", "BILLING_COUNTER"}:
                    last_dwell_frame = track_last_dwell_frame.get(
                        track_id,
                        frame_index,
                    )
                    frames_since_last_dwell = frame_index - last_dwell_frame

                    if frames_since_last_dwell >= dwell_frame_interval:
                        dwell_ms = int(
                            (
                                frame_index
                                - track_zone_start_frame.get(track_id, frame_index)
                            )
                            / fps
                            * 1000
                        )

                        track_session_seq[track_id] += 1

                        dwell_event = build_event(
                            store_id=store_id,
                            camera_id=camera_id,
                            visitor_id=visitor_id,
                            event_type="ZONE_DWELL",
                            zone_id=zone_id,
                            dwell_ms=dwell_ms,
                            confidence=confidence,
                            sku_zone=sku_zone,
                            session_seq=track_session_seq[track_id],
                            is_staff=is_staff,
                        )

                        emit_event(event_file, dwell_event)
                        track_last_dwell_frame[track_id] = frame_index

                label = (
                    f"{camera_id} ID {track_id} "
                    f"{'STAFF' if is_staff else 'CUSTOMER'} "
                    f"{confidence:.2f}"
                )

                color = (0, 0, 255) if is_staff else (0, 255, 0)

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(
                    frame,
                    label,
                    (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    color,
                    2,
                )

        for tracked_id in list(seen_tracks):
            if tracked_id not in active_track_ids:
                track_missing_frames[tracked_id] = (
                    track_missing_frames.get(tracked_id, 0) + 1
                )

                if track_missing_frames[tracked_id] >= max_missing_frames:
                    visitor_id = f"{camera_id}_VIS_{tracked_id}"

                    if role == "ENTRY_EXIT":
                        seen_tracks.remove(tracked_id)
                        track_missing_frames.pop(tracked_id, None)
                        track_last_center_x.pop(tracked_id, None)
                        track_is_staff.pop(tracked_id, None)
                        continue

                    tracked_is_staff = track_is_staff.get(tracked_id, False)

                    track_session_seq[tracked_id] += 1

                    if role == "BILLING_COUNTER":
                        current_people_in_billing.discard(tracked_id)

                        zone_exit_event = build_event(
                            store_id=store_id,
                            camera_id=camera_id,
                            visitor_id=visitor_id,
                            event_type="ZONE_EXIT",
                            zone_id="BILLING",
                            confidence=1.0,
                            sku_zone="BILLING_COUNTER",
                            session_seq=track_session_seq[tracked_id],
                            is_staff=tracked_is_staff,
                        )
                    else:
                        zone_exit_event = build_event(
                            store_id=store_id,
                            camera_id=camera_id,
                            visitor_id=visitor_id,
                            event_type="ZONE_EXIT",
                            zone_id=zone_id,
                            confidence=1.0,
                            sku_zone=sku_zone,
                            session_seq=track_session_seq[tracked_id],
                            is_staff=tracked_is_staff,
                        )

                    emit_event(event_file, zone_exit_event)

                    seen_tracks.remove(tracked_id)
                    track_missing_frames.pop(tracked_id, None)
                    track_zone_start_frame.pop(tracked_id, None)
                    track_last_dwell_frame.pop(tracked_id, None)
                    track_is_staff.pop(tracked_id, None)

        cv2.imshow(f"Tracking - {camera_id}", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cv2.destroyWindow(f"Tracking - {camera_id}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--camera", type=str, default=None)
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    config = load_camera_config()
    store_id = config["store_id"]

    model = YOLO("yolov8n.pt")

    with open(EVENTS_PATH, "w") as event_file:
        for camera in config["cameras"]:
            if not camera.get("enabled", True):
                print(f"Skipping disabled camera: {camera['camera_id']}")
                continue

            if args.camera and camera["camera_id"] != args.camera:
                continue

            process_camera(model, store_id, camera, event_file)

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()