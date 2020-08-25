import GPUtil
import re
import os
import json
from fastapi import FastAPI, Query, HTTPException, File, Form, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles


from services.docker_service import DockerService
from services.alias_service import AliasService
from services.paths_service import PathsService
from services.used_ports_service import UsedPortsService
from services.proxy_service import ProxyService
from dto.container_info import ContainerInfo
from dto.container_settings import ContainerSettings
from validators.dataset_validator import check_dataset_valid
from validators.checkpoint_validator import check_checkpoint_valid

docker_service = DockerService()
alias_service = AliasService()
used_ports_service = UsedPortsService()
paths = PathsService().get_paths()
proxy_env = ProxyService().get_proxy_env()
networks = json.loads(open("./data/networks.json","r").read())


app = FastAPI(version='2.0', title='Docker SDK API',
              description="API for managing training containers")


app.mount("/models", StaticFiles(directory="/servable"), name="models") 
        
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


"""
Gets the available gpus.

Returns
-------
list of str
    a list of gpu names with less than 25% memory consumption

"""
@app.get('/gpu/info')
async def get_gpu_info():
    return GPUtil.getAvailable(order = 'memory', limit = 10, maxLoad = 0.5, maxMemory = 0.5, includeNan=False, excludeID=[], excludeUUID=[])



"""
Gets all the running training jobs.

Returns
-------
list of str
    a list of all running training jobs names

"""
@app.get('/jobs')
async def get_all_jobs():
    jobs = docker_service.get_all_jobs(paths['image_name']+":latest")
    return [alias_service.get_alias_from_name(job) for job in jobs]


"""
Stops a specific job

Parameters
----------
containerInfo: ContainerInfo
               object of type ContainerInfo containing the container name 
               

Returns
-------
str
    Success Message
""" 
@app.post('/jobs/remove')
async def remove_job(container_info:ContainerInfo):
    job_name = alias_service.get_name_from_alias(container_info.name)
    killed =  docker_service.remove_job(job_name)
    if killed:
        alias_service.delete_alias(container_info.name)

    return "Job Killed"





"""
Starts a job

Parameters
----------
containerSettings: ContainerSettnigs
                   object of type ContainerSettings containing all the necessary info to start a job
Returns
-------
str
    Success Message
""" 
@app.post('/jobs/add')
async def add_job(container_settings:ContainerSettings):
    alias = container_settings.name
    # container_settings.name = re.sub('[^A-z0-9 -]', '', container_settings.name).lower().replace(" ", "_")
    container_settings.name = re.sub('\W+','_', container_settings.name)
    container_settings.name = "Classification_"+container_settings.name
    docker_service.start_job(container_settings, paths['api_folder'], paths['image_name'], paths['dataset_folder_on_host'], paths['checkpoints_folder_on_host'], paths['servable_folder'], paths['models_folder'], proxy_env)
    alias_service.add_alias(container_settings.name, alias)
    return "Success"




"""
Get logs for a specific job

Parameters
----------
containerInfo: ContainerInfo
               object of type ContainerInfo containing the container name 

Returns
-------
list of str
    logs of the job
"""
@app.post('/logs')
async def get_logs(containerInfo: ContainerInfo):
    job_name = alias_service.get_name_from_alias(containerInfo.name)
    logs = docker_service.get_logs(job_name)
    log_list = logs.splitlines()
    response_logs = []

    for log in log_list:
        log = log.decode("utf-8")
        response_logs.append(log)

    return response_logs




"""
Get all the used ports on the system

Returns
-------
list of str
    used ports
"""
@app.get('/ports')
async def get_used_ports():
    return (used_ports_service.get_used_ports())




"""
Get all valid datasets

Returns
-------
list of str
    datasets
"""

@app.get('/datasets')
async def get_datasets():
    datasets = [dataset for dataset in os.listdir('/datasets') if os.path.isdir(os.path.join('/datasets',dataset)) and check_dataset_valid(os.path.join('/datasets',dataset))]
    return datasets



"""
Get all valid checkpoints

Returns
-------
list of str
    checkpoints
"""
@app.get('/checkpoints')
def get_checkpoints():
    checkpoints = {}
    for root, dirs, files in os.walk("/checkpoints"):
        for directory in dirs:
            if check_checkpoint_valid(os.path.join(root, directory)):
                name_parts = os.path.join(root, directory).split("/")
                checkpoints[name_parts[-1]] = name_parts[-2]

    return checkpoints





"""
Get all models in the static folder called servable

Returns
-------
list of str
    servable models
"""
@app.get('/servable/models')
def get_downloadable_models():
    servable_checkpoints_folder = '/servable'
    if not os.path.isdir(servable_checkpoints_folder):
        os.makedirs(servable_checkpoints_folder)
    
    servable_models = {}
    for root, dirs, files in os.walk("/servable"):
        for directory in dirs:
            for f in os.listdir(os.path.join(root,directory)):
                if f.endswith(".zip"):
                    servable_models[f] = directory

    return servable_models


"""
Get all finished jobs by comparing the models that are in the servable folder (done training) with the models currently in progress 

Returns
-------
list of str
    finished jobs names
"""
@app.get('/jobs/finished')
async def get_finished_jobs():

    downloadable_models = list(get_downloadable_models().keys())
    downloadable_models = [model.split(".zip")[0] for model in downloadable_models]

    running_containers = []
    containers = docker_service.get_all_jobs(paths['image_name']+":latest")
    for container in containers:
        running_containers.append(alias_service.get_alias_from_name(container))
    

    finished_jobs = list(set(running_containers).intersection(set(downloadable_models)))

    return finished_jobs



"""
Get Networks

Returns
-------
list of str
    networks names
"""
@app.get('/networks')
async def get_networks():
    return networks
