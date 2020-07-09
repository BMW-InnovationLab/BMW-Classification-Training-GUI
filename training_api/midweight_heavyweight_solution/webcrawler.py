import os 
import json 
from model_store import *

def get_networks(config):
    if config['select_all']==True:
        download_all_networks(config)
        return "all_networks_downloaded"
    networks=[]
    for i,j in config.items():
        if j==True:
            get_model_file(str(i),root=os.path.join('~','.mxnet','models'))
    return "some or none networks downloaded"



def download_all_networks(config):
    for i,j in config.items():
        if i != "select_all":
            get_model_file(str(i),root=os.path.join('~','.mxnet','models'))


with open('networks.json','rb') as f:
    config=json.load(f)

get_networks(config) 
