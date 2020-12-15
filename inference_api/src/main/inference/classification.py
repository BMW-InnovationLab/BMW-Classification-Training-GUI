import os
import inference.model_utils as model_utils
import inference.utils as utils 
from jsonschema import validate 
from inference.model import ModelConfig
from io import BytesIO
import mxnet as mx
import asyncio
import json
from PIL import Image, ImageDraw, ImageFont
from inference.base_inference_engine import AbstractInferenceEngine
from inference.exceptions import InvalidModelConfiguration, InvalidInputData, ApplicationError , ModelNotLoaded
import os
import shutil
import argparse
import numpy as np
from tqdm import tqdm
from mxnet import image
from mxnet import gluon, autograd
from mxnet.gluon.data.vision import transforms
import numpy    
import gluoncv
from gluoncv.utils.viz import get_color_pallete
import sys
from gluoncv.loss import *
from gluoncv.utils import LRScheduler
from gluoncv.model_zoo.segbase import *
from gluoncv.model_zoo import get_model
from gluoncv.utils.parallel import *
from gluoncv.data import get_segmentation_dataset
from gluoncv.data.transforms.presets.segmentation import test_transform
from gluoncv.data.pascal_voc.segmentation import VOCSegmentation 
from contextlib import contextmanager
from mxnet import ndarray as nd



class InferenceEngine(AbstractInferenceEngine):

	def __init__(self, model_path):
		# Initialize all class attributes needed in order to load a model
		# i.e. self.attribute = None

		self.model_name=os.path.basename(model_path)
		self.model_config=None
		self.models=None
		self.font = ImageFont.truetype("/main/fonts/DejaVuSans.ttf", 20)
		super().__init__(model_path)
    
	
	def free(self):
    	
		pass
	#Function to load models for inference
	def load(self):

		with open(os.path.join(self.model_path, 'config.json')) as f:
			data = json.load(f)
		self.model_config = ModelConfig()

		self.models = utils.get_models_info(self.model_config)

		classes=open(os.path.join(self.model_path,'classes.txt'))
		self.labels=classes.read().split(',')

		
			

		try:
			self.validate_json_configuration(data)
			self.set_model_configuration(data)
		except ApplicationError as e:
			raise e


	#Decide wether a json or an image should be returned
	async def infer(self, input_data, draw, predict_batch):

		response = None

		if not draw:
			response=await self.processing(input_data)
			return response
		else:
			try:
				self.draw_image(input_data, response)
			except ApplicationError as e:
				raise e
			except Exception as e:
				raise e
	
	#Called when infering multiple images
	async def run_batch(self, input_data, draw, predict_batch):
		result_list = []
		for image in input_data:
			post_process = await self.infer(image, draw, predict_batch)
			if post_process is not None:
				result_list.append(post_process)
		return result_list
	
	#Returns image, returns None in this case because only a json response is needed
	def draw_image(self, input_data, response):
		"""
		Draws on image and saves it.
		:param input_data: A single image
		:param response: inference response
		:return:
		"""
		# draw on image
		return None
		# save image result.jpg in /main
		# i.e. image.save('/main/result.jpg', 'PNG')

	
	#Validate configuration 
	def validate_configuration(self):
		# check if classes.txt file exists
		if not os.path.exists(os.path.join(self.model_path, 'classes.txt')):
			raise InvalidModelConfiguration('classes.txt not found')
		# check if configurations and weights file exists
		if not os.path.exists(os.path.join(self.model_path, 'config.json')):
			raise InvalidModelConfiguration('config.json not found')
		if not os.path.exists(os.path.join(self.model_path, self.model_name+'.params')):
			raise InvalidModelConfiguration(self.model_name+'.params not found')
		if not os.path.exists(os.path.join(self.model_path, self.model_name+'.params')):
			raise InvalidModelConfiguration(self.model_name+'-0000.params not found')
		if not os.path.exists(os.path.join(self.model_path, self.model_name+'-symbol.json')):
			raise InvalidModelConfiguration(self.model_name+'-symbol.json not found')
		return True
	
	#load the model configuration
	def set_model_configuration(self, data):
		self.configuration['inference_engine'] = data['inference_engine_name']
		self.configuration['configuration'] = data
	
	#Validate the json configuration file
	def validate_json_configuration(self, data):
		with open(os.path.join('inference', 'ConfigurationSchema.json')) as f:
			schema = json.load(f)
		try:
			validate(data, schema)
		except Exception as e:
			raise InvalidModelConfiguration(e)

	#Function that classifies images
	async def processing(self,input_data):
		await asyncio.sleep(0.00001)
		
		image_path = '/main/' + str(input_data.filename)
		output = []

		image = Image.open(BytesIO(input_data.file.read()))
		image= image.convert(mode="RGB")
		model_name = self.model_name
		pillow_image = image

		mxnet_image = mx.nd.array(np.array(pillow_image))
		model_name = utils.get_models_hash(model_name ,self.model_config)

		response = model_utils.predict(mxnet_image, model_name, self.model_config)

		for key in response:
			output.append({
                "ObjectClass" : key,
                "Confidence" : response[key]
        	})
		return output
