from pydantic import BaseModel
from typing import List

"""
The Checkpoint DTO 
Caution: Fields in this DTO might change from a framework to another and from a type of training to another
"""


class Checkpoint(BaseModel):
    params_file: str
    classes_file: str 
    network_name_file: str
