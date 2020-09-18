#!/bin/bash

#Adjust basedir path
python3 adjust_basedir_path.py

pip3 install pyyaml --user

#This will install docker-compose following [https://docs.docker.com/compose/install/]
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version