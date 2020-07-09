from pydantic import BaseModel

class ContainerSettings(BaseModel):
    name: str
    # network_architecture: str
    # dataset_path: str
    # gpus: int
    # tensorboard_port: int
    api_port: int