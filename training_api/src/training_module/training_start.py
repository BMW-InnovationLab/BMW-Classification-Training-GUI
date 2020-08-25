import mxnet as mx
import numpy as np
import os, time, shutil
import argparse

from mxnet import gluon, image, init, nd
from mxnet import autograd as ag
from mxnet.gluon import nn
from mxnet.gluon.data.vision import transforms
from gluoncv.utils import makedirs
from gluoncv.model_zoo import get_model
import json
from DTO.Configuration import Configuration



"""
This class is responsible for training the model

model_trainer is mandatory. Feel free to add to the class any methods you think are necessary.


"""


class TrainingStart():

    """

    In this class input and output are framework dependant

    """


    """
    Method that loads the context (gpu or cpu) for the training

    Input:
    ------
    -processor: string(CPU or GPU)
    -gpus_count: int 

    Ouput:
    ------
    -List containing gpus or cpus to train on
    """
    def get_ctx(self, processor, gpus_count):
        gpu_count=mx.util.get_gpu_count()
        print(gpu_count)
        if gpu_count>0:
            ctx = [mx.gpu(i) for i in gpus_count] if gpus_count[0] != -1 else [mx.cpu()]
        else:
            ctx=[mx.cpu()]
        print(ctx)
        return ctx
    """
    Method that creates a dictionary that will be used for the inference

    Input:
    ------
    -Processor: string (CPU or GPU)

    Output:
    --------
    -Dictionary containing all the information needed for the inference
    """
    def define_inference_configuration(self,processor):
        if processor=="CPU":
            configuration ={
                "configuration" : {
                    "gpu" : False,
                    "cpu" : True,
                    "max_number_of_predictions": 3,
                    "minimum_confidence": 0.8
                },
                "inference_engine_name": "classification"
            }
        else:
            configuration ={
                "configuration" : {
                    "gpu" : True,
                    "cpu" : False,
                    "max_number_of_predictions": 3,
                    "minimum_confidence": 80
                },
                "inference_engine_name": "classification"
            }

        return configuration
    """
    Method that writes the name of the classes in a text file to be exported after training
    
    Input:
    ------
    -model_path : string (path of the dataset)
    -model_name : string (name of the export)

    """
    def get_classes(self, model_path, model_architecture, model_name):
        MODELS_PATH = model_path
        i = 0
        classes = ''
        for directory in sorted(os.listdir(MODELS_PATH)):
            i = i + 1
            if i == 1:
                classes = classes + directory
            else:
                classes = classes + ',' + directory

        class_File = open('/checkpoints/' + model_architecture+'/'+model_name + '/classes.txt', 'w')
        class_File.write(classes)
        class_File.close()
        return i
    """
    Method that initializes all training parameters
    
    Input:
    ------
    -Configuration Object
    -model_path: string
    -network_model: Gluoncv model
    -model_name : string

    Output:
    -------
    - The trainer object responsible for training 
    - The loss function
    - The metric
    """
    def model_trainer(self, config: Configuration, model_path, network_model, model_name):
        model_checkpoint_path = '/checkpoints/'+ config.weights_name+'/'+model_name
        inference_configuration=self.define_inference_configuration(config.processor)

        if not os.path.exists(model_checkpoint_path):
            os.makedirs(model_checkpoint_path, exist_ok=True)
        with open(model_checkpoint_path+'/config.json','w') as outfile:
             json.dump(inference_configuration, outfile)
        classes = self.get_classes(model_path, config.weights_name, model_name)
        ctx = self.get_ctx(config.processor, config.gpus_count)

        if (config.weights_type == "from_scratch"):
            net = network_model
            network = str(net)


            if (config.Xavier == True):
                net.initialize(init.Xavier(), ctx=ctx)
            else:
                net.initialize(mx.init.MSRAPrelu(), ctx=ctx)

        elif (config.weights_type == 'pre_trained') or (config.weights_type == 'pretrained_offline'):
            net = network_model

            network = str(net)
            network = str(net) 
            print(net.name)
            output_exists=hasattr(net,'output') ##check if output exists
            network_name=net.name ##get the model's name
            
    
            if("resnext" in network_name): ##check if model is resnext
                with net.name_scope():
                        net.output = nn.Dense(classes)
                net.initialize()
            elif(output_exists): ##check if output exists
                If_HybridSequential=False
                if ("HybridSequential" in str(net.output)): ##check if output contains HybridSequential
                    If_HybridSequential = True
                
                if If_HybridSequential :
                    If_HybridSequential_2 = len(net.output) ##check if HybridSequential contains more than 2 items
                    if(If_HybridSequential_2>2):
                        with net.name_scope():
                            print('2------------------------')
                            
                            print('------------------------')
                            x = nn.HybridSequential()
                            x.add(nn.Conv2D(classes, 1, strides=1))
                            x.add(net.output[1])
                            x.add(net.output[2])
                            x.add(net.output[3])
                            net.output = x
                    else:
                        with net.name_scope():
                            print('3------------------------')
                            # print(net.output[1])
                            print('------------------------')
                            x = nn.HybridSequential()
                            x.add(nn.Conv2D(classes, 1, strides=1))
                            x.add(net.output[1])
                            net.output = x
                else:
                    print("4")
                    with net.name_scope():
                        net.output = nn.Dense(classes)
                if(config.Xavier == True):
                    net.output.initialize(init.Xavier(), ctx = ctx)
                else:
                    net.output.initialize(mx.init.MSRAPrelu(), ctx = ctx)
            else:
                print("5")
                with net.name_scope():
                    net.fc = nn.Dense(classes)
                if(config.Xavier == True):
                    net.fc.initialize(init.Xavier(), ctx = ctx)
                else:
                    net.fc.initialize(mx.init.MSRAPrelu(), ctx = ctx)
        else:
            net = network_model
        net.collect_params().reset_ctx(ctx)
        net.hybridize()

        trainer = gluon.Trainer(net.collect_params(), 'sgd', {
            'learning_rate': config.lr, 'momentum': config.momentum, 'wd': config.wd})

        metric = mx.metric.Accuracy()
        L = gluon.loss.SoftmaxCrossEntropyLoss()

        return trainer, metric, L
