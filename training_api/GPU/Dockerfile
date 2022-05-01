FROM nvidia/cuda:10.0-devel-ubuntu18.04
ENV CUDA_PKG_VERSION=10-0=10.0.130-1
ENV CUDA_VERSION=10.0.130
ENV PATH=/usr/local/nvidia/bin:/usr/local/cuda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV LD_LIBRARY_PATH=/usr/local/nvidia/lib:/usr/local/nvidia/lib64
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV NVIDIA_REQUIRE_CUDA=cuda>=10.0 brand=tesla,driver>=384,driver<385 brand=tesla,driver>=410,driver<411
ENV NCCL_VERSION=2.4.8
ENV CUDNN_VERSION=7.6.3.30
ENV MXNET_CUDNN_AUTOTUNE_DEFAULT=0
ARG DEBIAN_FRONTEND=noninteractive


# Fix Nvidia/Cuda repository key rotation
RUN sed -i '/developer\.download\.nvidia\.com\/compute\/cuda\/repos/d' /etc/apt/sources.list.d/*
RUN sed -i '/developer\.download\.nvidia\.com\/compute\/machine-learning\/repos/d' /etc/apt/sources.list.d/*  
RUN apt-key del 7fa2af80 &&\
    apt-get update && \
    apt-get  install -y wget && \
    wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-keyring_1.0-1_all.deb && \
    dpkg -i cuda-keyring_1.0-1_all.deb
    

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  locales \
  software-properties-common \
  python3-pip python3-dev \
    cuda-command-line-tools-10-0 \
  cuda-cublas-10-0 \
  cuda-cufft-10-0 \
  cuda-curand-10-0 \
  cuda-cusolver-10-0 \
  cuda-cusparse-10-0
RUN pip3 install --upgrade pip


RUN pip install gluoncv 
RUN pip install mxnet-cu100mkl
RUN pip install fastapi[all]
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
  dpkg-reconfigure --frontend=noninteractive locales && \
  update-locale LANG=en_US.UTF-8
ENV LANG en_US.UTF-8 

WORKDIR /app/src

COPY ./gluon_files/packages/gluoncv /usr/local/lib/python3.6/dist-packages/gluoncv

COPY ./midweight_heavyweight_solution .
RUN python3 webcrawler.py
COPY . ..
CMD ["uvicorn","main:app", "--host", "0.0.0.0","--reload"]
