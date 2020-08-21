import os
import json


mode = None

while mode != "cpu" and mode != "gpu":
    mode = input("Enter mode (cpu/gpu): ")




basedir = os.getcwd()
paths_json = json.loads(open("docker_sdk_api/api/data/paths.json", "r").read())
paths_json["base_dir"] = basedir


if mode == "gpu":
    paths_json["image_name"] = "classification_training_api_gpu" 
if mode == "cpu":
    paths_json["image_name"] = "classification_training_api_cpu" 


with open('docker_sdk_api/api/data/paths.json', 'w') as outfile:
    json.dump(paths_json, outfile)
