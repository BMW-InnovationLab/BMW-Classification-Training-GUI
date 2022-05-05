#!/bin/bash

sudo apt-get install jq

json_path='docker_sdk_api/api/data/paths.json'

# change training api image name based on architecture CPU/GPU
change_image_name(){
jq '."image_name"="'$1'"'  "$json_path" >temp.$$.json && mv temp.$$.json "$json_path"
}

adjust_base_dir(){

    #Adjust basedir path
    python3 adjust_basedir_path.py
}

CPU_docker_image="classification_training_api_cpu"
GPU_docker_image="classification_training_api_gpu"
echo '----------------------------------------------'
echo 'Please choose docker image build architecture'

PS3='Please enter your choice: '
options=("GPU" "CPU")

adjust_base_dir

select opt in "${options[@]}"
do
    case $opt in
        "GPU")
            change_image_name "$GPU_docker_image"
            break
            ;;
        "CPU")
            
            change_image_name "$CPU_docker_image"
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

 
# This will install docker following [https://docs.docker.com/install/linux/docker-ce/ubuntu/]
sudo apt-get remove docker docker-engine docker.io
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common



curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install -y docker-ce 
sudo groupadd docker
sudo usermod -aG docker ${USER}
docker run hello-world


#This will install docker-compose following [https://docs.docker.com/compose/install/]
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version