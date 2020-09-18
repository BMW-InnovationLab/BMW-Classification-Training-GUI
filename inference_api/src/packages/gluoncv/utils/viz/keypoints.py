"""Bounding box visualization functions."""
from __future__ import absolute_import, division

import mxnet as mx
import numpy as np

from . import plot_bbox, cv_plot_bbox

def plot_keypoints(img, coords, confidence, class_ids, bboxes, scores,
                   box_thresh=0.5, keypoint_thresh=0.2, **kwargs):
    """Visualize keypoints.

    Parameters
    ----------
    img : numpy.ndarray or mxnet.nd.NDArray
        Image with shape `H, W, 3`.
    coords : numpy.ndarray or mxnet.nd.NDArray
        Array with shape `Batch, N_Joints, 2`.
    confidence : numpy.ndarray or mxnet.nd.NDArray
        Array with shape `Batch, N_Joints, 1`.
    class_ids : numpy.ndarray or mxnet.nd.NDArray
        Class IDs.
    bboxes : numpy.ndarray or mxnet.nd.NDArray
        Bounding boxes with shape `N, 4`. Where `N` is the number of boxes.
    scores : numpy.ndarray or mxnet.nd.NDArray, optional
        Confidence scores of the provided `bboxes` with shape `N`.
    box_thresh : float, optional, default 0.5
        Display threshold if `scores` is provided. Scores with less than `box_thresh`
        will be ignored in display.
    keypoint_thresh : float, optional, default 0.2
        Keypoints with confidence less than `keypoint_thresh` will be ignored in display.

    Returns
    -------
    matplotlib axes
        The ploted axes.

    """
    import matplotlib.pyplot as plt

    if isinstance(coords, mx.nd.NDArray):
        coords = coords.asnumpy()
    if isinstance(class_ids, mx.nd.NDArray):
        class_ids = class_ids.asnumpy()
    if isinstance(bboxes, mx.nd.NDArray):
        bboxes = bboxes.asnumpy()
    if isinstance(scores, mx.nd.NDArray):
        scores = scores.asnumpy()
    if isinstance(confidence, mx.nd.NDArray):
        confidence = confidence.asnumpy()

    joint_visible = confidence[:, :, 0] > keypoint_thresh
    joint_pairs = [[0, 1], [1, 3], [0, 2], [2, 4],
                   [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
                   [5, 11], [6, 12], [11, 12],
                   [11, 13], [12, 14], [13, 15], [14, 16]]

    person_ind = class_ids[0] == 0
    ax = plot_bbox(img, bboxes[0][person_ind[:, 0]],
                   scores[0][person_ind[:, 0]], thresh=box_thresh, **kwargs)

    colormap_index = np.linspace(0, 1, len(joint_pairs))
    for i in range(coords.shape[0]):
        pts = coords[i]
        for cm_ind, jp in zip(colormap_index, joint_pairs):
            if joint_visible[i, jp[0]] and joint_visible[i, jp[1]]:
                ax.plot(pts[jp, 0], pts[jp, 1],
                        linewidth=3.0, alpha=0.7, color=plt.cm.cool(cm_ind))
                ax.scatter(pts[jp, 0], pts[jp, 1], s=20)
    return ax


def cv_plot_keypoints(img, coords, confidence, class_ids, bboxes, scores,
                      box_thresh=0.5, keypoint_thresh=0.2, scale=1.0, **kwargs):
    """Visualize keypoints with OpenCV.

    Parameters
    ----------
    img : numpy.ndarray or mxnet.nd.NDArray
        Image with shape `H, W, 3`.
    coords : numpy.ndarray or mxnet.nd.NDArray
        Array with shape `Batch, N_Joints, 2`.
    confidence : numpy.ndarray or mxnet.nd.NDArray
        Array with shape `Batch, N_Joints, 1`.
    class_ids : numpy.ndarray or mxnet.nd.NDArray
        Class IDs.
    bboxes : numpy.ndarray or mxnet.nd.NDArray
        Bounding boxes with shape `N, 4`. Where `N` is the number of boxes.
    scores : numpy.ndarray or mxnet.nd.NDArray, optional
        Confidence scores of the provided `bboxes` with shape `N`.
    box_thresh : float, optional, default 0.5
        Display threshold if `scores` is provided. Scores with less than `box_thresh`
        will be ignored in display.
    keypoint_thresh : float, optional, default 0.2
        Keypoints with confidence less than `keypoint_thresh` will be ignored in display.
    scale : float
        The scale of output image, which may affect the positions of boxes

    Returns
    -------
    numpy.ndarray
        The image with estimated pose.

    """
    import matplotlib.pyplot as plt

    from ..filesystem import try_import_cv2
    cv2 = try_import_cv2()

    if isinstance(img, mx.nd.NDArray):
        img = img.asnumpy()
    if isinstance(coords, mx.nd.NDArray):
        coords = coords.asnumpy()
    if isinstance(class_ids, mx.nd.NDArray):
        class_ids = class_ids.asnumpy()
    if isinstance(bboxes, mx.nd.NDArray):
        bboxes = bboxes.asnumpy()
    if isinstance(scores, mx.nd.NDArray):
        scores = scores.asnumpy()
    if isinstance(confidence, mx.nd.NDArray):
        confidence = confidence.asnumpy()

    joint_visible = confidence[:, :, 0] > keypoint_thresh
    joint_pairs = [[0, 1], [1, 3], [0, 2], [2, 4],
                   [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
                   [5, 11], [6, 12], [11, 12],
                   [11, 13], [12, 14], [13, 15], [14, 16]]

    person_ind = class_ids[0] == 0
    img = cv_plot_bbox(img, bboxes[0][person_ind[:, 0]], scores[0][person_ind[:, 0]],
                       thresh=box_thresh, class_names='person', scale=scale, **kwargs)

    colormap_index = np.linspace(0, 1, len(joint_pairs))
    coords *= scale
    for i in range(coords.shape[0]):
        pts = coords[i]
        for cm_ind, jp in zip(colormap_index, joint_pairs):
            if joint_visible[i, jp[0]] and joint_visible[i, jp[1]]:
                cm_color = tuple([int(x * 255) for x in plt.cm.cool(cm_ind)[:3]])
                pt1 = (int(pts[jp, 0][0]), int(pts[jp, 1][0]))
                pt2 = (int(pts[jp, 0][1]), int(pts[jp, 1][1]))
                cv2.line(img, pt1, pt2, cm_color, 3)
    return img
