from DTO.Configuration import Configuration
from configuration_module.configuration_setter import ConfigurationSetter
from configuration_module.network_setter import NetworkSetter




"""
This class is responsible for handling all the training jon configuration

The main method is configure job.

"""


class ConfigurationFacade:
    def __init__(self):
        self.jobSetter = ConfigurationSetter()
        self.networkSetter = NetworkSetter()

    def get_config(self):
        config_object = self.jobSetter.get_config()
        return config_object

    def default_param(self):
        jsonConfigPretty = self.jobSetter.configuration_sample()
        return jsonConfigPretty

    """
    Method to set the configuration parameters 

    Input
    ------
     - Configuration Object

    Output
    ------
     - Configuration Object
    """

    def configure_job(self, config: Configuration):
        print("CONFIGURATION INFO: \n","Network: "+ str(config.weights_name) , "\n Weight Type: " + str(config.weights_type) , "\n Device :" + str(config.gpus_count),"\n Batch-Size :" + str(config.batch_size),"\n num-workers :" + str(config.num_workers))
        configuration_object = self.jobSetter.set_config(config)
        return configuration_object
    """
    Method to build the model based on the configuration parameters

    Input:
    ------
    -Configuration Object 
    -number of classes : int 
    
    Output:
    -------
    -Network
    """
        
    def get_network(self,config:Configuration,nmbr_of_classes):
        network = self.networkSetter.get_network(config,nmbr_of_classes)
        return network
