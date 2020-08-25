from pydantic import BaseModel
from typing import List

class ContainerSettings(BaseModel):
    name: str
    gpus_count: List[int]
    api_port: int