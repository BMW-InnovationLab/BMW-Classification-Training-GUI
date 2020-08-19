# pylint: disable=wildcard-import, unused-wildcard-import
"""Model store which handles pretrained models from both
mxnet.gluon.model_zoo.vision and gluoncv.models
"""
from .alexnet import *
from .cifarresnet import *
from .cifarresnext import *
from .cifarwideresnet import *
from .deeplabv3 import *
from .deeplabv3b_plus import *
from .densenet import *
from .faster_rcnn import *
from .fcn import *
from .googlenet import *
from .inception import *
from .mask_rcnn import *
from .mobilenet import *
from .mobilenetv3 import *
from .nasnet import *
from .pruned_resnet.resnetv1b_pruned import *
from .pspnet import *
from .quantized import *
from .residual_attentionnet import *
from .resnet import *
from .resnetv1b import *
from .resnext import *
from .senet import *
from .simple_pose.simple_pose_resnet import *
from .simple_pose.mobile_pose import *
from .squeezenet import *
from .ssd import *
from .vgg import *
from .xception import *
from .yolo import *
from .alpha_pose import *
from .action_recognition import *

__all__ = ['get_model', 'get_model_list']

_models = {
    'resnet18_v1': resnet18_v1,
    'resnet34_v1': resnet34_v1,
    'resnet50_v1': resnet50_v1,
    'resnet101_v1': resnet101_v1,
    'resnet152_v1': resnet152_v1,
    'resnet18_v2': resnet18_v2,
    'resnet34_v2': resnet34_v2,
    'resnet50_v2': resnet50_v2,
    'resnet101_v2': resnet101_v2,
    'resnet152_v2': resnet152_v2,
    'se_resnet18_v1': se_resnet18_v1,
    'se_resnet34_v1': se_resnet34_v1,
    'se_resnet50_v1': se_resnet50_v1,
    'se_resnet101_v1': se_resnet101_v1,
    'se_resnet152_v1': se_resnet152_v1,
    'se_resnet18_v2': se_resnet18_v2,
    'se_resnet34_v2': se_resnet34_v2,
    'se_resnet50_v2': se_resnet50_v2,
    'se_resnet101_v2': se_resnet101_v2,
    'se_resnet152_v2': se_resnet152_v2,
    'vgg11': vgg11,
    'vgg13': vgg13,
    'vgg16': vgg16,
    'vgg19': vgg19,
    'vgg11_bn': vgg11_bn,
    'vgg13_bn': vgg13_bn,
    'vgg16_bn': vgg16_bn,
    'vgg19_bn': vgg19_bn,
    'alexnet': alexnet,
    'densenet121': densenet121,
    'densenet161': densenet161,
    'densenet169': densenet169,
    'densenet201': densenet201,
    'squeezenet1.0': squeezenet1_0,
    'squeezenet1.1': squeezenet1_1,
    'googlenet': googlenet,
    'inceptionv3': inception_v3,
    'xception': get_xcetption,
    'xception71': get_xcetption_71,
    'mobilenet1.0': mobilenet1_0,
    'mobilenet0.75': mobilenet0_75,
    'mobilenet0.5': mobilenet0_5,
    'mobilenet0.25': mobilenet0_25,
    'mobilenetv2_1.0': mobilenet_v2_1_0,
    'mobilenetv2_0.75': mobilenet_v2_0_75,
    'mobilenetv2_0.5': mobilenet_v2_0_5,
    'mobilenetv2_0.25': mobilenet_v2_0_25,
    'mobilenetv3_large': mobilenet_v3_large,
    'mobilenetv3_small': mobilenet_v3_small,
    'mobile_pose_resnet18_v1b': mobile_pose_resnet18_v1b,
    'mobile_pose_resnet50_v1b': mobile_pose_resnet50_v1b,
    'mobile_pose_mobilenet1.0': mobile_pose_mobilenet1_0,
    'mobile_pose_mobilenetv2_1.0': mobile_pose_mobilenetv2_1_0,
    'mobile_pose_mobilenetv3_large': mobile_pose_mobilenetv3_large,
    'mobile_pose_mobilenetv3_small': mobile_pose_mobilenetv3_small,
    'ssd_300_vgg16_atrous_voc': ssd_300_vgg16_atrous_voc,
    'ssd_300_vgg16_atrous_coco': ssd_300_vgg16_atrous_coco,
    'ssd_300_vgg16_atrous_custom': ssd_300_vgg16_atrous_custom,
    'ssd_512_vgg16_atrous_voc': ssd_512_vgg16_atrous_voc,
    'ssd_512_vgg16_atrous_coco': ssd_512_vgg16_atrous_coco,
    'ssd_512_vgg16_atrous_custom': ssd_512_vgg16_atrous_custom,
    'ssd_512_resnet18_v1_voc': ssd_512_resnet18_v1_voc,
    'ssd_512_resnet18_v1_coco': ssd_512_resnet18_v1_coco,
    'ssd_512_resnet50_v1_voc': ssd_512_resnet50_v1_voc,
    'ssd_512_resnet50_v1_coco': ssd_512_resnet50_v1_coco,
    'ssd_512_resnet50_v1_custom': ssd_512_resnet50_v1_custom,
    'ssd_512_resnet101_v2_voc': ssd_512_resnet101_v2_voc,
    'ssd_512_resnet152_v2_voc': ssd_512_resnet152_v2_voc,
    'ssd_512_mobilenet1.0_voc': ssd_512_mobilenet1_0_voc,
    'ssd_512_mobilenet1.0_coco': ssd_512_mobilenet1_0_coco,
    'ssd_512_mobilenet1.0_custom': ssd_512_mobilenet1_0_custom,
    'ssd_300_mobilenet0.25_voc': ssd_300_mobilenet0_25_voc,
    'ssd_300_mobilenet0.25_coco': ssd_300_mobilenet0_25_coco,
    'ssd_300_mobilenet0.25_custom': ssd_300_mobilenet0_25_custom,
    'faster_rcnn_resnet50_v1b_voc': faster_rcnn_resnet50_v1b_voc,
    'mask_rcnn_resnet18_v1b_coco': mask_rcnn_resnet18_v1b_coco,
    'faster_rcnn_resnet50_v1b_coco': faster_rcnn_resnet50_v1b_coco,
    'faster_rcnn_fpn_resnet50_v1b_coco': faster_rcnn_fpn_resnet50_v1b_coco,
    'faster_rcnn_fpn_bn_resnet50_v1b_coco': faster_rcnn_fpn_bn_resnet50_v1b_coco,
    'faster_rcnn_resnet50_v1b_custom': faster_rcnn_resnet50_v1b_custom,
    'faster_rcnn_resnet101_v1d_voc': faster_rcnn_resnet101_v1d_voc,
    'faster_rcnn_resnet101_v1d_coco': faster_rcnn_resnet101_v1d_coco,
    'faster_rcnn_fpn_resnet101_v1d_coco': faster_rcnn_fpn_resnet101_v1d_coco,
    'faster_rcnn_resnet101_v1d_custom': faster_rcnn_resnet101_v1d_custom,
    'mask_rcnn_resnet50_v1b_coco': mask_rcnn_resnet50_v1b_coco,
    'mask_rcnn_fpn_resnet50_v1b_coco': mask_rcnn_fpn_resnet50_v1b_coco,
    'mask_rcnn_resnet101_v1d_coco': mask_rcnn_resnet101_v1d_coco,
    'mask_rcnn_fpn_resnet101_v1d_coco': mask_rcnn_fpn_resnet101_v1d_coco,
    'mask_rcnn_fpn_resnet18_v1b_coco': mask_rcnn_fpn_resnet18_v1b_coco,
    'mask_rcnn_fpn_bn_resnet18_v1b_coco': mask_rcnn_fpn_bn_resnet18_v1b_coco,
    'mask_rcnn_fpn_bn_mobilenet1_0_coco': mask_rcnn_fpn_bn_mobilenet1_0_coco,
    'cifar_resnet20_v1': cifar_resnet20_v1,
    'cifar_resnet56_v1': cifar_resnet56_v1,
    'cifar_resnet110_v1': cifar_resnet110_v1,
    'cifar_resnet20_v2': cifar_resnet20_v2,
    'cifar_resnet56_v2': cifar_resnet56_v2,
    'cifar_resnet110_v2': cifar_resnet110_v2,
    'cifar_wideresnet16_10': cifar_wideresnet16_10,
    'cifar_wideresnet28_10': cifar_wideresnet28_10,
    'cifar_wideresnet40_8': cifar_wideresnet40_8,
    'cifar_resnext29_32x4d': cifar_resnext29_32x4d,
    'cifar_resnext29_16x64d': cifar_resnext29_16x64d,
    'fcn_resnet50_voc': get_fcn_resnet50_voc,
    'fcn_resnet101_coco': get_fcn_resnet101_coco,
    'fcn_resnet101_voc': get_fcn_resnet101_voc,
    'fcn_resnet50_ade': get_fcn_resnet50_ade,
    'fcn_resnet101_ade': get_fcn_resnet101_ade,
    'psp_resnet101_coco': get_psp_resnet101_coco,
    'psp_resnet101_voc': get_psp_resnet101_voc,
    'psp_resnet50_ade': get_psp_resnet50_ade,
    'psp_resnet101_ade': get_psp_resnet101_ade,
    'psp_resnet101_citys': get_psp_resnet101_citys,
    'deeplab_resnet101_coco': get_deeplab_resnet101_coco,
    'deeplab_resnet101_voc': get_deeplab_resnet101_voc,
    'deeplab_resnet152_coco': get_deeplab_resnet152_coco,
    'deeplab_resnet152_voc': get_deeplab_resnet152_voc,
    'deeplab_resnet50_ade': get_deeplab_resnet50_ade,
    'deeplab_resnet101_ade': get_deeplab_resnet101_ade,
    'deeplab_v3b_plus_wideresnet_citys': get_deeplab_v3b_plus_wideresnet_citys,
    'resnet18_v1b': resnet18_v1b,
    'resnet34_v1b': resnet34_v1b,
    'resnet50_v1b': resnet50_v1b,
    'resnet50_v1b_gn': resnet50_v1b_gn,
    'resnet101_v1b_gn': resnet101_v1b_gn,
    'resnet101_v1b': resnet101_v1b,
    'resnet152_v1b': resnet152_v1b,
    'resnet50_v1c': resnet50_v1c,
    'resnet101_v1c': resnet101_v1c,
    'resnet152_v1c': resnet152_v1c,
    'resnet50_v1d': resnet50_v1d,
    'resnet101_v1d': resnet101_v1d,
    'resnet152_v1d': resnet152_v1d,
    'resnet50_v1e': resnet50_v1e,
    'resnet101_v1e': resnet101_v1e,
    'resnet152_v1e': resnet152_v1e,
    'resnet50_v1s': resnet50_v1s,
    'resnet101_v1s': resnet101_v1s,
    'resnet152_v1s': resnet152_v1s,
    'resnext50_32x4d': resnext50_32x4d,
    'resnext101_32x4d': resnext101_32x4d,
    'resnext101_64x4d': resnext101_64x4d,
    'resnext101b_64x4d': resnext101e_64x4d,
    'se_resnext50_32x4d': se_resnext50_32x4d,
    'se_resnext101_32x4d': se_resnext101_32x4d,
    'se_resnext101_64x4d': se_resnext101_64x4d,
    'se_resnext101e_64x4d': se_resnext101e_64x4d,
    'senet_154': senet_154,
    'senet_154e': senet_154e,
    'darknet53': darknet53,
    'yolo3_darknet53_coco': yolo3_darknet53_coco,
    'yolo3_darknet53_voc': yolo3_darknet53_voc,
    'yolo3_darknet53_custom': yolo3_darknet53_custom,
    'yolo3_mobilenet1.0_coco': yolo3_mobilenet1_0_coco,
    'yolo3_mobilenet1.0_voc': yolo3_mobilenet1_0_voc,
    'yolo3_mobilenet1.0_custom': yolo3_mobilenet1_0_custom,
    'yolo3_mobilenet0.25_coco': yolo3_mobilenet0_25_coco,
    'yolo3_mobilenet0.25_voc': yolo3_mobilenet0_25_voc,
    'yolo3_mobilenet0.25_custom': yolo3_mobilenet0_25_custom,
    'nasnet_4_1056': nasnet_4_1056,
    'nasnet_5_1538': nasnet_5_1538,
    'nasnet_7_1920': nasnet_7_1920,
    'nasnet_6_4032': nasnet_6_4032,
    'simple_pose_resnet18_v1b': simple_pose_resnet18_v1b,
    'simple_pose_resnet50_v1b': simple_pose_resnet50_v1b,
    'simple_pose_resnet101_v1b': simple_pose_resnet101_v1b,
    'simple_pose_resnet152_v1b': simple_pose_resnet152_v1b,
    'simple_pose_resnet50_v1d': simple_pose_resnet50_v1d,
    'simple_pose_resnet101_v1d': simple_pose_resnet101_v1d,
    'simple_pose_resnet152_v1d': simple_pose_resnet152_v1d,
    'residualattentionnet56': residualattentionnet56,
    'residualattentionnet92': residualattentionnet92,
    'residualattentionnet128': residualattentionnet128,
    'residualattentionnet164': residualattentionnet164,
    'residualattentionnet200': residualattentionnet200,
    'residualattentionnet236': residualattentionnet236,
    'residualattentionnet452': residualattentionnet452,
    'cifar_residualattentionnet56': cifar_residualattentionnet56,
    'cifar_residualattentionnet92': cifar_residualattentionnet92,
    'cifar_residualattentionnet452': cifar_residualattentionnet452,
    'resnet18_v1b_0.89': resnet18_v1b_89,
    'resnet50_v1d_0.86': resnet50_v1d_86,
    'resnet50_v1d_0.48': resnet50_v1d_48,
    'resnet50_v1d_0.37': resnet50_v1d_37,
    'resnet50_v1d_0.11': resnet50_v1d_11,
    'resnet101_v1d_0.76': resnet101_v1d_76,
    'resnet101_v1d_0.73': resnet101_v1d_73,
    'mobilenet1.0_int8': mobilenet1_0_int8,
    'resnet50_v1_int8': resnet50_v1_int8,
    'ssd_300_vgg16_atrous_voc_int8': ssd_300_vgg16_atrous_voc_int8,
    'ssd_512_mobilenet1.0_voc_int8': ssd_512_mobilenet1_0_voc_int8,
    'ssd_512_resnet50_v1_voc_int8': ssd_512_resnet50_v1_voc_int8,
    'ssd_512_vgg16_atrous_voc_int8': ssd_512_vgg16_atrous_voc_int8,
    'alpha_pose_resnet101_v1b_coco': alpha_pose_resnet101_v1b_coco,
    'vgg16_ucf101': vgg16_ucf101,
    'inceptionv3_ucf101': inceptionv3_ucf101,
    'inceptionv3_kinetics400': inceptionv3_kinetics400,
    'i3d_resnet50_v1_kinetics400': i3d_resnet50_v1_kinetics400,
    'i3d_resnet101_v1_kinetics400': i3d_resnet101_v1_kinetics400,
    'i3d_inceptionv1_kinetics400': i3d_inceptionv1_kinetics400,
    'i3d_inceptionv3_kinetics400': i3d_inceptionv3_kinetics400,
    'i3d_nl5_resnet50_v1_kinetics400': i3d_nl5_resnet50_v1_kinetics400,
    'i3d_nl10_resnet50_v1_kinetics400': i3d_nl10_resnet50_v1_kinetics400,
    'i3d_nl5_resnet101_v1_kinetics400': i3d_nl5_resnet101_v1_kinetics400,
    'i3d_nl10_resnet101_v1_kinetics400': i3d_nl10_resnet101_v1_kinetics400,
    'i3d_resnet50_v1_sthsthv2': i3d_resnet50_v1_sthsthv2,
    'resnet50_v1b_sthsthv2': resnet50_v1b_sthsthv2,
    'fcn_resnet101_voc_int8': fcn_resnet101_voc_int8,
    'fcn_resnet101_coco_int8': fcn_resnet101_coco_int8,
    'psp_resnet101_voc_int8': psp_resnet101_voc_int8,
    'psp_resnet101_coco_int8': psp_resnet101_coco_int8,
    'deeplab_resnet101_voc_int8': deeplab_resnet101_voc_int8,
    'deeplab_resnet101_coco_int8': deeplab_resnet101_coco_int8
}


def get_model(name, **kwargs):
    """Returns a pre-defined model by name

    Parameters
    ----------
    name : str
        Name of the model.
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    classes : int
        Number of classes for the output layer.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.

    Returns
    -------
    HybridBlock
        The model.
    """
    name = name.lower()
    if name not in _models:
        err_str = '"%s" is not among the following model list:\n\t' % (name)
        err_str += '%s' % ('\n\t'.join(sorted(_models.keys())))
        raise ValueError(err_str)
    net = _models[name](**kwargs)
    return net


def get_model_list():
    """Get the entire list of model names in model_zoo.

    Returns
    -------
    list of str
        Entire list of model names in model_zoo.

    """
    return _models.keys()
