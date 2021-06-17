"""
List of Imports:
main.py should import all the other modules facades
it should also import all the DTOs needed (DTO is Data Transfer Object which
are objects used to comunicate data from one place to another).
"""
import shutil
import os
from DTO.Configuration import Configuration
from starlette.middleware.cors import CORSMiddleware
from DTO.Dataset import Dataset
from configuration_module.configuration_facade import ConfigurationFacade
from dataset_module.dataset_facade import DatasetFacade
from training_module.training_facade import TrainingFacade
from fastapi import FastAPI, Query, HTTPException, File, Form, BackgroundTasks
from gluoncv import model_zoo
import json

app = FastAPI(version='0.1', title='Training Template')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conf_facade = ConfigurationFacade()
dataset_facade = DatasetFacade()
training_facade = TrainingFacade()

tmp = {}
def network_and_training_background_job(config:Configuration,train_data, valid_data, test_data):
    net = conf_facade.get_network(config, tmp['classes_num'])
    training_facade.training(config, train_data, valid_data, test_data, net, tmp['dataset_name'])

@app.post('/dataset')
async def dataset_func(dataset: Dataset):
    try:
        if os.path.exists("../dataset"):
            shutil.rmtree("../dataset")
        dataset_facade.prepare_dataset(dataset)
        classes_number = dataset_facade.get_classes_number(dataset)
        tmp['classes_num'] = classes_number
        tmp['dataset_name'] = dataset.dataset_name
        return "Dataset Loaded Successfully"
    except  Exception as e:
        raise HTTPException(status_code=500, detail=e.__str__())


@app.post('/config')
async def config_func(background_tasks: BackgroundTasks, config: Configuration):
    try:
        config = conf_facade.configure_job(config)
        train_data, valid_data, test_data = dataset_facade.augment_dataset(config, "../dataset/")
        background_tasks.add_task(network_and_training_background_job,config,train_data, valid_data, test_data)
        return "Training Started"
    except Exception as e:
        raise HTTPException(status_code=500, detail=e.__str__())


@app.get('/get')
async def get():
    try:
        with open("/app/midweight_heavyweight_solution/networks.json", "r") as f:
            networks = list(json.loads(f.read()))
        networks.pop(0)
        networks_json = {
            "networks": networks
        }
        return networks_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=e.__str__())
