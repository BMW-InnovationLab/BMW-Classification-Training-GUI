import docker

from dto.container_settings import ContainerSettings

class DockerService():

    def __init__(self):
        self.client = docker.from_env()
    

    def get_all_jobs(self, image_name:str):
        containers = []
        for container in self.client.containers.list():
            if(len(container.image.attrs['RepoTags']) > 0 and container.image.attrs['RepoTags'][0] == image_name):
                containers.append(container.name)
        return containers

    

    def remove_job(self, job_name:str):

        for container in self.client.containers.list():
            if (container.name == job_name):
                container.kill()
                return True

        return False

    

    def get_logs(self, job_name:str):
        for container in self.client.containers.list():
            if(container.name == job_name):
                logs = container.logs()
                return logs
            
        return ""
    

    def start_job(self, container_settings:ContainerSettings, api_path:str, image_name:str, datasets_path:str, checkpoints_path:str, servable_path:str, models_path : str, proxy_env:dict):
        volumes = {api_path: {'bind':'/app', 'mode':'rw'}, datasets_path: {'bind':'/data', 'mode':'rw'}, checkpoints_path: {'bind':'/checkpoints', 'mode':'rw'}, servable_path: {'bind':'/servable', 'mode':'rw'} ,models_path: {'bind':'/models', 'mode':'rw'}}
        ports = {'8000/tcp':str(container_settings.api_port)}

        #find the processor type to specify proper runtime
        if image_name.split('_')[3].lower() == 'cpu':    
            self.client.containers.run(image_name, name=container_settings.name, remove=True, ports=ports, volumes=volumes,tty=True, stdin_open=True, detach=True, environment=proxy_env)
        else :
            self.client.containers.run(image_name, name=container_settings.name, remove=True, ports=ports, volumes=volumes,tty=True, stdin_open=True, detach=True,runtime='nvidia', environment=proxy_env)
            