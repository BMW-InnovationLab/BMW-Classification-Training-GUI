"""
Imports
"""
import os
from DTO.Checkpoint import Checkpoint

class CheckpointValidator():

    def __init__(self):
        self.checkpoint_base_path = '/checkpoints/'



    """
    Validates the checkpoins folder by checking if the path exists, 
    if it is a folder and checking all the files are there
    We might as well add the model_name modelname check here

    Input:
    ------
        -  path of your checkpoints

    
    Output:
    -------
        - True if the checkpoint is valid else otherwise
    """

    def validate_checkpoint(self,checkpoint_name):
        checkpoint_path = os.path.join(self.checkpoint_base_path, checkpoint_name)

        if not os.path.exists(checkpoint_path):
            return False
        if not os.path.exists(os.path.join(checkpoint_path,checkpoint_name+".params")):
            return False
        if not os.path.exists(os.path.join(checkpoint_path,"classes.txt")):
            return False
        if not os.path.exists(os.path.join(checkpoint_path,"networkname.txt")):
            return False
        return True
