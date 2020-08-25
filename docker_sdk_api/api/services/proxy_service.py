import json
import os

class ProxyService():

    def __init__(self):
        self.proxy_file_path = "./data/proxy.json"

    def get_proxy_env(self):
        with open(self.proxy_file_path, "r") as proxy_file:
            return json.loads(proxy_file.read())
