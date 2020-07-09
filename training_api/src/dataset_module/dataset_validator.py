"""
Imports: Import whatever necessary. 
"""
import os

"""
This class is responsible for dataset validation

validate_dataset is mandatory. feel free to add to the class any methods you think are necessary.

"""


class DatasetValidator():
    """
    The main method of this class. It checks if the folder structure of your dataset matches what is required by the training process.


    Input:
    ------
        -  path of your dataset

    
    Output:
    -------
        - True if the dataset is valid else otherwise
    """

    def validate_dataset(self, dataset_path ):
        folders = []
        files = []
        supportedFormat = ('jpg', 'png', 'jpeg')
        if os.path.exists(dataset_path) and os.path.isdir(dataset_path):
            nameDir = os.listdir(dataset_path)
            for i in nameDir:
                if os.path.isdir(os.path.join(dataset_path, i)):
                    folders.append(os.path.join(dataset_path, i))
                else:
                    return False

            for i in folders:
                
                for root, dir, file in os.walk(i, topdown=True):
                    for i in file:
                        files.append(i)

            for ext in files:
                fileFormat = ext.split('.').pop()
                if fileFormat not in supportedFormat:
                    return False
            return True
        else:
            return False
