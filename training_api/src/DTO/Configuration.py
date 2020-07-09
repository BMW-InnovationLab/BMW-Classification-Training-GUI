from pydantic import BaseModel
from typing import List
import pydantic
""" 
Data transfer object containing all the parameters required for a training job 
Everything is set to None, this means that all the fields are optional.
Any field not filled by the user will take the default value from the template config file. 
Those files are found in the config_templates folder.
Caution: Fields in this DTO might change from a framework to another and from a type of training to another
"""

class Configuration (BaseModel):
    
    lr: float = pydantic.Field(default=0.001,example=0.001)
    momentum: float = pydantic.Field(default=0.9,example=0.9)
    wd: float = pydantic.Field(default=0.0001,example=0.0001)
    lr_factor: float = pydantic.Field(default=0.75,example=0.75)
    gpus_count: List[int] = pydantic.Field(default=[0],example=[0])
    num_workers: int  = pydantic.Field(default=8,example=8)
    jitter_param: float = pydantic.Field(default=0.4,example=0.4)
    lighting_param: float  = pydantic.Field(default=0.1,example=0.1)
    Xavier: bool  = pydantic.Field(default=True,example=True)
    MSRAPrelu: bool = pydantic.Field(default=False,example=False)
    batch_size: int = pydantic.Field(default=1,example=1)
    epochs: int  = pydantic.Field(default=3,example=3)
    processor: str = pydantic.Field(default="CPU",example="CPU")
    weights_type: str = pydantic.Field(default="from_scratch",example="from_scratch")
    weights_name: str = pydantic.Field(default="resnet50_v1",example="resnet50_v1")
    model_name: str =pydantic.Field(default="test_18",example="test_18")
    new_model: str =pydantic.Field(default="test_19",example="test_19")
    data_augmenting : bool = pydantic.Field(default=True,example=True)

