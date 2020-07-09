from pydantic import BaseModel, Schema

class ContainerInfo(BaseModel):
    name: str