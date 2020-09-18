""" Stores classes and functions that deal with ML models """

import matplotlib
matplotlib.use('Agg')
import os
import mxnet as mx
import gluoncv as gcv
from gluoncv.data.transforms import presets
# from matplotlib import pyplot as plt
import datetime
from pathlib import Path
from mxnet import nd
from gluoncv.data.transforms.presets.imagenet import transform_eval
import operator
from collections import OrderedDict
import json

def predict(images, model_name, model_config):
    """ Runs the model to infer on the given image

    Arguments:
        image {NDArray Image} -- image to do prediction on
        model_name {str} -- name of the model to be used for prediction

    Returns:
        dict -- dictionary containing the predicted class 
    """

    outputs = {}

    net = model_config.loaded_models[model_name]


    # apply default data preprocessing

    transformed_img = transform_eval(images)
    if(model_config.models_config[model_name]== 'gpu'):
        transformed_img = transformed_img.copyto(mx.gpu(0))
    # run forward pass to obtain the predicted score for each class
    pred = net(transformed_img)
    # map predicted values to probability by softmax
    prob =  nd.softmax(pred)[0].asnumpy() * 100
    #prob = pred[0].asnumpy()

    with open(os.path.join("/models",str(model_name),'config.json')) as config_file:
        data = json.load(config_file)
        max_number_of_predictions = data['configuration']['max_number_of_predictions']
        minimum_confidence = data['configuration']['minimum_confidence']

    if(max_number_of_predictions>len(net.classes)):
        max_number_of_predictions=len(net.classes)

    if(max_number_of_predictions<1):
        max_number_of_predictions=1

    

    # find the 5 class indices with the highest score
    ind = nd.topk(pred, k=max_number_of_predictions)[0].astype('int').asnumpy().tolist()
    

    
    if(minimum_confidence>float(prob[ind[0]])):
        minimum_confidence=float(prob[ind[-1]])

        

    for i in range(max_number_of_predictions):

        if(float(prob[ind[i]])>minimum_confidence):
            outputs[net.classes[ind[i]]] = float(prob[ind[i]])
            outputs_descending = OrderedDict(sorted(outputs.items(), 
                                  key=lambda kv: kv[1], reverse=True))
                               
    return outputs_descending


