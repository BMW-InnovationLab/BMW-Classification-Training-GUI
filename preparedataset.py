import json 
import os 
import argparse
import sys
import shutil
def parseargs():
    parser= argparse.ArgumentParser(description="User Adapter")
    parser.add_argument('--datasetpath', type=str,default=None)
    args=parser.parse_args()
    return args

def check_arguments(args):
    if args.datasetpath is None:
        sys.exit("please specify the dataset path")
    
args=parseargs()
check_arguments(args)

files= os.listdir(args.datasetpath)

if os.path.exists("customdataset"):
    shutil.rmtree("customdataset")

for i in files:
    if i.endswith(".json"):
        jsonfile=os.path.join(args.datasetpath,i)
        jsonfile=open(jsonfile,'rb')
        jsonfile=json.load(jsonfile)
        for j in jsonfile["flags"]:
            if jsonfile["flags"][j] == True:
                if j != "__ignore__":
                    os.makedirs("customdataset/"+j,exist_ok=True)
                    shutil.copy(os.path.join(args.datasetpath,jsonfile["imagePath"]),"customdataset/"+j)


                




