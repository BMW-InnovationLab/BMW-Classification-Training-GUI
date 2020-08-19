"""
This module provides data loaders and transformers for popular vision datasets.
"""
from . import transforms
from . import batchify
from .imagenet.classification import ImageNet, ImageNet1kAttr
from .dataloader import DetectionDataLoader, RandomTransformDataLoader
from .pascal_voc.detection import VOCDetection
from .mscoco.detection import COCODetection
from .mscoco.detection import COCODetectionDALI
from .mscoco.instance import COCOInstance
from .mscoco.segmentation import COCOSegmentation
from .mscoco.keypoints import COCOKeyPoints
from .cityscapes import CitySegmentation
from .pascal_voc.segmentation import VOCSegmentation
from .pascal_aug.segmentation import VOCAugSegmentation
from .ade20k.segmentation import ADE20KSegmentation
from .segbase import ms_batchify_fn
from .recordio.detection import RecordFileDetection
from .lst.detection import LstDetection
from .mixup.detection import MixupDetection
from .ucf101.classification import UCF101, UCF101Attr
from .kinetics400.classification import Kinetics400, Kinetics400Attr
from .somethingsomethingv2.classification import SomethingSomethingV2, SomethingSomethingV2Attr
from .sampler import SplitSampler

datasets = {
    'ade20k': ADE20KSegmentation,
    'pascal_voc': VOCSegmentation,
    'pascal_aug': VOCAugSegmentation,
    'coco' : COCOSegmentation,
    'citys' : CitySegmentation,
}

def get_segmentation_dataset(name, **kwargs):
    """Segmentation Datasets"""
    return datasets[name.lower()](**kwargs)
