import json
import os

BASE_PATH = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

# Map module slugs to curriculum file names
MODULE_FILE_MAP = {
    "git-github": "git",
    "git": "git",
    "dsa": "dsa",
    "css-layout": "css-layout",
}

def load_curriculum(module_name: str):
    file_name = MODULE_FILE_MAP.get(module_name, module_name)
    path = os.path.join(BASE_PATH, "curriculum", f"{file_name}.json")

    if not os.path.exists(path):
        raise FileNotFoundError(f"{module_name}.json not found")

    with open(path, "r") as file:
        return json.load(file)
