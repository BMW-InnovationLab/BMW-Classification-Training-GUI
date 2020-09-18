# pylint: disable=unused-argument
"""Pyramid Scene Parsing Network"""
from mxnet.gluon import nn
from mxnet.context import cpu
from mxnet.gluon.nn import HybridBlock
from .segbase import SegBaseModel
from .fcn import _FCNHead
# pylint: disable-all

__all__ = ['PSPNet', 'get_psp', 'get_psp_resnet101_coco', 'get_psp_resnet101_voc',
    'get_psp_resnet50_ade', 'get_psp_resnet101_ade', 'get_psp_resnet101_citys']

class PSPNet(SegBaseModel):
    r"""Pyramid Scene Parsing Network

    Parameters
    ----------
    nclass : int
        Number of categories for the training dataset.
    backbone : string
        Pre-trained dilated backbone network type (default:'resnet50'; 'resnet50',
        'resnet101' or 'resnet152').
    norm_layer : object
        Normalization layer used in backbone network (default: :class:`mxnet.gluon.nn.BatchNorm`;
        for Synchronized Cross-GPU BachNormalization).
    aux : bool
        Auxiliary loss.


    Reference:

        Zhao, Hengshuang, Jianping Shi, Xiaojuan Qi, Xiaogang Wang, and Jiaya Jia.
        "Pyramid scene parsing network." *CVPR*, 2017

    """
    def __init__(self, nclass, backbone='resnet50', aux=True, ctx=cpu(), pretrained_base=True,
                 base_size=520, crop_size=480, **kwargs):
        super(PSPNet, self).__init__(nclass, aux, backbone, ctx=ctx, base_size=base_size,
                                     crop_size=crop_size, pretrained_base=pretrained_base, **kwargs)
        with self.name_scope():
            self.head = _PSPHead(nclass, feature_map_height=self._up_kwargs['height']//8,
                                 feature_map_width=self._up_kwargs['width']//8, **kwargs)
            self.head.initialize(ctx=ctx)
            self.head.collect_params().setattr('lr_mult', 10)
            if self.aux:
                self.auxlayer = _FCNHead(1024, nclass, **kwargs)
                self.auxlayer.initialize(ctx=ctx)
                self.auxlayer.collect_params().setattr('lr_mult', 10)
        print('self.crop_size', self.crop_size)

    def hybrid_forward(self, F, x):
        c3, c4 = self.base_forward(x)
        outputs = []
        x = self.head(c4)
        x = F.contrib.BilinearResize2D(x, **self._up_kwargs)
        outputs.append(x)

        if self.aux:
            auxout = self.auxlayer(c3)
            auxout = F.contrib.BilinearResize2D(auxout, **self._up_kwargs)
            outputs.append(auxout)
        return tuple(outputs)

    def demo(self, x):
        return self.predict(x)

    def predict(self, x):
        h, w = x.shape[2:]
        self._up_kwargs['height'] = h
        self._up_kwargs['width'] = w
        c3, c4 = self.base_forward(x)
        outputs = []
        x = self.head.demo(c4)
        import mxnet.ndarray as F
        pred = F.contrib.BilinearResize2D(x, **self._up_kwargs)
        return pred

def _PSP1x1Conv(in_channels, out_channels, norm_layer, norm_kwargs):
    block = nn.HybridSequential()
    with block.name_scope():
        block.add(nn.Conv2D(in_channels=in_channels, channels=out_channels,
                            kernel_size=1, use_bias=False))
        block.add(norm_layer(in_channels=out_channels, **({} if norm_kwargs is None else norm_kwargs)))
        block.add(nn.Activation('relu'))
    return block


class _PyramidPooling(HybridBlock):
    def __init__(self, in_channels, height=60, width=60, **kwargs):
        super(_PyramidPooling, self).__init__()
        out_channels = int(in_channels/4)
        self._up_kwargs = {'height': height, 'width': width}
        with self.name_scope():
            self.conv1 = _PSP1x1Conv(in_channels, out_channels, **kwargs)
            self.conv2 = _PSP1x1Conv(in_channels, out_channels, **kwargs)
            self.conv3 = _PSP1x1Conv(in_channels, out_channels, **kwargs)
            self.conv4 = _PSP1x1Conv(in_channels, out_channels, **kwargs)

    def pool(self, F, x, size):
        return F.contrib.AdaptiveAvgPooling2D(x, output_size=size)

    def upsample(self, F, x):
        return F.contrib.BilinearResize2D(x, **self._up_kwargs)

    def hybrid_forward(self, F, x):
        feat1 = self.upsample(F, self.conv1(self.pool(F, x, 1)))
        feat2 = self.upsample(F, self.conv2(self.pool(F, x, 2)))
        feat3 = self.upsample(F, self.conv3(self.pool(F, x, 3)))
        feat4 = self.upsample(F, self.conv4(self.pool(F, x, 6)))
        return F.concat(x, feat1, feat2, feat3, feat4, dim=1)

    def demo(self, x):
        self._up_kwargs['height'] = x.shape[2]
        self._up_kwargs['width'] = x.shape[3]
        import mxnet.ndarray as F
        feat1 = self.upsample(F, self.conv1(self.pool(F, x, 1)))
        feat2 = self.upsample(F, self.conv2(self.pool(F, x, 2)))
        feat3 = self.upsample(F, self.conv3(self.pool(F, x, 3)))
        feat4 = self.upsample(F, self.conv4(self.pool(F, x, 6)))
        return F.concat(x, feat1, feat2, feat3, feat4, dim=1)

class _PSPHead(HybridBlock):
    def __init__(self, nclass, norm_layer=nn.BatchNorm, norm_kwargs=None,
                 feature_map_height=60, feature_map_width=60, **kwargs):
        super(_PSPHead, self).__init__()
        self.psp = _PyramidPooling(2048, height=feature_map_height, width=feature_map_width,
                                   norm_layer=norm_layer,
                                   norm_kwargs=norm_kwargs)
        with self.name_scope():
            self.block = nn.HybridSequential(prefix='')
            self.block.add(nn.Conv2D(in_channels=4096, channels=512,
                                     kernel_size=3, padding=1, use_bias=False))
            self.block.add(norm_layer(in_channels=512, **({} if norm_kwargs is None else norm_kwargs)))
            self.block.add(nn.Activation('relu'))
            self.block.add(nn.Dropout(0.1))
            self.block.add(nn.Conv2D(in_channels=512, channels=nclass,
                                     kernel_size=1))

    def hybrid_forward(self, F, x):
        x = self.psp(x)
        return self.block(x)

    def demo(self, x):
        x = self.psp.demo(x)
        return self.block(x)
        

def get_psp(dataset='pascal_voc', backbone='resnet50', pretrained=False,
            root='~/.mxnet/models', ctx=cpu(0), pretrained_base=True, **kwargs):
    r"""Pyramid Scene Parsing Network
    Parameters
    ----------
    dataset : str, default pascal_voc
        The dataset that model pretrained on. (pascal_voc, ade20k)
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.
    pretrained_base : bool or str, default True
        This will load pretrained backbone network, that was trained on ImageNet.

    Examples
    --------
    >>> model = get_fcn(dataset='pascal_voc', backbone='resnet50', pretrained=False)
    >>> print(model)
    """
    acronyms = {
        'pascal_voc': 'voc',
        'pascal_aug': 'voc',
        'ade20k': 'ade',
        'coco': 'coco',
        'citys': 'citys',
    }
    from ..data import datasets
    # infer number of classes
    model = PSPNet(datasets[dataset].NUM_CLASS, backbone=backbone,
                   pretrained_base=pretrained_base, ctx=ctx, **kwargs)
    model.classes = datasets[dataset].classes
    if pretrained:
        from .model_store import get_model_file
        model.load_parameters(get_model_file('psp_%s_%s'%(backbone, acronyms[dataset]),
                                             tag=pretrained, root=root), ctx=ctx)
    return model

def get_psp_resnet101_coco(**kwargs):
    r"""Pyramid Scene Parsing Network
    Parameters
    ----------
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.

    Examples
    --------
    >>> model = get_psp_resnet101_coco(pretrained=True)
    >>> print(model)
    """
    return get_psp('coco', 'resnet101', **kwargs)

def get_psp_resnet101_voc(**kwargs):
    r"""Pyramid Scene Parsing Network
    Parameters
    ----------
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.

    Examples
    --------
    >>> model = get_psp_resnet101_voc(pretrained=True)
    >>> print(model)
    """
    return get_psp('pascal_voc', 'resnet101', **kwargs)

def get_psp_resnet50_ade(**kwargs):
    r"""Pyramid Scene Parsing Network
    Parameters
    ----------
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.

    Examples
    --------
    >>> model = get_psp_resnet50_ade(pretrained=True)
    >>> print(model)
    """
    return get_psp('ade20k', 'resnet50', **kwargs)

def get_psp_resnet101_ade(**kwargs):
    r"""Pyramid Scene Parsing Network
    Parameters
    ----------
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.

    Examples
    --------
    >>> model = get_psp_resnet101_ade(pretrained=True)
    >>> print(model)
    """
    return get_psp('ade20k', 'resnet101', **kwargs)


def get_psp_resnet101_citys(**kwargs):
    r"""Pyramid Scene Parsing Network
    Parameters
    ----------
    pretrained : bool or str
        Boolean value controls whether to load the default pretrained weights for model.
        String value represents the hashtag for a certain version of pretrained weights.
    ctx : Context, default CPU
        The context in which to load the pretrained weights.
    root : str, default '~/.mxnet/models'
        Location for keeping the model parameters.

    Examples
    --------
    >>> model = get_psp_resnet101_ade(pretrained=True)
    >>> print(model)
    """
    return get_psp('citys', 'resnet101', **kwargs)
