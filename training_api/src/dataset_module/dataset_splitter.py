"""
Imports: Import whatever necessary. 
"""
import shutil

"""
This class is responsible for dataset validation

split_dataset is mandatory. feel free to add to the class any methods you think are necessary.

"""
import os


class DatasetSplitter():
    """
    The main method of this class. 
    Splits the dataset based on the ratios defined in the dataset object.


    Input:
    ------
        - training_ratio
        - validation_ratio (optional)
        - testing_ratio (optional)
    
    """

    def split_dataset(self, datasetPath, training_ratio, validation_ratio, testing_ratio):
        for folder_name in os.listdir(datasetPath):
            files = []
            path = os.path.join(datasetPath, folder_name)
            os.makedirs('../dataset/train/' + folder_name)
            os.makedirs('../dataset/val/' + folder_name)
            os.makedirs('../dataset/test/' + folder_name)
            # r=root, d=directories, f = files
            for r, d, f in os.walk(path):
                images_num = len(f)
                train_image_num = int(images_num * training_ratio / 100)
                if (validation_ratio is not None):
                    val_image_num = int(images_num * validation_ratio / 100)
                else:
                    val_image_num = 0
                if (testing_ratio is not None):
                    test_image_num = int(images_num * testing_ratio / 100)
                else:
                    test_image_num = 0
                for file in f:
                    files.append(file)

            for i in range(0, train_image_num):
                src_dir = path + '/' + files[i]
                dst_dir = '../dataset/train/' + folder_name
                shutil.copy(src_dir, dst_dir)

            for i in range(train_image_num, train_image_num + val_image_num):
                src_dir = path + '/' + files[i]
                dst_dir = '../dataset/val/' + folder_name
                shutil.copy(src_dir, dst_dir)

            for i in range(train_image_num + val_image_num, images_num):
                src_dir = path + '/' + files[i]
                dst_dir = '../dataset/test/' + folder_name
                shutil.copy(src_dir, dst_dir)
