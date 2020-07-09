"""
Imports: 
"""
import os
from dataset_module.dataset_converter import DatasetConverter
from dataset_module.dataset_splitter import DatasetSplitter
from dataset_module.dataset_validator import DatasetValidator
from dataset_module.dataset_augmentation import DatasetAugmentation
from DTO.Configuration import Configuration
from DTO.Dataset import Dataset

"""
This class is responsible for dataset preparation

prepare_dataset is mandatory. feel free to add to the class any methods you think are necessary.

"""


class DatasetFacade():

    def __init__(self):
        self.validator = DatasetValidator()
        self.splitter = DatasetSplitter()
        self.converter = DatasetConverter()
        self.augmenter = DatasetAugmentation()

    """
    The dataset Facade main method that will handle everything related to your dataset 

    Input:
    ------
        - Dataset object


    """


    # todo change dataset path
    def prepare_dataset(self, dataset):
        dataset_path = os.path.join("/data/", dataset.dataset_name)
        valid = self.validator.validate_dataset(dataset_path)
        if not valid:
            print("Dataset is not valid check documentation")
        if valid:
            print("Dataset is valid preceding ")
            self.splitter.split_dataset(dataset_path, dataset.training_ratio, dataset.validation_ratio,
                                        dataset.testing_ratio)


    """
    Additional Method that calls the dataset_augmentation class (needed because of the built-in gluoncv augmentation) 

    """
    def augment_dataset(self, config , dataset_path):
        train_data, val_data, test_data = self.augmenter.data_augmenting(config, dataset_path)
        return train_data,val_data,test_data

    
    """
    Method that returns the class number of the dataset
    """

    def get_classes_number(self, dataset):
        dataset_path = os.path.join("/data/", dataset.dataset_name)
        i=len(os.listdir(dataset_path))
        print("THE NUMBER OF CLASSES="+str(i))
        return i
