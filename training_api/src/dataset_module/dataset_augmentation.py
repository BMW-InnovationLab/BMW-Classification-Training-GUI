"""
Imports
"""

from mxnet.gluon.data.vision import transforms
import  os
from mxnet import gluon
from DTO.Configuration import Configuration
"""
   This class is an optional class.
   It was added because GluonCV has built in support for augmentation
   This method doesnt go inside the prepare dataset function of the facade but it is called from the facade as a standalone method

"""



class DatasetAugmentation():

    """
    The main method of this class. It augments the dataset based on the config of the training job.


    Input:
    ------
        -  path of your dataset
        -  configuration DTO

    
    """



    def data_augmenting(self,config : Configuration, dataset_path):
        jitter_param = config.jitter_param
        lighting_param = config.lighting_param
        batch_size =config.batch_size * max(len(config.gpus_count),1)
        num_workers=config.num_workers
        if config.data_augmenting:
            transform_train = transforms.Compose([
                transforms.RandomResizedCrop(224),
                transforms.RandomFlipLeftRight(),
                transforms.RandomColorJitter(brightness=jitter_param, contrast=jitter_param,
                                             saturation=jitter_param),
                transforms.RandomLighting(lighting_param),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])

        else:
            transform_train = transforms.Compose([
                transforms.Resize(size=(224,224)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])

        transform_test = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])

        ################################################################################
        # With the data augmentation functions, we can define our data loaders:
        # todo  use variable for path
        #
        path = dataset_path
        train_path = os.path.join(path, 'train')
        val_path = os.path.join(path, 'val')
        test_path = os.path.join(path, 'test')

        train_data = gluon.data.DataLoader(
            gluon.data.vision.ImageFolderDataset(train_path).transform_first(transform_train),
            batch_size=batch_size, shuffle=True, num_workers=num_workers)

        val_data = gluon.data.DataLoader(
            gluon.data.vision.ImageFolderDataset(val_path).transform_first(transform_test),
            batch_size=batch_size, shuffle=False, num_workers=num_workers)

        test_data = gluon.data.DataLoader(
            gluon.data.vision.ImageFolderDataset(test_path).transform_first(transform_test),
            batch_size=batch_size, shuffle=False, num_workers=num_workers)

        return train_data, val_data,test_data

