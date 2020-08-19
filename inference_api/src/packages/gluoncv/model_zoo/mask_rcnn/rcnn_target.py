"""Mask Target Generator."""
from __future__ import absolute_import

from mxnet import gluon, autograd


class MaskTargetGenerator(gluon.HybridBlock):
    """Mask RCNN target encoder to generate mask targets.

    Parameters
    ----------
    num_images : int
        Number of input images.
    num_rois : int
        Number of sampled rois.
    num_classes : int
        Number of classes for class-specific targets.
    mask_size : tuple of int
        Size of generated masks, for example (14, 14).

    """

    def __init__(self, num_images, num_rois, num_classes, mask_size, **kwargs):
        super(MaskTargetGenerator, self).__init__(**kwargs)
        self._num_images = num_images
        self._num_rois = num_rois
        self._num_classes = num_classes
        self._mask_size = mask_size

    # pylint: disable=arguments-differ
    def hybrid_forward(self, F, rois, gt_masks, matches, cls_targets):
        """Handle B=self._num_image by a for loop.
        There is no way to know number of gt_masks.

        Parameters
        ----------
        rois: (B, N, 4), input proposals
        gt_masks: (B, M, H, W), input masks of full image size
        matches: (B, N), value [0, M), index to gt_label and gt_box.
        cls_targets: (B, N), value [0, num_class), excluding background class.

        Returns
        -------
        mask_targets: (B, N, C, MS, MS), sampled masks.
        box_target: (B, N, C, 4), only foreground class has nonzero target.
        box_weight: (B, N, C, 4), only foreground class has nonzero weight.

        """

        if hasattr(F.contrib, 'mrcnn_mask_target'):
            return F.contrib.mrcnn_mask_target(rois, gt_masks, matches, cls_targets,
                                               num_rois=self._num_rois,
                                               num_classes=self._num_classes,
                                               mask_size=self._mask_size)

        # cannot know M (num_gt) to have accurate batch id B * M, must split batch dim
        def _split(x, axis, num_outputs, squeeze_axis):
            x = F.split(x, axis=axis, num_outputs=num_outputs, squeeze_axis=squeeze_axis)
            if isinstance(x, list):
                return x
            elif self._num_images > 1:
                return list(x)
            else:
                return [x]

        with autograd.pause():
            # gt_masks (B, M, H, W) -> (B, M, 1, H, W) -> B * (M, 1, H, W)
            gt_masks = gt_masks.reshape((0, -4, -1, 1, 0, 0))
            gt_masks = _split(gt_masks, axis=0, num_outputs=self._num_images, squeeze_axis=True)
            # rois (B, N, 4) -> B * (N, 4)
            rois = _split(rois, axis=0, num_outputs=self._num_images, squeeze_axis=True)
            # remove possible -1 match
            matches = F.relu(matches)
            # matches (B, N) -> B * (N,)
            matches = _split(matches, axis=0, num_outputs=self._num_images, squeeze_axis=True)
            # cls_targets (B, N) -> B * (N,)
            cls_targets = _split(cls_targets, axis=0, num_outputs=self._num_images,
                                 squeeze_axis=True)

            # (1, C)
            cids = F.arange(1, self._num_classes + 1)
            cids = cids.reshape((1, -1))

            mask_targets = []
            mask_masks = []
            for roi, gt_mask, match, cls_target in zip(rois, gt_masks, matches, cls_targets):
                # batch id = match
                padded_rois = F.concat(match.reshape((-1, 1)), roi, dim=-1)
                # pooled_mask (N, 1, MS, MS)
                pooled_mask = F.contrib.ROIAlign(gt_mask, padded_rois,
                                                 self._mask_size, 1.0, sample_ratio=2)

                # (N,) -> (1, C) -> (N, C, 1, 1)
                cls_target = F.expand_dims(cls_target, 1)
                same_cids = F.broadcast_equal(cls_target, cids)
                same_cids = same_cids.reshape((-2, 1, 1))

                # (N, MS, MS) -> (N, C, 1, 1) -> (N, C, MS, MS)
                mask_mask = F.broadcast_like(same_cids, pooled_mask,
                                             lhs_axes=(2, 3), rhs_axes=(2, 3))

                # (N, 1, MS, MS) -> (N, C, MS, MS)
                mask_target = F.broadcast_axis(pooled_mask, size=self._num_classes, axis=1)

                mask_targets.append(mask_target)
                mask_masks.append(mask_mask)

            # B * (N, C, MS, MS) -> (B, N, C, MS, MS)
            mask_targets = F.stack(*mask_targets, axis=0)
            mask_masks = F.stack(*mask_masks, axis=0)
        return mask_targets, mask_masks
