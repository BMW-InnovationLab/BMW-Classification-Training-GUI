import os
import json
import jsonschema
from PIL import Image, ImageFont
from inference.base_inference_engine import AbstractInferenceEngine
from inference.exceptions import InvalidModelConfiguration, InvalidInputData, ApplicationError, ModelNotLoaded


class InferenceEngine(AbstractInferenceEngine):

	def __init__(self, model_path):
		# Initialize all class attributes needed in order to load a model
		# i.e. self.attribute = None

		self.font = ImageFont.truetype("/main/fonts/DejaVuSans.ttf", 20)
		super().__init__(model_path)

	def load(self):
		with open(os.path.join(self.model_path, 'config.json')) as f:
			data = json.load(f)
		try:
			self.validate_json_configuration(data)
			self.set_model_configuration(data)
		except ApplicationError as e:
			raise e

	# load the model by saving all needed values in class attributes
	# i.e. self.net = ...

	async def infer(self, input_data, draw, predict_batch):
		# Handle all possible scenarios related to different image channels. i.e. single channel image should be converged
		# preprocess image
		# i.e. using numpy with pillow: np.array(Image.open(input_data.file))
		# read confidence and predictions value from json
		# perform inference and save the network's output in response
		# if predict_batch was True, you should add an ID(i.e. image_name) for each image to identify it in the response

		response = None

		if not draw:
			return response
		else:
			try:
				self.draw_image(input_data, response)
			except ApplicationError as e:
				raise e
			except Exception as e:
				raise e

	async def run_batch(self, input_data, draw, predict_batch):
		result_list = []
		for image in input_data:
			post_process = await self.infer(image, draw, predict_batch)
			if post_process is not None:
				result_list.append(post_process)
		return result_list

	def draw_image(self, input_data, response):
		"""
		Draws on image and saves it.
		:param input_data: A single image
		:param response: inference response
		:return:
		"""
		# draw on image

		# save image result.jpg in /main
		# i.e. image.save('/main/result.jpg', 'PNG')

	def free(self):
		pass

	def validate_configuration(self):
		# check if weights file exists
		if not os.path.exists(os.path.join(self.model_path, 'frozen_inference_graph.pb')):
			raise InvalidModelConfiguration('frozen_inference_graph.pb not found')
		# check if labels file exists
		if not os.path.exists(os.path.join(self.model_path, 'object-detection.pbtxt')):
			raise InvalidModelConfiguration('object-detection.pbtxt not found')
		# check if any additional required files exist
		return True

	def set_model_configuration(self, data):
		self.configuration['framework'] = data['framework']
		self.configuration['type'] = data['type']
		self.configuration['network'] = data['network']

	def validate_json_configuration(self, data):
		with open(os.path.join('inference', 'ConfigurationSchema.json')) as f:
			schema = json.load(f)
		try:
			jsonschema.validate(data, schema)
		except Exception as e:
			raise InvalidModelConfiguration(e)
