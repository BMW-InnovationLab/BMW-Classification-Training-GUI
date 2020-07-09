from pydantic import BaseModel
from typing import List
import pydantic
"""
The Dataset Object has 2 required fields:
    -   The dataset_name field: the name of your dataset folder inside the datasets folder 
        (the full path will be automatically appended so need to put it).

    - The ratios fields represnts the portions of your data for training, evaluations and testing.
      (Some frameworkds e.g. Tensorflow use only one ratio while others e.g GluonCV use all three)
      That's why only training_ratio is required.
"""


class Dataset(BaseModel):
    dataset_name: str = pydantic.Field(default="dummy_dataset",example="dummy_dataset")
    training_ratio: float  = pydantic.Field(default=60,example=60)
    validation_ratio: float = pydantic.Field(default=20,example=20)  
    testing_ratio: float = pydantic.Field(default=20,example=20)







 
