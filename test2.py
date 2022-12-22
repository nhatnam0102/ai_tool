import datetime
import os.path

import numpy as np
import cv2
from upc import general
from matplotlib import pyplot as plt

MIN_MATCH_COUNT = 5
img2 = cv2.imread(
    r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\temp\before_top_20221118_133751.png")  # trainImage
img2 = cv2.resize(img2, (0, 0), fx=0.5, fy=0.5)
# Initiate SIFT detector
tem_h, tem_w = img2.shape[:2]
sift = cv2.SIFT_create()
kp2, des2 = sift.detectAndCompute(img2, None)
FLANN_INDEX_KDTREE = 0
index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
search_params = dict(checks=50)
flann = cv2.FlannBasedMatcher(index_params, search_params)

images_, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\patern")

for im in images_:
    t1 = datetime.datetime.now()
    boxs = []
    img1 = cv2.imread(im)  # queryImage
    img1 = cv2.resize(img1, (0, 0), fx=0.5, fy=0.5)
    draw_img = img1.copy()
    while True:
        # find the keypoints and descriptors with SIFT
        kp1, des1 = sift.detectAndCompute(img1, None)
        matches = flann.knnMatch(des1, des2, k=2)
        # store all the good matches as per Lowe's ratio test.
        good = []

        for m, n in matches:
            if m.distance < 0.5 * n.distance:
                good.append(m)

        if len(good) > MIN_MATCH_COUNT:
            src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
            dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
            M, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
            matchesMask = mask.ravel().tolist()
            h, w = img1.shape[:2]
            pts = np.float32([[0, 0], [0, h - 1], [w - 1, h - 1], [w - 1, 0]]).reshape(-1, 1, 2)
            pts1 = src_pts[mask == 1]
            min_x, min_y = np.int32(pts1.min(axis=0))
            max_x, max_y = np.int32(pts1.max(axis=0))
            cv2.rectangle(img1, (min_x, min_y), (max_x, max_y), 255, -1)
            boxs.append((min_x, min_y, max_x, max_y))
        else:
            print("Not enough matches are found - %d/%d" % (len(good), MIN_MATCH_COUNT))

            matchesMask = None
            break

    print(datetime.datetime.now() - t1)

    for box in boxs:
        if (box[2] - box[0]) > tem_w or (box[3] - box[1]) > tem_h:
            continue
        cv2.rectangle(draw_img, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
    cv2.imwrite(
        r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\save_1" + r"\\" + os.path.basename(
            im),
        draw_img)
# draw_params = dict(matchColor=(0, 255, 0),  # draw matches in green color
#                    singlePointColor=None,
#                    matchesMask=matchesMask,  # draw only inliers
#                    flags=2)
# img3 = cv2.drawMatches(img1, kp1, img2, kp2, good, None, **draw_params)


#
# import math
# import cv2
# import numpy as np
#
#
# def rotate_image(image, angle):
#     """
#     Rotates an OpenCV 2 / NumPy image about it's centre by the given angle
#     (in degrees). The returned image will be large enough to hold the entire
#     new image, with a black background
#     """
#
#     # Get the image size
#     # No that's not an error - NumPy stores image matricies backwards
#     image_size = (image.shape[1], image.shape[0])
#     image_center = tuple(np.array(image_size) / 2)
#
#     # Convert the OpenCV 3x2 rotation matrix to 3x3
#     rot_mat = np.vstack(
#         [cv2.getRotationMatrix2D(image_center, angle, 1.0), [0, 0, 1]]
#     )
#
#     rot_mat_notranslate = np.matrix(rot_mat[0:2, 0:2])
#
#     # Shorthand for below calcs
#     image_w2 = image_size[0] * 0.5
#     image_h2 = image_size[1] * 0.5
#
#     # Obtain the rotated coordinates of the image corners
#     rotated_coords = [
#         (np.array([-image_w2, image_h2]) * rot_mat_notranslate).A[0],
#         (np.array([image_w2, image_h2]) * rot_mat_notranslate).A[0],
#         (np.array([-image_w2, -image_h2]) * rot_mat_notranslate).A[0],
#         (np.array([image_w2, -image_h2]) * rot_mat_notranslate).A[0]
#     ]
#
#     # Find the size of the new image
#     x_coords = [pt[0] for pt in rotated_coords]
#     x_pos = [x for x in x_coords if x > 0]
#     x_neg = [x for x in x_coords if x < 0]
#
#     y_coords = [pt[1] for pt in rotated_coords]
#     y_pos = [y for y in y_coords if y > 0]
#     y_neg = [y for y in y_coords if y < 0]
#
#     right_bound = max(x_pos)
#     left_bound = min(x_neg)
#     top_bound = max(y_pos)
#     bot_bound = min(y_neg)
#
#     new_w = int(abs(right_bound - left_bound))
#     new_h = int(abs(top_bound - bot_bound))
#
#     # We require a translation matrix to keep the image centred
#     trans_mat = np.matrix([
#         [1, 0, int(new_w * 0.5 - image_w2)],
#         [0, 1, int(new_h * 0.5 - image_h2)],
#         [0, 0, 1]
#     ])
#
#     # Compute the tranform for the combined rotation and translation
#     affine_mat = (np.matrix(trans_mat) * np.matrix(rot_mat))[0:2, :]
#
#     # Apply the transform
#     result = cv2.warpAffine(
#         image,
#         affine_mat,
#         (new_w, new_h),
#         flags=cv2.INTER_LINEAR
#     )
#
#     return result
#
#
# def largest_rotated_rect(w, h, angle):
#     """
#     Given a rectangle of size wxh that has been rotated by 'angle' (in
#     radians), computes the width and height of the largest possible
#     axis-aligned rectangle within the rotated rectangle.
#
#     Original JS code by 'Andri' and Magnus Hoff from Stack Overflow
#
#     Converted to Python by Aaron Snoswell
#     """
#
#     quadrant = int(math.floor(angle / (math.pi / 2))) & 3
#     sign_alpha = angle if ((quadrant & 1) == 0) else math.pi - angle
#     alpha = (sign_alpha % math.pi + math.pi) % math.pi
#
#     bb_w = w * math.cos(alpha) + h * math.sin(alpha)
#     bb_h = w * math.sin(alpha) + h * math.cos(alpha)
#
#     gamma = math.atan2(bb_w, bb_w) if (w < h) else math.atan2(bb_w, bb_w)
#
#     delta = math.pi - alpha - gamma
#
#     length = h if (w < h) else w
#
#     d = length * math.cos(alpha)
#     a = d * math.sin(alpha) / math.sin(delta)
#
#     y = a * math.cos(gamma)
#     x = y * math.tan(gamma)
#
#     return (
#         bb_w - 2 * x,
#         bb_h - 2 * y
#     )
#
#
# def crop_around_center(image, width, height):
#     """
#     Given a NumPy / OpenCV 2 image, crops it to the given width and height,
#     around it's centre point
#     """
#
#     image_size = (image.shape[1], image.shape[0])
#     image_center = (int(image_size[0] * 0.5), int(image_size[1] * 0.5))
#
#     if width > image_size[0]:
#         width = image_size[0]
#
#     if height > image_size[1]:
#         height = image_size[1]
#
#     x1 = int(image_center[0] - width * 0.5)
#     x2 = int(image_center[0] + width * 0.5)
#     y1 = int(image_center[1] - height * 0.5)
#     y2 = int(image_center[1] + height * 0.5)
#
#     return image[y1:y2, x1:x2]
#
#
# image = cv2.imread(r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\temp\before_top_20221118_133751.png")
# image_height, image_width = image.shape[0:2]
#
# cv2.imshow("Original Image", image)
#
# key = cv2.waitKey(0)
# if key == ord("q") or key == 27:
#     exit()
#
# for i in np.arange(0, 360, 0.5):
#     image_orig = np.copy(image)
#     image_rotated = rotate_image(image, i)
#     image_rotated_cropped = crop_around_center(
#         image_rotated,
#         *largest_rotated_rect(
#             image_width,
#             image_height,
#             math.radians(i)
#         )
#     )
#
#     key = cv2.waitKey(2)
#     if key == ord("q") or key == 27:
#         break
#
#     cv2.imshow("Original Image", image_orig)
#     cv2.imshow("Rotated Image", image_rotated)
#     cv2.imshow("Cropped Image", image_rotated_cropped)
