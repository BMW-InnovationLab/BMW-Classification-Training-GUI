import json
import mxnet as mx
from DTO.Configuration import Configuration
from gluoncv import model_zoo
from mxnet import gluon
import os
import sys
from DTO.Checkpoint import Checkpoint
from checkpoint_module.checkpoint_facade import CheckpointFacade

"""
This class is responsible for specifying the network to use

get_network is mandatory. Feel free to add to the class any methods you think are necessary.

weights folder: folder storing all the pretrained weights from the model zoo

checkpoints folder: previous trained jobs weights

models folder: networks from scratch (specific to gluoncv)
"""

class NetworkSetter():


    """
    Method that loads local weights for a model, used for transfer leaning or resuming a checkpoint

    Input:
    -------
    - Model name : string 
    - Checkpoint object.
    - number of classes for the model : int
    - transfer_learning : a bool that is True when doing transfer learning 

    Output:
    -------
    -Network
    """

    def get_local_weights(self,model_name,Checkpoint,nmbrofclasses,transfer_learning):
        
            
        if transfer_learning:
            print("TRANSFER LEARNING ... \n")
            modelname=open(Checkpoint.network_name_file,'r').read()
            if modelname != model_name:
                sys.exit(modelname+" is different from "+model_name+",model from checkpoint and chosen model should be the same")
            classesname=open(Checkpoint.classes_file,'r').read()
            nmbrofclasses=len(classesname.split(","))
            net = model_zoo.get_model(modelname, pretrained=False,classes=nmbrofclasses)
            net.load_parameters(Checkpoint.params_file)
            return net
        else:
            net = model_zoo.get_model(model_name, pretrained=False,classes=nmbrofclasses)
            net.load_parameters(Checkpoint.params_file)
            return net
   
    """
    Method that initializes a model without it's weights, in order to train from scratch.

    Input:
    ------
    -model_name : string 
    -number of classes for the model: int

    Output:
    -------
    -Network 
    """

    def get_scratch_model(self, model_name,nmbrofclasses):
        all_models = model_zoo.get_model_list()
        print("all models :")
        print(str(all_models))
        if model_name in all_models:
            net = model_zoo.get_model(model_name, pretrained=False,classes=nmbrofclasses)
        else:
            print("Model not found, Please refer to the defined models")
            return None
        return net

    """
    Method that loads a model with it's online pretrained weights
    
    Input:
    ------
    -model_name : string 
    -path :string that chooses where to download the online weights (default is inside the docker image)

    Output:
    -------
    -Network
    """



    def get_model_zoo_weights(self, path, model_name):
        all_models = model_zoo.get_model_list()
        if model_name not in all_models:
            print("the model name is not found, please choose a model name from the list below ")
            print(all_models)
            return None
        else:
            net = model_zoo.get_model(str(model_name), pretrained=True)
            return net


    """
    Method that decides wether the model is being built from scratch, with local weights, or with online
    weights. 
    
    Input:
    ------
    -Configuration object
    -number of classes : int 
    
    Output:
    -------
    -Network
    """

    def get_network(self, config: Configuration,nmbrofclasses):

        checkpoint_path = '/checkpoints/'
        pre_trained_path = '../weights/'
        weight_type = config.weights_type
        model_name = config.weights_name
        processor = config.processor
        num_gpu = config.gpus_count
        num_workers = config.num_workers
        checkpoint_model_name = config.model_name
        print(weight_type)
        transfer_learning=False
        if weight_type == 'pretrained_offline':
            transfer_learning=True
        if (weight_type == 'checkpoint') or (weight_type == 'pretrained_offline'):
            Checkpoint=CheckpointFacade().create_checkpoint(model_name, checkpoint_model_name)
            net = self.get_local_weights(model_name,Checkpoint,nmbrofclasses,transfer_learning)
        elif weight_type == 'from_scratch':
            net = self.get_scratch_model(model_name,nmbrofclasses)
        elif weight_type == 'pre_trained':
            net = self.get_model_zoo_weights(pre_trained_path, model_name)

        return net
