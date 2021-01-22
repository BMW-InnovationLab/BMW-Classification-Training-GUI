""" Stores functions that perform miscellaneous tasks """

import os
from pathlib import Path
import shutil
from PIL import Image
from io import BytesIO
import mxnet as mx
from mxnet import gluon
import gluoncv as gcv
from distutils import dir_util
import datetime
import uuid
import json

MODELS_PATH = '/models'


def get_models_info(model_config):
    """ Gets the names and inference type of all models present in /models """

    if not os.path.isdir(MODELS_PATH):
        raise FileNotFoundError("The /models directory was not found!")
    dst_dir = os.path.join('/root','.mxnet','models')
    src_dir = MODELS_PATH
    dir_util.copy_tree(src_dir, dst_dir)
    for model_name in os.listdir(MODELS_PATH):
        if(os.path.isdir(MODELS_PATH+'/'+model_name)):
            if model_name not in model_config.loaded_models:
                model_config.loaded_models[model_name] = load_model(model_config,model_name)
    
    for key in model_config.loaded_models.keys():
        if key not in os.listdir(MODELS_PATH):
            del model_config.loaded_models[key]
            del model_config.models_hash[key]
            del model_config.labels_hash[key]
    
    return model_config.models_hash


def load_model(model_config, model_name):
    classes = get_classes(model_name)
    root=os.path.join('/root', '.mxnet', 'models')
    root = os.path.expanduser(root)
    file_path = os.path.join(root, model_name)
    with open(file_path+'/config.json') as f:
        data= json.load(f)
    config = data
    if(config["cpu"] == True): 
        ctx = [mx.cpu()]
        model_config.models_config[model_name] = 'cpu'
    else:
        ctx = [mx.gpu(int(0))]
        model_config.models_config[model_name] = 'gpu'
    net = gluon.nn.SymbolBlock.imports(file_path+"/"+model_name+"-symbol.json", ['data'], file_path+"/"+model_name+"-0000.params", ctx=ctx)
    net.classes = classes
    hash_key=str(uuid.uuid4())
    model_config.models_hash[model_name] = hash_key
    class_dict = {}
    for class_name in classes:
        hash_key=str(uuid.uuid4())
        class_dict[class_name] = hash_key
        model_config.labels_hash[model_name] = class_dict
    return net


def get_classes(model_name):
    """ Get classes used in a specific model """

    root=os.path.join('/root', '.mxnet', 'models')
    root = os.path.expanduser(root)
    file_path = os.path.join(root, model_name , 'classes.txt')
    classFile = open(file_path,'r')
    message = classFile.read()
    new_classes = message.split(',')
    classFile.close()
    return new_classes



def get_models_hash(model_name,model_config):
    """ Get model name if it's hashed """

    for key in model_config.models_hash:
        if(key == model_name):
            return model_name
        else:
            if(model_config.models_hash[key] == model_name):
                model_name = key
                return model_name
