import yaml
import json
import os

base_path = './docker_sdk_api/api/data'

proxy_file_path = os.path.join(base_path, "proxy.json")

proxy_settings = None

with open(proxy_file_path, "r") as proxy_file:
    proxy_settings = json.loads(proxy_file.read())
    

compose_build_files = ["./build_cpu.yml", "./build_gpu.yml"]


for build_file in compose_build_files:

    content = None

    with open(build_file, "r") as f:
        contents = yaml.load_all(f, Loader=yaml.FullLoader)

        for content in contents:
            
            services = content['services']

            for service, service_params in services.items():
                build = service_params['build']
                build['args']['http_proxy'] = proxy_settings['HTTP_PROXY']
                build['args']['https_proxy'] = proxy_settings['HTTPS_PROXY']
                service_params['build'] = build

            content['services'] = services

    with open(build_file, "w") as f:
        yaml.dump(content, f)


