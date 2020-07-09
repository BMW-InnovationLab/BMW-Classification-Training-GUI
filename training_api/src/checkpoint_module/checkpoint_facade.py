"""
Imports
"""
import os
from DTO.Checkpoint import Checkpoint
from checkpoint_module.checkpoint_validator import CheckpointValidator

class CheckpointFacade():

    def __init__(self):
        self.checkpoint_base_path = '/checkpoints/'
        self.CheckpointValidator= CheckpointValidator()

    
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
    def create_checkpoint(self, checkpoint_name):
        checkpoint_path = os.path.join(self.checkpoint_base_path, checkpoint_name)
        if (self.CheckpointValidator.validate_checkpoint(checkpoint_name)):
            params_file = checkpoint_name+".params"
            params_file = os.path.join(checkpoint_path, params_file) 
            classes_file = os.path.join(checkpoint_path, "classes.txt")
            network_name_file = os.path.join(checkpoint_path, "networkname.txt")
            data= {"params_file":params_file,"classes_file":classes_file,"network_name_file":network_name_file}
            checkpoint=Checkpoint(**data)
            return checkpoint
        else:
            raise Exception("Invalid Checkpoint")