"""Custom evaluation metrics"""
from __future__ import absolute_import

from .coco_detection import COCODetectionMetric
from .coco_keypoints import COCOKeyPointsMetric
from .voc_detection import VOCMApMetric, VOC07MApMetric
from .segmentation import SegmentationMetric
from .heatmap_accuracy import HeatmapAccuracy
