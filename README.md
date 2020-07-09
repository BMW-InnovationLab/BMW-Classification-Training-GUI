

#  Gluoncv Classification API 

This repository allows you to get started with training a State-of-the-art Deep Learning model with little to no configuration needed! You provide your labeled dataset and you can start the training right away. This repo is based on [Gluoncv's](https://gluon-cv.mxnet.io/build/examples_classification/index.html) Framework. You can check the networks stats [here](https://gluon-cv.mxnet.io/model_zoo/classification.html)

![api endpoint](./docs/training_api.gif)

## Prerequisites

- Linux or windows
- NVIDIA Drivers (410.x or higher) (optional : for gpu training )
- Docker CE latest stable release 
- NVIDIA Docker 2 (optional: for gpu training)



#### How to check for prerequisites

**To check if you have docker-ce installed:** 

​               `docker --version`

**To check if you have docker-compose installed:**

​                `docker-compose --version`

**To check if you have nvidia-docker installed:**

​                `nvidia-docker --version`

**To check your nvidia drivers version, open your terminal and type the command `nvidia-smi`**

![](./docs/nvidiasmi.gif)





#### Installing Prerequisites

\-Install docker by running the follwing command

​       `chmod +x install_prerequisites.sh && source install_prerequisites.sh`

\- Install NVIDIA Drivers (410.x or higher) and NVIDIA Docker for GPU training by following the [official docs](https://github.com/nvidia/nvidia-docker/wiki/Installation-(version-2.0))

## Label your own dataset

To classify your own images for training, you can install the [labelme](https://github.com/wkentaro/labelme/) labeling tool. Check the specific classification [documentation](https://github.com/wkentaro/labelme/tree/master/examples/classification) to know more about labeling using labelme.

## Dataset Folder Structure

We offer a sample dataset to use for training. It's called "dummy_dataset".

The following is an example of how a dataset should be structured. Please put all your datasets in the data folder.

```sh
├──data/
    ├──dummy_dataset/
        ├── class
        │   ├── img_1.jpg
        │   └── img_2.jpg
        ├── class2
            |__img_0.jpg
            │── img_1.jpg
            │── img_2.jpg

```



## Build The Docker Image

### Lightweight, Midweight and Heavyweight Solution

**Lightweight :** Building the docker image without pre-downloading any online pre-trained weights, the online weights will be downloaded when needed after running the image.

**Midweight:** Downloading the online pre-trained weights during the docker image build. Just open the json file "networks.json",change the values of the networks you need to "true". 

**Heavyweight :** Downloading all the online pre-trained weights during the docker image build. Just open the  json file "networks.json" and change the value of "select_all" to "true".

In order to build the project run the following command from the project's root directory:  

- For GPU:

```sh
sudo docker build -t classification_training_gpu -f ./GPU/Dockerfile .
```

- For CPU:

```sh
sudo docker build -t classification_training_cpu -f ./CPU/Dockerfile .
```



### Behind a proxy

- For GPU:

```sh
sudo docker build --build-arg http_proxy='' --build-arg https_proxy='' -t classification_training_gpu -f ./GPU/Dockerfile .
```

- For CPU:

```sh
sudo docker build --build-arg http_proxy='' --build-arg https_proxy='' -t classification_training_cpu -f ./CPU/Dockerfile .
```

## 

## Run the docker container

To run the API, go the to the API's directory and run the following:

- For GPU:

```sh
sudo nvidia-docker run --shm-size 8G -itv $(pwd):/app -p <docker_host_port>:8000 classification_training_gpu
```

- For CPU:

```sh
sudo docker run --shm-size 8G -itv $(pwd):/app -p <docker_host_port>:8000 classification_training_cpu
```

## Prepare Custom Dataset

After running the docker container, run this command if you labeled your dataset with the labelme labeling-tool:

```sh 
python3 preparedataset.py --datasetpath <your_resulting_folder>
```

A new folder called **customdataset** will be created, just copy it into **data** in order to train.

This is how the **customdataset** folder should look like :

```sh
├──customdataset/
        ├── class
        │   ├── img_1.jpg
        │   └── img_2.jpg
        ├── class2
            |__img_0.jpg
            │── img_1.jpg
            │── img_2.jpg

```

## 

## API Endpoints

To see all available endpoints, open your favorite browser and navigate to:

```
http://localhost:<docker_host_port>/docs
```



### Endpoints summary

#### /dataset(POST)

Prepares the dataset.

**Parameters:**

- dataset_name : the name of your dataset folder ( "dummy_dataset" to use our sample dataset)

- training_ratio : percentage of the dataset needed for training (default value = 80)

- validation_ratio : percentage of the dataset needed for validation (default value = 10)

- testing_ratio : percentage of the dataset needed for testing (default value = 10)

#### /config(POST)

Configures and runs the training. After Training, the model will be saved in a folder called checkpoints.


**Parameter:**

- lr : learning rate (used for training) (default value: lr=0.001)

- momentum : momentum (used for training) (default value: momentum=0.9)

- wd : weight-decay (used for training) (default value: wd=0.0001)

- lr_factor : learning rate factor (used for training) (default value: lr_factor=0.75)

- gpus_count : list of gpus (used for training) , choose [-1] for CPU Training(default value: gpus_count=[0]) 

- num_workers : number of workers (used for training) (default value: num_workers= 8 )

- jitter_param : jitter (used for data augmentation) (default value: jitter_param=0.4)

- lighting_param : lighting (used for data augmentation) (default value: lighting_param=0.1)

- Xavier : true or false (used for weights initialization) (default value : Xavier=true)

- MSRAPrelu : true or false (used for weights initialization) (default value: MSRAPrelu=false)

- batch_size : batch size (used for training) (default value: batch_size=1)

- epochs : epochs (used for training) (default value: epochs=3)

- processor : CPU or GPU (used for inference) (default value: processor="CPU")

- weights_type : how to do the training: (default value: weights_type="from_scratch")
  - pre_trained: transfer learning from a pretrained network using online weights
  - pretrained_offline : transfer learning from a pretrained network using local weights
  - checkpoint: training the network using local weights
  - from_scratch : training the network from scratch
  
- weights_name : name of the network (used for training) (default value: weights_name="resnet50_v1")

- model_name : name of folder used to load local weights (for checkpoint or pretrained_offline) (default value: model_name="test_18")

- new_model : name of folder used to save resulting weights. (default value: new_model="test_19")

- data_augmenting : decides wether to augment the data using our custom data_augmentation funtion or not ( default value: data_augmenting="True")

  #### /get(GET)

  returns available networks list

  ![api](./docs/get.png)

![](./docs/apiendpoint.png)



## Acknowledgements


Roy Anwar,Beirut, Lebanon

