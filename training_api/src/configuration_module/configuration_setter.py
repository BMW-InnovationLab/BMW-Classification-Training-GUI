"""
Imports
"""
from DTO.Configuration import Configuration
import json



"""
Class that handles the configuration of the training job
"""

class ConfigurationSetter():

    """
    Method to get the values of the config object

     
    Output
    ------
     - Configuration Object

    """

    def get_config(self) -> Configuration:
        config = Configuration()
        with open("../config_templates/configuration.json") as jsonReader:
            jsonData = json.load(jsonReader)
        baseConfig = jsonData['configuration']
        config.lr = baseConfig['lr']
        config.lr_factor = baseConfig['lr_factor']
        config.jitter_param = baseConfig['jitter_param']
        config.lighting_param = baseConfig['lighting_param']
        config.momentum = baseConfig['momentum']
        config.MSRAPrelu = baseConfig['MSRAPrelu()']
        config.Xavier = baseConfig['Xavier()']
        config.gpus_count = baseConfig['gpus_count']
        config.num_workers = baseConfig['num_workers']
        config.wd = baseConfig['wd']

        hyperParm = jsonData['hyperParam']
        config.batch_size = hyperParm['batch_size']
        config.epochs = hyperParm['epochs']
        config.weights_type = hyperParm['weights_type']
        config.weights_name = hyperParm['weights_name']
        config.processor = hyperParm['processor']
        config.data_augmenting=baseConfig['data_augmenting']
        return config


    """
    Method to set the values of the config object

    Input
    -----
     - Configuration Object
     
    Output
    ------
     - Configuration Object

    """


    def set_config(self, userConfig: Configuration) -> Configuration:
        jsonFile = open('../config_templates/configuration.json')
        jsonData = json.load(jsonFile)
        baseConfig = jsonData['configuration']
        hyperParm = jsonData['hyperParam']
        modelParm = jsonData['modelParam']
        if userConfig.lr is None:
            userConfig.lr = baseConfig['lr']

        if userConfig.lr_factor is None:
            userConfig.lr_factor = baseConfig['lr_factor']

        if userConfig.jitter_param is None:
            userConfig.jitter_param = baseConfig['jitter_param']

        if userConfig.lighting_param is None:
            userConfig.lighting_param = baseConfig['lighting_param']

        if userConfig.momentum is None:
            userConfig.momentum = baseConfig['momentum']

        if userConfig.MSRAPrelu is None:
            userConfig.MSRAPrelu = baseConfig['MSRAPrelu()']

        if userConfig.Xavier is None:
            userConfig.Xavier = baseConfig['Xavier()']

        if userConfig.gpus_count is None:
            userConfig.gpus_count = baseConfig['gpus_count']

        if userConfig.num_workers is None:
            userConfig.num_workers = baseConfig['num_workers']

        if userConfig.wd is None:
            userConfig.wd = baseConfig['wd']

        if userConfig.batch_size is None:
            userConfig.batch_size = hyperParm['batch_size']

        if userConfig.epochs is None:
            userConfig.epochs = hyperParm['epochs']
        if userConfig.processor is None:
            userConfig.processor = hyperParm['processor']

        if userConfig.weights_type is None:
            userConfig.weights_type = modelParm['training_mode']

        
        if userConfig.weights_name is None:
            userConfig.weights_name = modelParm['weights_name']

        if userConfig.model_name is None:
            userConfig.model_name= modelParm["model_name"]
        if userConfig.new_model is None:
            userConfig.new_model=modelParm["new_model"]
        if userConfig.data_augmenting is None:
            userConfig.data_augmenting=baseConfig['data_augmenting']
        return userConfig
        

    """
    Method to return the default values of the config object

    Output:
    -------

     - Configuration Object


    """
    def configuration_sample(self):

        jsonFile = open('../config_templates/configuration.json')
        jsonData = json.load(jsonFile)
        jsonPretty = json.dumps(jsonData , indent=4 , sort_keys=True)
        return jsonPretty