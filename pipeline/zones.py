ZONES = {
    "ENTRY_ZONE": {
        "zone_id": "ENTRY",
        "polygon": [(0, 0), (450, 0), (450, 1080), (0, 1080)],
        "sku_zone": None,
    },
    "MAIN_FLOOR": {
        "zone_id": "MAIN_FLOOR",
        "polygon": [(450, 0), (1400, 0), (1400, 1080), (450, 1080)],
        "sku_zone": "GENERAL",
    },
}


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
                        x_intersection = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    else:
                        x_intersection = p1x

                    if p1x == p2x or x <= x_intersection:
                        inside = not inside

        p1x, p1y = p2x, p2y

    return inside


def get_zone_for_point(point):
    for zone in ZONES.values():
        if point_in_polygon(point, zone["polygon"]):
            return zone

    return None