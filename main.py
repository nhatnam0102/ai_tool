import base64
import threading
import cv2
import os
import json
import imutils
import io
from datetime import datetime
import torch.hub
import numpy as np

from upc.general import LOGGER
from upc.config import Config
from rembg import remove
from PIL import Image
from upc import general

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
from flask import Flask, render_template, redirect, url_for, request, Response

app = Flask(__name__)
app.config.from_object(Config)

detect_hub = None
product_data = None


class DetectHub(threading.Thread):
    def __init__(self, source_yolo_path, weights, source="local", name="custom", setting=None):
        super(DetectHub, self).__init__()
        self.source_yolo_path = source_yolo_path
        self.weights = weights
        self.name = name
        self.source = source
        time = datetime.now()
        self.model_top = None
        self.model_yoko = None
        self.model_second = None
        self.model_unknown = None
        self.frame = None
        self.setting = setting
        try:
            t1 = threading.Thread(target=self.load_top_model)
            t2 = threading.Thread(target=self.load_side_model)
            t3 = threading.Thread(target=self.load_case_model)
            t1.start()
            t2.start()
            t3.start()
            t1.join()
            t2.join()
            t3.join()
        except Exception as e:
            LOGGER.error(f"LOAD MODEL FAILED : {e}")
        print(f"{datetime.now() - time}")

    def load_top_model(self):
        self.model_top = torch.hub.load(self.source_yolo_path, self.name, path=self.weights["top"], source=self.source)

    def load_side_model(self):
        self.model_yoko = torch.hub.load(self.source_yolo_path, self.name, path=self.weights["side"],
                                         source=self.source)

    def load_case_model(self):
        self.model_second = torch.hub.load(self.source_yolo_path, self.name, path=self.weights["case"],
                                           source=self.source)


def init_model():
    """
    Init model Top, Side

    :return: None
    """
    # Init Model
    global detect_hub
    weights = {"top": os.path.join(os.getcwd(), "upc", "models", "top.pt"),
               "side": os.path.join(os.getcwd(), "upc", "models", "side.pt"),
               "case": os.path.join(os.getcwd(), "upc", "models", "case.pt"),
               "unknown": os.path.join(os.getcwd(), "upc", "models", "unknown.pt")}
    detect_hub = DetectHub(source_yolo_path=os.getcwd(), weights=weights)


@app.route('/index', methods=['GET', 'POST'])
def index():
    global product_data
    product_data = None
    if request.method == 'POST':
        if request.form['btn_control'] == "btn_info":
            return redirect(url_for('information'))
        if request.form['btn_control'] == "btn_add":
            return redirect(url_for('add_product'))

    return render_template('index.html')


@app.route('/information', methods=['GET', 'POST'])
def information():
    return render_template('information.html')


@app.route('/change', methods=['GET', 'POST'])
def change():
    return render_template('change.html')


@app.route('/augmentations', methods=['GET', 'POST'])
def augmentations():
    return render_template('augmentations.html')


@app.route('/camera_top/<string:camera_id>/', methods=["GET"])
def camera_top(camera_id):
    return Response(get_frame(camera_id),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/camera_side/<string:camera_id>/', methods=["GET"])
def camera_side(camera_id):
    return Response(get_frame(camera_id),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    global product_data
    with open('./static/resource/json/wrap_image_data.json') as json_file:
        wrap_data = json.load(json_file)

    if request.method == 'GET':
        if product_data and wrap_data:
            return render_template('add_product.html', product_data=product_data, wrap_data=wrap_data)
        else:
            return render_template('add_product.html')
    if request.method == "POST":
        data = request.get_json()
        if data:
            product_data = data['submit_dict']
            return "OK"
        else:
            return render_template('add_product.html')

@app.route('/page_not_found',methods=['GET'])
def page_not_found():
    return render_template('page_not_found.html'),404


@app.route('/camera_manager',methods=['POST','GET'])
def camera_manager():
    if request.method == 'GET':
        return "OK"
      
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        cameras={'TOP_ID':data['cameras']['TOP_ID'],'SIDE_ID':data['cameras']['SIDE_ID']}
        with open('static/resource/json/camera_manager.json', 'w+') as f:
            json.dump(cameras, f)

        return 'OK'


def base642opencv(base64_str):
    src = base64_str.split(",")
    imgdata = base64.b64decode(str(src[1]))
    img = Image.open(io.BytesIO(imgdata))
    img = general.toImgOpenCV(img)
    return src[0], img


@app.route('/get_feature_image', methods=["POST"])
def get_feature_image():
    if request.method == "POST":
        try:
            data = request.get_json()
            im_data = data['data_js']['removed_im_data']
            box = data['data_js']['boxes']
            bs, img = base642opencv(im_data)
            im_crop = img[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
            img_base64 = base64.b64encode(cv2.imencode('.png', im_crop)[1]).decode('utf-8')
            return f"{bs},{img_base64}"
        except Exception as e:
            print(e)
            return ""


@app.route('/remove_bg', methods=["POST"])
def remove_bg():
    if request.method == "POST":
        t1 = datetime.now()
        base64_str = request.form['base64_data']
        bs, img = base642opencv(base64_str)
        img = remove(img)
        img = general.cut_bg_image(img)
        img_base64 = base64.b64encode(cv2.imencode('.png', img)[1]).decode('utf-8')
        print(datetime.now() - t1)
        return f"{bs},{img_base64}"


def get_frame(camera_id):
    global detect_hub
    video = cv2.VideoCapture(int(camera_id), cv2.CAP_DSHOW)
    video.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    video.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    while True:
        ret, frame = video.read()
        if not ret:
            video.release()
            break
      

        ret, png = cv2.imencode('.png', frame)
        frame = png.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route("/")
@app.route('/login', methods=['GET', 'POST'])
def login():
    # TODO Add Authentication with Flask-Login
    error = None
    # init_model()
    if request.method == 'POST':
        if request.form['username'] != 'admin' or request.form['user_password'] != 'admin':
            error = 'Invalid Credentials. Please try again.'
        else:
            return redirect(url_for('index'))
    return render_template('login.html', error=error)


if __name__ == '__main__':
    app.run(debug=True)
