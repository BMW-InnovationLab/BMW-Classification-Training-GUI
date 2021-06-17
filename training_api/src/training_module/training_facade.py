"""
Imports
"""

from DTO.Configuration import Configuration
from training_module.training_start import TrainingStart
from training_module.training_testing import TrainingTesting

"""
Class repsonsible for training and exporting the model

"""


class TrainingFacade():
    def __init__(self):
        self.start = TrainingStart()
        self.train = TrainingTesting()

    """
    Method that initializes all training parameters and then starts it and exports it when it's done

    Input:
    ------
    -Configuration Object
    -train_data : dataset for training
    -valid_data : dataset for validating
    -test_data : dataset for testing
    -net : the network/model to perform training on.
    -dataset_name : the name of the dataset

    """

    def training(self, config: Configuration, train_data, valid_data, test_data, net, dataset_name):
        model_name = config.new_model
        model_path = "/data/" + dataset_name
        trainer, metric, L = self.start.model_trainer(config, model_path, net, model_name)
        ctx = self.start.get_ctx(config.processor, config.gpus_count)
        self.train.training_loop(model_name, train_data, valid_data, test_data, trainer, metric, L, config, net, ctx)
