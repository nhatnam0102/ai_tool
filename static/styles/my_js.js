//Show Top Camera
const showTopPhoto = document.getElementById("top-show-camera");
const showTopFile = document.getElementById("top-import-file");
const topPhoto = document.getElementById("top-photo");
const topCanvas = document.getElementById("top-canvas");
showTopPhoto.style.display = "none";
showTopFile.style.display = "none";
topPhoto.style.display = "none";
document.getElementById("top-old-product-input").style.display = 'none';
document.getElementById(`${'top'}-option-1`).checked = true;
//document.getElementById("top-new-product-input").style.display = 'none';

//Show Side Camera
const showSidePhoto = document.getElementById("side-show-camera");
const showSideFile = document.getElementById("side-import-file");
const sidePhoto = document.getElementById("side-photo");
const sideCanvas = document.getElementById("side-canvas");
sideCanvas.style.display = "none";
showSidePhoto.style.display = "none";
showSideFile.style.display = "none";
sidePhoto.style.display = "none";
document.getElementById("side-old-product-input").style.display = 'none';
document.getElementById("side-new-product-input").style.display = 'none';

let get_canvas_data=null;
let canvas_w=null;
let canvas_h=null;

let input_element = document.querySelector("input");

input_element.addEventListener("keyup", () => {
    input_element.setAttribute("value", input_element.value);
})
function clear() {
    showTopPhoto.style.display = "none";
    showTopFile.style.display = "none";
    topPhoto.style.display = "none";
    topCanvas.classList.remove('z-index-2');
    get_canvas_data=null;
    document.getElementsByClassName("camera-control")[0].hidden=true;
    document.querySelector('input[type="range"]').hidden=true;
    console.log("xoa")

    showSidePhoto.style.display = "none";
    showSideFile.style.display = "none";
    sidePhoto.style.display = "none";
    sideCanvas.classList.remove('z-index-2');

}
//onclick Event
document.getElementById('top').onclick = (event) => {
    getPhotoFromCamera('top');
}

document.getElementById('side').onclick = (event) => {
    getPhotoFromCamera('side');
}



function clearPhoto(camera) {
    let canvas = document.getElementById(`${camera}-canvas`);
    let photo = document.getElementById(`${camera}-photo`);
    let context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function readURL(input, camera) {
    clearPhoto(camera);
    closeMediaStream();
    if (camera == 'top') {
        showTopPhoto.style.display = "none";
        topPhoto.style.display = "none";
        showTopFile.style.display = "block";
    } else {
        showSidePhoto.style.display = "none";
        sidePhoto.style.display = "none";
        showSideFile.style.display = "block";
    }




    if (input.files && input.files[0]) {

        let reader = new FileReader();

        reader.onload = function(e) {
            //      $('.image-upload-wrap').hide();

            $(`.${camera}-file-upload-image`).attr('src', e.target.result);
            $(`.${camera}-file-upload-content`).show();

            $(`.${camera}-image-title`).html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload(camera);
    }
}

function removeUpload(camera) {
    $(`.${camera}-file-upload-input`).replaceWith($(`.${camera}-file-upload-input`).clone());
    $(`.${camera}-file-upload-content`).hide();
    $(`.${camera}-image-upload-wrap`).show();
}
$('.top-image-upload-wrap').bind('dragover', function() {
    $('.top-image-upload-wrap').addClass('image-dropping');
});
$('.top-image-upload-wrap').bind('dragleave', function() {
    $('.top-image-upload-wrap').removeClass('image-dropping');
});
$('.side-image-upload-wrap').bind('dragover', function() {
    $('.side-image-upload-wrap').addClass('image-dropping');
});
$('.side-image-upload-wrap').bind('dragleave', function() {
    $('.side-image-upload-wrap').removeClass('image-dropping');
});

function myfunction() {
    $('.collapse').collapse('show');
}

function myfunction2() {
    $('.collapse').collapse('hide');
}


// reference to the current media stream
var mediaStream = null;


// Prefer camera resolution nearest to 1280x720.
var constraints = {
    audio: false,
    video: {
        deviceId: "",
        width: {
            min: 640,
            ideal: 1920,
            max: 1920
        },
        height: {
            min: 360,
            ideal: 1080
        },
        aspectRatio: 1.777777778,
        focusMode: 'manual',
        focusDistance: 0.33

    }
};

async function getMediaStream(constraints, camera) {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        let video = document.getElementById(`${camera}-cam`);
        video.srcObject = mediaStream;
         const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

  // Check whether focus distance is supported or not.
  if (!capabilities.focusDistance) {
    return;
  }

  // Map focus distance to a slider element.
  const input = document.querySelector('input[type="range"]');
  input.min = capabilities.focusDistance.min;
  input.max = capabilities.focusDistance.max;
  input.step = capabilities.focusDistance.step;
  input.value = track.getSettings().focusDistance;

  input.oninput = function(event) {
    track.applyConstraints({
      advanced: [
        {
          focusMode: "manual",
          focusDistance: event.target.value
        }
      ]
    });
  };
  input.hidden = false;
        video.onloadedmetadata = (event) => {
            video.play();
        };
    } catch (err) {
        console.error(err.message);
    }
};

async function getPhotoFromCamera(camera) {
    try {
        removeUpload(camera);
        clearPhoto(camera);
        clear();
         // stop the current video stream
        if (mediaStream != null && mediaStream.active) {
            var tracks = mediaStream.getVideoTracks();
            tracks.forEach(track => {
                track.stop();
            });
        }

        if (camera == 'top') {
            showTopFile.style.display = "none";
            showTopPhoto.style.display = "flex";
            document.getElementsByClassName("camera-control")[0].hidden=false;
            // change "deviceID"
            constraints.video.deviceId = "ec0f33c7b87862c1c21b37238a5724ddc15d982ab3bc38c742e3318a959e16ef";
        } else if (camera == 'side') {
            showSideFile.style.display = "none";
            showSidePhoto.style.display = "flex";

            // change "deviceID"
            constraints.video.deviceId = "deedc2c4b18a65ee1306b94207fb59d1a184194babbe4ad6679606f9818cd568";
        }


        // set the video source to null
        document.getElementById(`${camera}-cam`).srcObject = null;
        // get new media stream
        await getMediaStream(constraints, camera);
    } catch (err) {
        console.error(err.message);
        alert(err.message);
    }
}

//
document.getElementById('take-top-photo').onclick = (event) => {
    takePicture('top');
    event.preventDefault();
}
document.getElementById('take-side-photo').onclick = (event) => {
  takePicture('side');
  event.preventDefault();
}

function takePicture(camera) {
    let canvas = document.getElementById(`${camera}-canvas`);
    let video = document.getElementById(`${camera}-cam`);
    let photo = document.getElementById(`${camera}-photo`);
    let context = canvas.getContext('2d');

    const height = video.videoHeight;
    const width = video.videoWidth;

    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        const data = canvas.toDataURL("image/png");

        //send data to draw step
        get_canvas_data=data;
        canvas_h=height;
        canvas_w=width;

        photo.setAttribute("src", data);
        video.classList.remove("z-index-1");
        photo.classList.remove("z-index-0");

        video.classList.add("z-index-0");
        photo.classList.add("z-index-1");

        photo.style.display = "flex";
//        canvas.style.display = 'block';
//        canvas.classList.add("z-index-2");

        //Show snackBar
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function() {
            x.className = x.className.replace("show", "");
        }, 3000);
//
//        canvas.addEventListener("mousedown", function(e) {
//            var offset = $(this).offset()
//            var mouseX = e.pageX - this.offsetLeft;
//            var mouseY = e.pageY - this.offsetTop;
//
//            paint = true;
//            addClick(e.pageX - offset.left, e.pageY - offset.top);
//            redraw(context);
//        }, false);
//
//
//        canvas.addEventListener("mousemove", function(e) {
//            if (paint) {
//                var offset = $(this).offset()
//                //addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
//                addClick(e.pageX - offset.left, e.pageY - offset.top, true);
//                console.log(e.pageX, offset.left, e.pageY, offset.top);
//                redraw(context);
//            }
//        }, false);
//
//        canvas.addEventListener("mouseup", function(e) {
//            paint = false;
//        }, false);
//        canvas.addEventListener("mouseleave", function(e) {
//            context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
//            clickX = new Array();
//            clickY = new Array();
//            clickDrag = new Array();
//            paint = false;
//        }, false);
    } else {
        clearPhoto(camera);
    }
}



//
//var clickX = new Array();
//var clickY = new Array();
//var clickDrag = new Array();
//var paint;
//
//function addClick(x, y, dragging) {
//    clickX.push(x);
//    clickY.push(y);
//    clickDrag.push(dragging);
//}
//
//function redraw(context) {
//    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
//
//    context.strokeStyle = "#df4b26";
//    context.lineJoin = "round";
//    context.lineWidth = 5;
//
//    for (var i = 0; i < clickX.length; i++) {
//        context.beginPath();
//        if (clickDrag[i] && i) {
//            context.moveTo(clickX[i - 1], clickY[i - 1]);
//        } else {
//            context.moveTo(clickX[i] - 1, clickY[i]);
//        }
//        context.lineTo(clickX[i], clickY[i]);
//        context.closePath();
//        context.stroke();
//    }
//}


function rePlay(camera) {
    clearPhoto(camera);
    document.getElementById(`${camera}-cam`).classList.remove("z-index-0");
    document.getElementById(`${camera}-photo`).classList.remove("z-index-1");
//    document.getElementById(`${camera}-canvas`).classList.remove("z-index-2");

    document.getElementById(`${camera}-cam`).classList.add("z-index-1");
    document.getElementById(`${camera}-photo`).classList.add("z-index-0");

}

function closeMediaStream() {
    if (mediaStream != null && mediaStream.active) {
        var tracks = mediaStream.getVideoTracks();
        tracks.forEach(track => {
            track.stop();
        });
    }
}

function closeAndClear(camera) {
    closeMediaStream();
    removeUpload(camera);
    clearPhoto(camera);
    clear();

}

function checkRadio(id,camera) {
    if (id == `${camera}-option-1`) {
        console.log('new')
        document.getElementById(`${camera}-new-product-input`).style.display = 'block';
        document.getElementById(`${camera}-option-1`).checked = true;
        document.getElementById(`${camera}-old-product-input`).style.display = 'none';
        document.getElementById(`${camera}-option-2`).checked = false;
    } else if (id == `${camera}-option-2`) {
        console.log('old')
        document.getElementById(`${camera}-new-product-input`).style.display = 'none';
        document.getElementById(`${camera}-option-1`).checked = false;
        document.getElementById(`${camera}-old-product-input`).style.display = 'block';
        document.getElementById(`${camera}-option-2`).checked = true;
    }
}

let product_data = null;

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");

fetch('static/resource/data.json').then(response => {
    return response.json();
}).then(data => {
    // Work with JSON data here
    product_data = data;
}).catch(err => {
    // Do something for an error here
});

// Close autocomplete when click outside
//# TODO

// if user entered anymore data
inputBox.oninput = (e) => {
    let userData = e.target.value; //user entered data
    let emptyArray = [];
    userDatas = userData.split('-'); // list userData split
    if (userDatas.length > 1) {
        userData = userDatas[1];
        console.log(userData)
    }
    if (userData) {
        emptyArray = product_data.filter((data) => {
            //String Prototype : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
            return data.name.toLowerCase().includes(userData.toLowerCase());
            //return data.name == userData;
        });

        emptyArray = emptyArray.map((data) => {
            // passing return data inside li tag
            return data = `<li><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" > <img src="data:image/png;base64,${data.image}" style="width:60%;height:auto;" /> </div><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" value="${data.id}">${data.name}</div></li>`;

        });
        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {
        // searchWrapper.classList.remove("active"); //hide autocomplete box
        emptyArray = product_data.map((data) => {
            // passing return data inside li tag
            return data = `<li><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" > <img src="data:image/png;base64,${data.image}" style="width:60%;height:auto;" /> </div><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" value="${data.id}">${data.name}</div></li>`;

        });
        searchWrapper.classList.add("active");
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }
}

function select(element) {
    let all_li = element.querySelectorAll('div')
    product_id = "";
    for (let i = 0; i < all_li.length; i++) {
        if (all_li[i].getAttribute('value') == null) {
            continue;
        } else {
            product_id = all_li[i].getAttribute('value');
            break;
        }

    }
    let selectData = element.textContent;
    inputBox.value = product_id + "-" + selectData.trim();
    searchWrapper.classList.remove("active");
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        //        userValue = inputBox.value;
        //        listData = `<li> ${userValue}</li>`;
        searchWrapper.classList.remove("active");
    } else {
        listData = list.join('');

    }
    suggBox.innerHTML = listData;

}



//Step

var next_click = document.querySelectorAll(".next_button");
var main_form = document.querySelectorAll(".main");
var step_list = document.querySelectorAll(".progress-bar li");
var num = document.querySelector(".step-number");
let formnumber = 0;

next_click.forEach(function(next_click_form) {
    next_click_form.addEventListener('click', function() {
        if (!validateform()) {
            return false
        }
        formnumber++;
        updateform();
        progress_forward();
        contentchange();
    });
});

var back_click = document.querySelectorAll(".back_button");
back_click.forEach(function(back_click_form) {
    back_click_form.addEventListener('click', function() {
        formnumber--;
        updateform();
        progress_backward();
        contentchange();
    });
});

var username = document.querySelector("#user_name");
var shownname = document.querySelector(".shown_name");


var submit_click = document.querySelectorAll(".submit_button");
submit_click.forEach(function(submit_click_form) {
    submit_click_form.addEventListener('click', function() {
        shownname.innerHTML = username.value;
        formnumber++;
        updateform();
    });
});

var heart = document.querySelector(".fa-heart");
heart.addEventListener('click', function() {
    heart.classList.toggle('heart');
});


var share = document.querySelector(".fa-share-alt");
share.addEventListener('click', function() {
    share.classList.toggle('share');
});



function updateform() {
    main_form.forEach(function(mainform_number) {
        mainform_number.classList.remove('active');
    })
    main_form[formnumber].classList.add('active');
    if (formnumber==2){
         draw_photo=document.getElementById("top-photo-draw");
         draw_canvas=document.getElementById("top-canvas-draw");
         if (get_canvas_data){
         draw_canvas.width=canvas_w;
         draw_canvas.height=canvas_h;
         draw_photo.setAttribute("src", get_canvas_data);
         }
    }

}

function progress_forward() {
    // step_list.forEach(list => {

    //     list.classList.remove('active');

    // });


    num.innerHTML = formnumber + 1;
    step_list[formnumber].classList.add('active');
}

function progress_backward() {
    var form_num = formnumber + 1;
    step_list[form_num].classList.remove('active');
    num.innerHTML = form_num;
}

var step_num_content = document.querySelectorAll(".step-number-content");

function contentchange() {
    step_num_content.forEach(function(content) {
        content.classList.remove('active');
        content.classList.add('d-none');
    });
    step_num_content[formnumber].classList.add('active');
    step_num_content[formnumber].classList.remove('d-none');
}


function validateform() {
    validate = true;
    var validate_inputs = document.querySelectorAll(".main.active input");
    validate_inputs.forEach(function(vaildate_input) {
        vaildate_input.classList.remove('warning');
        if (vaildate_input.hasAttribute('require')) {
            if (vaildate_input.value.length == 0) {
                validate = false;
                vaildate_input.classList.add('warning');
            }
        }
    });
    return validate;

}