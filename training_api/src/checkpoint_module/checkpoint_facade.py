"""
Imports
"""
import os
import json
from json import JSONDecodeError
from DTO.Checkpoint import Checkpoint
from checkpoint_module.checkpoint_validator import CheckpointValidator


class CheckpointFacade():

    def __init__(self):
        self.checkpoint_base_path = '/checkpoints/'
        self.CheckpointValidator = CheckpointValidator()

    """

    Calls the validate_checkpoint method of CheckpointValidator class to make sure the checkpoint folder is valid
    If it is valid, it will create the checkpoint object and fill the paths of the files in its attributes

    Input:
    ------
        -  path of your checkpoints

    
    Output:
    -------
        - checkpoint object 
    """
    def _parse_json(self, file_path:str):
        try:
            with open(file_path, "rb") as json_file:
                return json.load(json_file)
        except JSONDecodeError as e:
            # if json is empty return empty dict
            return {}

    def create_checkpoint(self, checkpoint_architecture, checkpoint_name):
        checkpoint_path = os.path.join(self.checkpoint_base_path, os.path.join(checkpoint_architecture, checkpoint_name))
        if (self.CheckpointValidator.validate_checkpoint(checkpoint_name, checkpoint_architecture)):
            params_file = checkpoint_name + ".params"
            params_file = os.path.join(checkpoint_path, params_file)
            classes_file = os.path.join(checkpoint_path, "classes.txt")
            config_file = os.path.join(checkpoint_path, "config.json")
            config_dict = self._parse_json(file_path=config_file)
            data = {"params_file": params_file, "classes_file": classes_file, "network_name_file": config_dict["network"]}
            checkpoint = Checkpoint(**data)
            return checkpoint
        else:
            raise Exception("Invalid Checkpoint")
