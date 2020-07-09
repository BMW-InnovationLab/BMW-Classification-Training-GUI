import json
import os

class PathsService():

    def __init__(self):
        self.paths_file_path = "./data/paths.json"

    def get_paths(self):
        with open(self.paths_file_path, "r") as paths_file:
            paths = json.loads(paths_file.read())
            paths['api_folder'] = os.path.join(paths['base_dir'], paths['api_folder'])
            paths['dataset_folder_on_host'] = os.path.join(paths['base_dir'], paths['dataset_folder_on_host'])
            paths['checkpoints_folder_on_host'] = os.path.join(paths['base_dir'], paths['checkpoints_folder_on_host'])
            paths['servable_folder'] = os.path.join(paths['base_dir'], paths['servable_folder'])
            return paths

