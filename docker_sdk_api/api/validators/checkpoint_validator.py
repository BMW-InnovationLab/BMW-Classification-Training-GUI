import os

def check_checkpoint_valid(checkpoint_path):
    checkpoint_name = checkpoint_path.split("/")[-1]
    if not os.path.exists(checkpoint_path):
        return False
    if not os.path.exists(os.path.join(checkpoint_path,checkpoint_name+".params")):
        return False
    if not os.path.exists(os.path.join(checkpoint_path,"classes.txt")):
        return False
    if not os.path.exists(os.path.join(checkpoint_path,"networkname.txt")):
        return False
    return True