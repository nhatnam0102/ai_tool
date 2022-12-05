# dic = [str(cls) for cls in range(0, 21, 1)]
# print(dic)
import os.path
import random
import time

from upc import general
import cv2
import shutil

from os.path import join
from os.path import basename
import logging

import csv

from rembg import remove
import albumentations as A

JOIN = os.path.join
ROOT = r"\\192.168.0.241\nam\yakult_project\Dataset\dataset_20220921"
lists,_=general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\merged")
for f in lists:
    old=f
    new=JOIN(r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\merged",f"20221205_{basename(f)}")
    os.rename(old,new)

# labels = join(ROOT, "side", "labels")
# txt, _ = general.get_all_file(labels)
# #
# old_cls_side = [-99, -1, -2, -3, 3, 4, 25, 26, 28, 29, 31, 32, 34, 21, 23, 7, 10, 13, 16, 19, 73, 74, 75, 76, 77, 78,
#                 79,
#                 80, 81, 82, 83, 84, 85, 86, 87, 88, -4, 1, 42, 43, 44, 20, 22, 40, 41, 45, 33, -5, -6, -7, -8, -9, -10,
#                 -11, -12, -13, -14, -15, -16, 47]
#
old_cls_top = [0, 42, 43, 44, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 22, 40, 41, 45, 33, 24, 25, 27, 28, 30, 31,
               35, 36, 37, 38, 39, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
               67, 68, 69, 70, 71, 72, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15]
#
# print(len(old_cls_top))
# change_cls = {}
# for index, cls in enumerate(old_cls_top):
#     change_cls[str(cls)] = index
#
# txts = []
# pngs = []


# for file in txt:
#     if file.endswith("txt"):
#         with open(file, "r", encoding="utf-8") as f:
#             data = [line.strip() for line in f]
#         with open(file, "w+") as f1:
#             for text in data:
#                 texts = text.split(" ")
#                 if int(texts[0]) == 46:
#                     # txts.append(file)
#                     # pngs.append(file[:-4])
#                     new_line = f"{59} {texts[1]} {texts[2]} {texts[3]} {texts[4]}"
#                     f1.writelines(new_line)
#                     f1.writelines("\n")
#                 elif str(texts[0]) in change_cls.keys():
#                     new_line = f"{change_cls[str(texts[0])]} {texts[1]} {texts[2]} {texts[3]} {texts[4]}"
#                     f1.writelines(new_line)
#                     f1.writelines("\n")

# files, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\20221005_data\top")
# save = r"\\192.168.0.241\nam\yakult_project\20221005_data\square\square_images"
# for f in files:
#     print(f)
# if f.endswith("png"):
#     img = cv2.imread(f)
#     h, w = img.shape[:2]
#     pad = abs(w - h)
#     if w > h:
#         padded_img = cv2.copyMakeBorder(
#             img, 0, pad, 0, 0, borderType=cv2.BORDER_CONSTANT, value=[128, 128, 128])
#     else:
#         padded_img = cv2.copyMakeBorder(
#             img, 0, 0, 0, pad, borderType=cv2.BORDER_CONSTANT, value=[128, 128, 128])
#     cv2.imwrite(join(save, os.path.basename(f)[:-4] + "_square.png"), padded_img)
#     old, new = f, join(r"\\192.168.0.241\nam\yakult_project\20221005_data\square", "images", os.path.basename(f))
#     shutil.copy(old, new)

import threading
from datetime import datetime

import numpy as np
from upc import general

# create_dataset(r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\Dataset\20221102",
#                r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\merged",
#                r"\\192.168.0.241\nam\yakult_project\images_processed\background_1\side_bg")
# p_merge2, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\20221118\merged")
# save_merge3 = r"\\192.168.0.241\nam\yakult_project\images_processed\20221118\merged2"
# for f in p_merge2:
#     if f.endswith("png"):
#         img = cv2.imread(f)
#         img = general.augment_hsv(img, hgain=0.015, sgain=0.7, vgain=0.4)
#         cv2.imwrite(join(save_merge3,
#                          basename(f)[:-4] + "-hsv.png"), img)
#
#         old = f[:-4] + ".txt"
#         new = join(save_merge3, basename(f)[:-4] + "-hsv.txt")
#         shutil.copy(old, new)

# save_ = r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\merged"
# general.merge_thread(p_foregrounds=r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\resize_1",
#                      p_backgrounds=r"\\192.168.0.241\nam\yakult_project\images_processed\background_1\top_bg",
#                      p_save=save_,
#                      rotate_=359,
#                      cutout_=True,
#                      name="{time}"
#                      )

# count_annotation(save_, "classes.txt")

#check annotation
# general.check_annotation(r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\top",
#                          r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\top",
#                          r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\test_top")

# # Resize
# files, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\processed")
# save1 = r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\resize_1"
# general.resize(files, save1)

# Add Plastic Film
# p_wrap = r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\wrap"
# save_wrap = r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\wrap_plastic"
# add_plastic(path_wrap=p_wrap, path_foreground=save1, save_path=save_wrap)

# # Affine
# affine_image_2(r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\resize",
#                r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\affine")
#
# # Inline
# in_line(r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\resize",
#         r"\\192.168.0.241\nam\yakult_project\images_processed\20221019_check_with_parameter\inline")

# Blur Brightness
# transform = A.Compose([
#     A.RandomBrightnessContrast(),
#     A.Blur()])
# files_1, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\20221111\new\merged")
# for f in files_1:
#     if f.endswith("png"):
#         image = cv2.imread(f, cv2.IMREAD_UNCHANGED)
#         image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#         transformed = transform(image=image)
#         transformed_image = transformed["image"]
#         transformed_image = cv2.cvtColor(transformed_image, cv2.COLOR_RGB2BGR)
#         cv2.imwrite(join(r"\\192.168.0.241\nam\yakult_project\images_processed\20221111\new\merged2",
#                          basename(f)[:-4] + "-tranform1_bn_blr.png"), transformed_image)
#
#         old = f[:-4] + ".txt"
#         new = join(r"\\192.168.0.241\nam\yakult_project\images_processed\20221111\new\merged2",
#                    basename(f)[:-4] + "-tranform1_bn_blr.txt")
#         shutil.copy(old,new)

# removes, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\new")
# save_p = r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\removed"
# save_processed=r"\\192.168.0.241\nam\yakult_project\images_processed\20221202\processed"
# for rm in removes:
#     im = general.remove_background(rm,join(save_p,basename(rm)))
#     general.cut_from_removed_background(join(save_p,basename(rm)),join(save_processed,basename(rm)))

# im = general.remove_background(
#     r"\\192.168.0.241\nam\yakult_project\images_processed\20221111\new\image\before_top_20221107_092627.png",
#     save_path=r"\\192.168.0.241\nam\yakult_project\images_processed\20221111\new\original\76_01-1.png")
# general.cut_from_removed_background("./76_01-1.png")
# cv2.imwrite("75_01-1.png", im)
# files, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\20221118\affine")
# for imp in files:
#     f1, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\background_1\top_bg")
#     imbg = random.choices(f1)
#     # print(imbg)
#     save = r"\\192.168.0.241\nam\yakult_project\images_processed\20221118\merged1"
#     # im_ = general.cross_single_by_opencv(imp,imbg[0],save,fit_image=(0, 0), fit_box=(0, 0), angle=-180, mod_case=False)[1]
#     im_ = general.affine_5_degrees(imp, imbg[0], save, fit_image=(0, 0), fit_box=(0, 0), pers_size=40, rotate=False)[1]
# cv2.imshow("s", cv2.resize(im_, (0, 0), fy=.7, fx=.7))
# cv2.waitKey(0)
# cv2.destroyAllWindows()
# general.cross_by_pil(fit_image=(0,0),fit_box=(0,0))

# import face_recognition
# from upc import general
#
# my_pic = face_recognition.load_image_file("30.png")
# hai_pic = face_recognition.load_image_file("50.png")
# my_face_encoding = face_recognition.face_encodings(my_pic)[0]
# hai_face_encoding = face_recognition.face_encodings(hai_pic)[0]
# know = [my_face_encoding, hai_face_encoding]
# name = ["NAM", "HAI"]
# cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
# idx = 0
# face_name = []
# face_locations = []
# process_this_frame = True
# while True:
#     ret, frame = cap.read()
#
#     if not ret:
#         break
#     #
#     if process_this_frame:
#         frame_1 = general.toImgPIL(frame.copy())
#         np_frame = np.array(frame_1)
#         face_locations = face_recognition.face_locations(np_frame)
#         x = face_recognition.face_encodings(np_frame, face_locations)
#         face_name = []
#         if len(x) > 0:
#             for face in x:
#
#                 results = face_recognition.compare_faces(know, face,0.9)
#                 name_ = "UNKNOWN"
#                 # # If a match was found in known_face_encodings, just use the first one.
#                 # if True in matches:
#                 #     first_match_index = matches.index(True)
#                 #     name = known_face_names[first_match_index]
#                 face_distances = face_recognition.face_distance(know, face)
#                 best_match_index = np.argmin(face_distances)
#                 if results[best_match_index]:
#                     name_ = name[best_match_index]
#
#                 face_name.append(name_)
#
#                 print(results)
#     process_this_frame = not process_this_frame
#     for (y, w, h, x), n in zip(face_locations, face_name):
#         cv2.rectangle(frame, (x, y), (w, h), (0, 255, 0), 1)
#         cv2.putText(frame, n, (x + 6, h - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)
#
#     cv2.imshow("a", frame)
#     idx += 1
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# import base64
# import json
#
# files, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\list")
# with open("./static/resource/top.txt","r", encoding='utf-8') as f:
#     lines=[line.strip(" ") for line in f.readlines()]
#
#
# data = []
# for f in files:
#     a = {}
#     id1 = general.class_id(basename(f))
#     print(id1)
#     encode = base64.b64encode(open(f, "rb").read())
#     a['id'] = int(id1)
#     a['image'] = encode.decode('utf-8')
#     a['name']=lines[int(id1)+1]
#     data.append(a)
# with open('./static/resource/data.json', 'w+') as f:
#     # this would place the entire output on one line
#     # use json.dump(lista_items, f, indent=4) to "pretty-print" with four spaces per indent
#     json.dump(data, f)


# TEMPLATE_MATCHING
#
# DEFAULT_TEMPLATE_MATCHING_THRESHOLD = 0.6
#
#
# def compute_iou(
#         boxA, boxB
# ):
#     xA = max(boxA["TOP_LEFT_X"], boxB["TOP_LEFT_X"])
#     yA = max(boxA["TOP_LEFT_Y"], boxB["TOP_LEFT_Y"])
#     xB = min(boxA["BOTTOM_RIGHT_X"], boxB["BOTTOM_RIGHT_X"])
#     yB = min(boxA["BOTTOM_RIGHT_Y"], boxB["BOTTOM_RIGHT_Y"])
#     interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
#     boxAArea = (boxA["BOTTOM_RIGHT_X"] - boxA["TOP_LEFT_X"] + 1) * (boxA["BOTTOM_RIGHT_Y"] - boxA["TOP_LEFT_Y"] + 1)
#     boxBArea = (boxB["BOTTOM_RIGHT_X"] - boxB["TOP_LEFT_X"] + 1) * (boxB["BOTTOM_RIGHT_Y"] - boxB["TOP_LEFT_Y"] + 1)
#     iou = interArea / float(boxAArea + boxBArea - interArea)
#     return iou
#
#
# def non_max_suppression(
#         objects,
#         non_max_suppression_threshold=0.5,
#         score_key="MATCH_VALUE",
# ):
#     """
#     Filter objects overlapping with IoU over threshold by keeping only the one with maximum score.
#     Args:
#         objects (List[dict]): a list of objects dictionaries, with:
#             {score_key} (float): the object score
#             {top_left_x} (float): the top-left x-axis coordinate of the object bounding box
#             {top_left_y} (float): the top-left y-axis coordinate of the object bounding box
#             {bottom_right_x} (float): the bottom-right x-axis coordinate of the object bounding box
#             {bottom_right_y} (float): the bottom-right y-axis coordinate of the object bounding box
#         non_max_suppression_threshold (float): the minimum IoU value used to filter overlapping boxes when
#             conducting non max suppression.
#         score_key (str): score key in objects dicts
#     Returns:
#         List[dict]: the filtered list of dictionaries.
#     """
#     sorted_objects = sorted(objects, key=lambda obj: obj[score_key], reverse=True)
#     filtered_objects = []
#     for object_ in sorted_objects:
#         overlap_found = False
#         for filtered_object in filtered_objects:
#             iou = compute_iou(object_, filtered_object)
#             if iou > non_max_suppression_threshold:
#                 overlap_found = True
#                 break
#         if not overlap_found:
#             filtered_objects.append(object_)
#     return filtered_objects
#
#
# class Template:
#     """
#     A class defining a template
#     """
#
#     def __init__(self, image_path, label, color, matching_threshold=DEFAULT_TEMPLATE_MATCHING_THRESHOLD):
#         """
#         Args:
#             image_path (str): path of the template image path
#             label (str): the label corresponding to the template
#             color (List[int]): the color associated with the label (to plot detections)
#             matching_threshold (float): the minimum similarity score to consider an object is detected by template
#                 matching
#         """
#         self.image_path = image_path
#         self.label = label
#         self.color = color
#         self.template = cv2.imread(image_path)
#         self.template_height, self.template_width = self.template.shape[:2]
#         self.matching_threshold = matching_threshold
#
#
# files, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\patern")
# file1, _ = general.get_all_file(r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\temp")
# templates = []
# for f in file1:
#     templates.append(Template(image_path=f, label="1",
#                               color=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))))
#
# for img in files:
#     t1 = datetime.now()
#     image = cv2.imread(img)
#     detections = []
#     for template in templates:
#         template_matching = cv2.matchTemplate(
#             template.template, image, cv2.TM_CCOEFF_NORMED
#         )
#
#         match_locations = np.where(template_matching >= template.matching_threshold)
#
#         for (x, y) in zip(match_locations[1], match_locations[0]):
#             match = {
#                 "TOP_LEFT_X": x,
#                 "TOP_LEFT_Y": y,
#                 "BOTTOM_RIGHT_X": x + template.template_width,
#                 "BOTTOM_RIGHT_Y": y + template.template_height,
#                 "MATCH_VALUE": template_matching[y, x],
#                 "LABEL": template.label,
#                 "COLOR": template.color
#             }
#
#             detections.append(match)
#
#     NMS_THRESHOLD = 0.2
#     detections = non_max_suppression(detections, non_max_suppression_threshold=NMS_THRESHOLD)
#     image_with_detections = image.copy()
#     for detection in detections:
#         cv2.rectangle(
#             image_with_detections,
#             (detection["TOP_LEFT_X"], detection["TOP_LEFT_Y"]),
#             (detection["BOTTOM_RIGHT_X"], detection["BOTTOM_RIGHT_Y"]),
#             detection["COLOR"],
#             2,
#         )
#         cv2.putText(
#             image_with_detections,
#             f"{detection['LABEL']} - {detection['MATCH_VALUE']}",
#             (detection["TOP_LEFT_X"] + 2, detection["TOP_LEFT_Y"] + 20),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             0.5,
#             detection["COLOR"],
#             1,
#             cv2.LINE_AA,
#         )
#     cv2.imwrite(join(r"\\192.168.0.241\nam\yakult_project\images_processed\test_patern-matching\save",
#                      f"{basename(img)[:-4]}.png"), image_with_detections)
#     print(datetime.now() - t1)
