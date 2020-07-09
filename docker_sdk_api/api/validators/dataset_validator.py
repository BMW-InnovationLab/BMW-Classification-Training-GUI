import os
    
def check_dataset_valid(dataset_path):
    folders = []
    files = []
    supportedFormat = ('jpg', 'png', 'jpeg')
    if os.path.exists(dataset_path) and os.path.isdir(dataset_path):
        nameDir = os.listdir(dataset_path)

        if len(nameDir) <=0:
            return False

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