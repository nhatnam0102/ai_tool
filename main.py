import base64
import threading

import cv2

import os

import imutils
import io

from PIL import Image
from flask_socketio import emit, join_room, leave_room, SocketIO
from upc import general

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
from flask import Flask, render_template, redirect, url_for, request, Response
from datetime import datetime
import torch.hub
import numpy as np

from upc.general import LOGGER

from upc.config import Config

app = Flask(__name__)
app.config.from_object(Config)

detect_hub = None
socketio = SocketIO(app, cors_allowed_origins='*')


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


def get_cameras():
    return {'TOP': 0, 'SIDE': 1}


@app.route('/index', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if request.form['btn_control'] == "btn_info":
            return redirect(url_for('information'))
        if request.form['btn_control'] == "btn_add":
            return redirect(url_for('add_product'))
        if request.form['btn_control'] == "btn_change":
            return redirect(url_for('change'))
        if request.form['btn_control'] == "btn_augmentations":
            return redirect(url_for('augmentations'))

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


@app.route('/add_product')
def add_product():
    return render_template('add_product.html', cameras=get_cameras())
    # return render_template('add_product.html')


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
        # result_top = detect_hub.model_top(frame)
        # boxes = []
        # if result_top is not None:
        #     # TODO set to box
        #
        #     for box in result_top.xyxy[0]:
        #         (case_x_min, case_y_min, case_x_max, case_y_max, case_conf, case_cls) = (
        #             int(box[0]), int(box[1]), int(box[2]), int(box[3]), float(box[4]), int(box[5]))
        #         temp_box = (
        #             case_x_min, case_y_min, case_x_max, case_y_max, case_conf, case_cls)
        #
        #         boxes.append(temp_box)
        #     # TODO Remove over box in boxes
        #
        #     for box in boxes:
        #         frame = draw_put_text(frame, int(box[0]), int(box[1]), int(box[2]),
        #                               int(box[3]), float(box[4]), int(box[5]), point=True)

        ret, png = cv2.imencode('.png', frame)
        frame = png.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


def draw_put_text(draw_img, x1, y1, x2, y2, conf, cls, point=False, not_show_conf=False):
    """
    Draw text on image

    :param draw_img:
    :param x1:
    :param y1:
    :param x2:
    :param y2:
    :param conf:
    :param cls:
    :param point:
    :param not_show_conf:
    :return: Image drawn
    """
    if int(conf * 100) >= 80:
        color = (0, 0, 255)  # BLUE
    elif int(conf * 100) >= 50:
        color = (0, 255, 0)  # GREEN
    else:
        color = (255, 0, 0)  # RED
    if point:
        over = draw_img.copy()
        cv2.circle(over, (int(x1 + (x2 - x1) / 2), int(y1 + (y2 - y1) / 2)), 28, color, thickness=-1,
                   lineType=cv2.LINE_4, shift=0)
        alpha = 0.4

        draw_img = cv2.addWeighted(over, alpha, draw_img, 1 - alpha, 0)

        cv2.circle(draw_img, (int(x1 + (x2 - x1) / 2), int(y1 + (y2 - y1) / 2)), 30, color, thickness=5,
                   lineType=cv2.LINE_4,
                   shift=0)
        # cv2.ellipse(draw_img, center=(int(x1 + (x2 - x1) / 2), int(y1 + (y2 - y1) / 2)),
        #             axes=(40, 40),
        #             angle=270,
        #             startAngle=0,
        #             endAngle=360,
        #             color=(128, 128, 128),
        #             thickness=7,
        #             lineType=cv2.LINE_4,
        #             shift=0)
        # cv2.ellipse(draw_img, center=(int(x1 + (x2 - x1) / 2), int(y1 + (y2 - y1) / 2)),
        #             axes=(40, 40),
        #             angle=270,
        #             startAngle=0,
        #             endAngle=int(conf * 360),
        #             color=color,
        #             thickness=7,
        #             lineType=cv2.LINE_4,
        #             shift=0)
        # cv2.putText(draw_img, f"{cls}",
        #             (int(x1 + (x2 - x1) / 2) - 20, int(y1 + (y2 - y1) / 2) + 10),
        #             cv2.FONT_HERSHEY_COMPLEX, 1,
        #             (255, 255, 255), 6, cv2.LINE_AA)
        # cv2.putText(draw_img, f"{cls}",
        #             (int(x1 + (x2 - x1) / 2) - 20, int(y1 + (y2 - y1) / 2) + 10),
        #             cv2.FONT_HERSHEY_COMPLEX, 1, color,
        #             2, cv2.LINE_AA)
    else:
        cv2.rectangle(draw_img, (x1, y1),
                      (x2, y2), color, 2)
        cv2.putText(draw_img, f"{cls} {int(conf * 100)}%", (x1 + 10, y1 + 30), cv2.FONT_HERSHEY_COMPLEX, 1,
                    (255, 255, 255), 6, cv2.LINE_AA)
        cv2.putText(draw_img, f"{cls} {int(conf * 100)}%", (x1 + 10, y1 + 30), cv2.FONT_HERSHEY_COMPLEX, 1, color,
                    3, cv2.LINE_AA)

        # z = 30
        # x = 10
        # cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        # if (x2 - x1) < (y2 - y1):
        #     z = (cx - x1) // 2
        #     x = z // 3
        # else:
        #     z = (cy - y1) // 2
        #     x = z // 3
        #
        # thickness = 2
        # if not_show_conf:
        #     text = f"{cls}"
        # else:
        #     text = f"{cls} {int(conf * 100)}%"
        # if cls >= 10:
        #     text_pos = (int(cx - z // 2), int(cy + z // 2))
        # else:
        #     text_pos = (int(cx - z // 3), int(cy + z // 3))
        #
        # cv2.putText(draw_img, text, text_pos, cv2.FONT_HERSHEY_SIMPLEX, 1,
        #             (255, 255, 255), 7, cv2.LINE_AA)
        # cv2.putText(draw_img, text, text_pos, cv2.FONT_HERSHEY_SIMPLEX, 1, color,
        #             3, cv2.LINE_AA)
        # color1 = (255, 255, 255)
        # color = (0, 255, 0)
        # thickness_border = 3
        # pts1 = np.array([[cx - z, cy - z + x], [cx - z, cy - z], [cx - z + x, cy - z]], np.int32)
        # pts1 = pts1.reshape((-1, 1, 2))
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color1,
        #                          thickness=thickness + thickness_border)
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color, thickness=thickness)
        #
        # pts1 = np.array([[cx + z, cy - z + x], [cx + z, cy - z], [cx + z - x, cy - z]], np.int32)
        # pts1 = pts1.reshape((-1, 1, 2))
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color1,
        #                          thickness=thickness + thickness_border)
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color, thickness=thickness)
        #
        # pts1 = np.array([[cx - z, cy + z - x], [cx - z, cy + z], [cx - z + x, cy + z]], np.int32)
        # pts1 = pts1.reshape((-1, 1, 2))
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color1,
        #                          thickness=thickness + thickness_border)
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color, thickness=thickness)
        #
        # pts1 = np.array([[cx + z, cy + z - x], [cx + z, cy + z], [cx + z - x, cy + z]], np.int32)
        # pts1 = pts1.reshape((-1, 1, 2))
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color1,
        #                          thickness=thickness + thickness_border)
        # draw_img = cv2.polylines(draw_img, pts=[pts1], isClosed=False, color=color, thickness=thickness)

    return draw_img


@socketio.on('image')
def image(data_image):
    sbuf = io.StringIO()
    sbuf.write(data_image)

    # decode and convert into image
    b = io.BytesIO(base64.b64decode(data_image))
    pimg = Image.open(b)

    # converting RGB to BGR, as opencv standards
    frame = cv2.cvtColor(general.toImgOpenCV(pimg), cv2.COLOR_RGB2BGR)

    # Process the image frame
    frame = imutils.resize(frame, width=700)
    frame = cv2.flip(frame, 1)
    imgencode = cv2.imencode('.jpg', frame)[1]

    # base64 encode
    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpg;base64,'
    stringData = b64_src + stringData

    # emit the frame back
    emit('response_back', stringData)


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
