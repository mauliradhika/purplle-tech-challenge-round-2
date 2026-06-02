import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

CAMERA_CONFIG_PATH = ROOT_DIR / "data" / "camera_config.json"


def load_camera_config():
    if not CAMERA_CONFIG_PATH.exists():
        raise FileNotFoundError(
            f"Missing camera config: {CAMERA_CONFIG_PATH}"
        )

    with open(CAMERA_CONFIG_PATH, "r") as file:
        return json.load(file)