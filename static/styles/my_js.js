const show_image_layout = document.getElementById("show_image");
const image_from_file = document.getElementById("image_from_file");
const image_from_camera = document.getElementById("image_from_camera");

const photo = document.getElementById("photo");
const canvas = document.getElementById("canvas");
const video = document.getElementById("cam");

const old_product_input_layout = document.getElementById("old-product-input");
const new_product_input_layout = document.getElementById("new-product-input");

const option_1_rad = document.getElementById("option-1");
const option_2_rad = document.getElementById("option-2");

const control_layout = document.getElementById("control_layout");
const control_camera = document.getElementById("control_camera");
const control_file = document.getElementById("control_file");

show_image_layout.style.display = "none";
photo.style.display = "none";
old_product_input_layout.style.display = 'none';

option_1_rad.checked = true;

let product_design_data = null;
let product_data = null;

let canvas_w = null;
let canvas_h = null;

let original_image = null;

//Init None Image data
const none_image = "data:image/jpeg;base64,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"

//Init submit dictionary --> send to server
let submit_dict = {
    'camera': null,
    'product_type': 'new',
    'class_id': null,
    'class_id_src': null,
    'design_id': null,
    'design_id_src': null,
    'image_src': null,
    'feature_im': null,
    'feature_position': null,
    'rejection_im': null
}

let input_element = document.querySelector("input");

input_element.addEventListener("keyup", () => {
    input_element.setAttribute("value", input_element.value);
})

// Read product name from server

let top_data = null;
let side_data = null;

function readTextFile() {

    //Get top data
    $.ajax({
        url: "./static/resource/top.txt",
        async: false, // asynchronous request? (synchronous requests are discouraged...)
        cache: false, // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text", // jQuery will infer this, but you can set explicitly
        success: function(data) {
            top_data = data.split(/\r?\n/).length;
        }
    });

    //Get side data
    $.ajax({
        url: "./static/resource/side.txt",
        async: false, // asynchronous request? (synchronous requests are discouraged...)
        cache: false, // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text", // jQuery will infer this, but you can set explicitly
        success: function(data) {
            side_data = data.split(/\r?\n/).length;
        }
    });
}

readTextFile();
//Clear modal
function clear() {
    show_image_layout.style.display = "none";
    photo.style.display = "none";
    canvas.classList.remove('z-index-2');
}

//specify camera
$('#btn_top_modal').on('click', function(event) {
    submit_dict.camera = 'top';

    //Set new class id
    document.getElementById("new_class_id").value = top_data;
    submit_dict.class_id = top_data;
    submit_dict.design_id = 0;
});
$('#btn_side_modal').on('click', function(event) {
    submit_dict.camera = 'side';

    //Set new class id
    document.getElementById("new_class_id").value = side_data;
    submit_dict.class_id = side_data;
    submit_dict.design_id = 0;
});

//Set camera id of top or side
document.getElementById('init_camera').onclick = (event) => {
    if (!submit_dict.camera) {
        alert("Camera is not found")
    } else if (submit_dict.camera == 'top') {
        getPhotoFromCamera('ec0f33c7b87862c1c21b37238a5724ddc15d982ab3bc38c742e3318a959e16ef');
    } else if (submit_dict.camera == 'side')
        getPhotoFromCamera('deedc2c4b18a65ee1306b94207fb59d1a184194babbe4ad6679606f9818cd568');
}

//clear photo
function clear_photo() {
    let context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

//Read image from client
function readURL(input) {
    //Close the current handle
    clear_photo();
    clear();
    close_media_stream();

    //Show image layout
    show_image_layout.style.display = "flex";

    //Hide image from camera layout
    control_camera.classList.add("d-none");
    control_file.classList.remove("d-none");
    image_from_camera.style.display = "none";

    //Show image from file layout
    image_from_file.style.display = "flex";

    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(".file-upload-image").attr('src', e.target.result);
            $(".file-upload-content").css('display', 'flex');
            $(".image-title").html(input.files[0].name);

            //Add image data to submit dictionary
            original_image = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        remove_upload();
    }
}

// Hide loading modal
$(window).on('load', function() {
    $('#loading').hide();
})

function remove_upload() {
    $(".file-upload-input").replaceWith($(".file-upload-input").val('').clone(true));
    $(".file-upload-content").hide();
    $(".image-upload-wrap").show();

    // Delete image data from submit dictionary
    submit_dict.image_src = null;
}

$('.image-upload-wrap').bind('dragover', function() {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function() {
    $('.image-upload-wrap').removeClass('image-dropping');
});


$(document).ready(function() {
    $('.register-modal').click(function() {
        $('#confirm_modal').modal('show');
    });
    $('.confirm-modal').click(function() {
        $('#confirm_modal').modal('hide');
        $('#register-product-modal').modal('hide');
    });
});

//Init media_stream
var media_stream = null;

//Init Constraints
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

async function get_media_stream(constraints) {
    try {
        media_stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = media_stream;
        const track = media_stream.getVideoTracks()[0];
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
                advanced: [{
                    focusMode: "manual",
                    focusDistance: event.target.value
                }]
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

async function getPhotoFromCamera(device_id) {
    try {
        // Close current handle
        remove_upload();
        clear_photo();

        // Hide
        control_file.classList.add("d-none");
        control_camera.classList.remove("d-none");

        // stop the current video stream
        if (media_stream != null && media_stream.active) {
            var tracks = media_stream.getVideoTracks();
            tracks.forEach(track => {
                track.stop();
            });
        }
        show_image_layout.style.display = "flex";

        image_from_file.style.display = "none";
        image_from_camera.style.display = "flex";

        // Set Camera device id
        constraints.video.deviceId = device_id;

        // Set the video source to null
        video.srcObject = null;

        // Get new media stream
        await get_media_stream(constraints);
    } catch (err) {
        console.error(err.message);
        alert(err.message);
    }
}


const loading = document.getElementById("loading");
const cut_image_src = document.getElementById("remove_bg_photo");
const rejection_image_src = document.getElementById("rejection_photo");
const rejection_cb = document.getElementById("rejection_cb");

// Take photo from camera event
document.getElementById('take-photo').onclick = (event) => {
    take_photo();
    event.preventDefault();
}

//Process photo from client photo
document.getElementById('photo_process').onclick = (event) => {
    process_image();
}

//Process image from client file
function process_image() {
    loading.style.display = "flex";
    $.ajax({
        url: "/remove_bg",
        type: "POST",
        data: {
            base64_data: original_image
        },
        success: function(response) {

            if (rejection_cb.checked) {
                rejection_image_src.setAttribute("src", response);
                submit_dict.rejection_im = response;
            } else if (!rejection_cb.checked) {

                // Set canvas size
                var image = new Image();
                image.src = response;
                image.onload = function() {
                    canvas_h = this.height;
                    canvas_w = this.width;
                }
                cut_image_src.setAttribute("src", response);

                //Set image base64 resource to submit dictionary
                submit_dict.image_src = response;
            }
            //Hide loading
            $('#loading').hide();
        },
        error: function(xhr) {
            //TODO show alert
            $('#loading').hide();
        }
    });
}

// Take photo from camera
function take_photo() {
    let context = canvas.getContext('2d');

    if (video.videoHeight && video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const data = canvas.toDataURL("image/png");

        photo.setAttribute("src", data);

        video.style.zIndex = "";
        photo.style.zIndex = "1";

        photo.style.display = "flex";
        loading.style.display = "flex";
        // Remove background data
        $.ajax({
            url: "/remove_bg",
            type: "POST",
            data: {
                base64_data: data
            },
            success: function(response) {

                if (rejection_cb.checked) {
                    rejection_image_src.setAttribute("src", response);
                    submit_dict.rejection_im = response;
                } else if (!rejection_cb.checked) {

                    var newImg = new Image();
                    newImg.src = response;
                    newImg.onload = function() {
                        canvas_h = newImg.height;
                        canvas_w = newImg.width;
                    }
                    cut_image_src.setAttribute("src", response);
                    submit_dict.image_src = response;
                }
                //Hide loading
                $('#loading').hide();
            },
            error: function(xhr) {
                //TODO show alert
                $('#loading').hide();
            }
        });

    } else {
        clear_photo();
    }
}

function re_play() {
    clear_photo();
    video.style.zIndex = "1";
    photo.style.zIndex = "";


}

function close_media_stream() {
    if (media_stream != null && media_stream.active) {
        var tracks = media_stream.getVideoTracks();
        tracks.forEach(track => {
            track.stop();
        });
    }
}

//Close current handle
function close_and_clear() {
    close_media_stream();
    remove_upload();
    clear_photo();
    clear();

}

//Register product button event
$('#btn_register').on('click', function() {
    $.ajax({
        url: "/add_product",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            submit_dict
        }),
        success: function(response) {
            //TODO do something
        },
        error: function(xhr) {
            //TODO show alert
        },
    });

})
option_1_rad.onclick = function() {
    //Show new product input layout
    new_product_input_layout.style.display = 'block';
    option_1_rad.checked = true;

    //Hide old product input layout
    old_product_input_layout.style.display = 'none';
    option_2_rad.checked = false;

    //Add product type to submit dictionary
    submit_dict.product_type = 'new';
};

option_2_rad.onclick = function() {
    //Hide new product input layout
    new_product_input_layout.style.display = 'none';
    option_1_rad.checked = false;

    //Show old product input layout
    old_product_input_layout.style.display = 'block';
    option_2_rad.checked = true;

    //Add product type to submit dictionary
    submit_dict.product_type = 'old';
};

//Load json
fetch('static/resource/json/data.json').then(response => {
    return response.json();
}).then(data => {
    product_data = data;
}).catch(err => {
    // TODO do something
});

//let wrap_data=null;
//fetch('static/resource/json/wrap_image_data.json').then(response => {
//    return response.json();
//}).then(data => {
//    wrap_data = data;
//    wrap_arr = wrap_data.map((data) => {
//            return data = `<div><img src="data:image/png;base64,${data.wrap_src}"></div>`;});
//    wrap=wrap_arr.join('');
//   $('.ads_sponsors').html(wrap);
//}).catch(err => {
//    // TODO do something
//});


// Search CLASS ID
const search_input_for_class_id = document.getElementById("search_input_for_class_id");
const existed_class_id_input = document.getElementById("existed_class_id");
const autocom_for_class_id = document.getElementById("autocom_for_class_id");
const class_image = document.getElementById("class_image");

existed_class_id_input.oninput = (e) => {
    var validate_inputs = document.querySelectorAll(".main.active input");
    validate_inputs.forEach(function(validate_input) {
        validate_input.classList.remove('warning');
    });

    let userData = e.target.value; //user entered data
    let emptyArray = [];
    if (userData) {
        emptyArray = product_data.filter((data) => {
            //String Prototype : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
            return data.name.toLowerCase().includes(userData.toLowerCase());
        });

        emptyArray = emptyArray.map((data) => {
            let image_data = "";

            //Get image resource
            if (data.design.length > 0) {
                for (let i = 0; i < data.design.length; i++) {
                    if (data.design[i].is_base) {
                        image_data = data.design[i].image_base64;
                        break;
                    }
                }
            }
            // passing return data inside li tag
            return data = `<li><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" > <img src="data:image/png;base64,${image_data}" style="width:60%;height:auto;" /> </div><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" value="${data.id}">${data.name}</div></li>`;

        });
    } else {
        emptyArray = product_data.map((data) => {
            let image_data = "";
            if (data.design.length > 0) {
                for (let i = 0; i < data.design.length; i++) {
                    if (data.design[i].is_base) {
                        image_data = data.design[i].image_base64;
                        break;
                    }
                }
            }
            // passing return data inside li tag
            return data = `<li><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" > <img src="data:image/png;base64,${image_data}" style="width:60%;height:auto;" /> </div><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" value="${data.id}">${data.name}</div></li>`;

        });
    }
    //Show autocomplete box
    search_input_for_class_id.classList.add("active");

    //Show suggestions
    showSuggestions(emptyArray, search_input_for_class_id, autocom_for_class_id);

    let allList = autocom_for_class_id.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
        //adding onclick attribute in all li tag
        allList[i].setAttribute("onclick", "select_for_class_id(this)");
    }
}


const search_input_for_design_id = document.getElementById("search_input_for_design_id");
const existed_design_id_input = document.getElementById("existed_design_id");
const autocom_for_design_id = document.getElementById("autocom_for_design_id");
const design_image = document.getElementById("design_image");

existed_design_id_input.oninput = (e) => {
    var validate_inputs = document.querySelectorAll(".main.active input");
    validate_inputs.forEach(function(validate_input) {
        validate_input.classList.remove('warning');
    });

    let userData = e.target.value; //user entered data
    let emptyArray = [];
    if (userData) {
        emptyArray = product_design_data.filter((data) => {
            return data.design_name.toLowerCase().includes(userData.toLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
            // passing return data inside li tag
            return data = `<li><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" > <img src="data:image/png;base64,${data.image_base64}" style="width:60%;height:auto;" /> </div><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" value="${data.design_id}">${data.design_name}</div></li>`;

        });
    } else {

        emptyArray = product_design_data.map((data) => {
            // passing return data inside li tag
            return data = `<li><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" > <img src="data:image/png;base64,${data.image_base64}" style="width:60%;height:auto;" /> </div><div class="row d-flex justify-content-center align-items-center" style="padding:0 !important;margin:0 !important;" value="${data.design_id}">${data.design_name}</div></li>`;
        });

    }
    //show autocomplete box
    search_input_for_design_id.classList.add("active");

    showSuggestions(emptyArray, search_input_for_design_id, autocom_for_design_id);
    let allList = autocom_for_design_id.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
        //adding onclick attribute in all li tag
        allList[i].setAttribute("onclick", "select_for_design_id(this)");
    }

}

function select_for_class_id(element) {
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
    existed_class_id_input.value = selectData.trim();
    submit_dict.class_id = product_id;
    search_input_for_class_id.classList.remove("active");
    let image_src = element.querySelector('img');
    class_image.setAttribute("src", image_src.src);
    submit_dict.class_id_src = image_src.src;
    document.getElementById('class_image_layout').classList.remove('d-none');
    product_design_data = product_data.filter((data) => {
        return data.id == product_id;
    });
    product_design_data = product_design_data.reduce((design, data) => {
        data.design.map((ds) => {
            design.push({
                'class_id': data.id,
                'name': data.name,
                'design_id': ds.design_id,
                'is_base': ds.is_base,
                'current': ds.current,
                'image_base64': ds.image_base64,
                'design_name': `${data.name} (design ${ds.design_id})`,
            });
        });
        return design;
    }, []);
    existed_design_id_input.readOnly = false;


}

function select_for_design_id(element) {
    let all_li = element.querySelectorAll('div')
    design_id = "";
    for (let i = 0; i < all_li.length; i++) {
        if (all_li[i].getAttribute('value') == null) {
            continue;
        } else {
            design_id = all_li[i].getAttribute('value');
            break;
        }

    }
    let selectData = element.textContent;
    existed_design_id_input.value = design_id;
    submit_dict.design_id = design_id;

    search_input_for_design_id.classList.remove("active");
    let image_src = element.querySelector('img');
    design_image.setAttribute("src", image_src.src);
    submit_dict.design_id_src = image_src.src;
    document.getElementById('design_image_layout').classList.remove('d-none');
}

function showSuggestions(list, search_input, autocom) {
    let listData;
    if (!list.length) {
        //        userValue = existed_class_id_input.value;
        //        listData = `<li> ${userValue}</li>`;
        search_input.classList.remove("active");
    } else {
        listData = list.join('');

    }
    autocom.innerHTML = listData;

}

document.addEventListener('click', function handleClickOutsideBox(event) {

    if (!search_input_for_design_id.contains(event.target)) {
        search_input_for_design_id.classList.remove("active");
    }
    if (!search_input_for_class_id.contains(event.target)) {
        search_input_for_class_id.classList.remove("active");
    }

});

//Step

var next_click = document.querySelectorAll(".next_button");
var main_form = document.querySelectorAll(".main");
var step_list = document.querySelectorAll(".progress-bar li");
var num = document.querySelector(".step-number");
let form_num = 0;

next_click.forEach(function(next_click_form) {
    next_click_form.addEventListener('click', function() {
        if (!validate_form()) {
            return false
        }

        if (form_num == 1) {
            if (!submit_dict.image_src) {
                alert("no");
                return false
            }
        }
        form_num++;
        update_form();
        progress_forward();
        content_change();
    });
});

var back_click = document.querySelectorAll(".back_button");
back_click.forEach(function(back_click_form) {
    back_click_form.addEventListener('click', function() {
        form_num--;
        update_form();
        progress_backward();
        content_change();
    });
});



var submit_click = document.querySelectorAll(".submit_button");
submit_click.forEach(function(submit_click_form) {
    submit_click_form.addEventListener('click', function() {
        form_num++;
        update_form();
    });
});


function update_form() {
    main_form.forEach(function(main_form_number) {
        main_form_number.classList.remove('active');
    })
    main_form[form_num].classList.add('active');
    if (form_num == 2) {
        draw_photo = document.getElementById("photo-draw");
        draw_canvas = document.getElementById("canvas-draw");
        const modal = document.getElementById("smallModal");
        let denied_button = document.getElementById("denied_button");
        let accepted_button = document.getElementById("accepted_button");
        if (submit_dict.image_src) {
            draw_canvas.width = canvas_w;
            draw_canvas.height = canvas_h;
            draw_photo.setAttribute("src", submit_dict.image_src);

            let draw_context = draw_canvas.getContext('2d');
            draw_canvas.style.display = 'block';
            draw_canvas.style.zIndex = "2";

            let is_accepted = false;

            let isDrawStart = false;
            let rect = draw_canvas.getBoundingClientRect();
            let scaleX = draw_canvas.width / rect.width; // relationship bitmap vs. element for x
            let scaleY = draw_canvas.height / rect.height; // relationship bitmap vs. element for y

            let startPosition = {
                x: 0,
                y: 0
            };
            let endPosition = {
                x: 0,
                y: 0
            };

            const getClientOffset = (event) => {
                const {
                    pageX,
                    pageY
                } = event.touches ? event.touches[0] : event;

                const x = (pageX - rect.left) * scaleX;
                const y = (pageY - rect.top) * scaleY;

                return {
                    x,
                    y
                }
            }

            const drawRectangle = (width, height, R = 243, G = 1, B = 1, A = 0.3) => {
                draw_context.beginPath();
                draw_context.strokeStyle = `rgb(${R},${G},${B})`
                draw_context.lineWidth = 4; // increase the border width
                draw_context.fillStyle = `rgba(${R},${G},${B},${A})`; // add background color to shape
                draw_context.roundRect(startPosition.x, startPosition.y, width, height, 10);
                //draw_context.rect(startPosition.x, startPosition.y, width, height); // configure rectangle coordinates, width and height
                draw_context.stroke(); // drawing of bordered rectangle
                draw_context.fill(); // drawing of background in rectangle
            }

            const clearCanvas = () => {
                draw_context.clearRect(0, 0, draw_canvas.width, draw_canvas.height);
            }

            const mouseDownListener = (event) => {
                if (!is_accepted) {
                    modal.style.display = "none";
                    modal.style.zIndex = "";
                    startPosition = getClientOffset(event);
                    isDrawStart = true;
                    event.preventDefault();
                }


            }

            const mouseMoveListener = (event) => {
                if (!is_accepted) {
                    if (!isDrawStart) return;

                    endPosition = getClientOffset(event);
                    const width = endPosition.x - startPosition.x;
                    const height = endPosition.y - startPosition.y;
                    clearCanvas();
                    drawRectangle(width, height);
                    event.preventDefault();
                }

            }

            const mouseUpListener = (event) => {
                if (!is_accepted) {
                    isDrawStart = false;
                    console.log(`${startPosition.x} ${startPosition.y} ${endPosition.x} ${endPosition.y}`);
                    if (endPosition.x > 0) {
                        modal.style.display = "block";
                        modal.style.left = endPosition.x / scaleX + 'px';
                        modal.style.top = endPosition.y / scaleY + 'px';
                        modal.style.zIndex = "3";
                    }
                    event.preventDefault();
                }

            }
            const mouseLeaveListener = (event) => {
                //                isDrawStart = false;
                //                 console.log("is leave");

            }
            const denied = (event) => {
                modal.style.display = "none";
                modal.style.zIndex = "";
            }
            const accepted = (event) => {
                modal.style.display = "none";
                modal.style.zIndex = "";
                clearCanvas();
                drawRectangle(endPosition.x - startPosition.x, endPosition.y - startPosition.y, R = 80, G = 200, B = 120);
                let data_js = {
                    'removed_im_data': submit_dict.image_src,
                    'boxes': [startPosition.x, startPosition.y, endPosition.x, endPosition.y],
                };
                submit_dict.feature_position = [startPosition.x, startPosition.y, endPosition.x, endPosition.y];

                //Send to server to get crop feature
                $.ajax({
                    url: "/get_feature_image",
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        data_js
                    }),
                    success: function(response) {
                        if (response) {
                            submit_dict.feature_im = response;
                            is_accepted = true;
                        }
                        console.log("get feature failed by server")
                    },
                    error: function(xhr) {
                        console.log("fail");
                    },
                });
            }

            draw_canvas.addEventListener('mousedown', mouseDownListener);
            draw_canvas.addEventListener('mousemove', mouseMoveListener);
            draw_canvas.addEventListener('mouseup', mouseUpListener);
            draw_canvas.addEventListener('mouseleave', mouseLeaveListener);

            draw_canvas.addEventListener('touchstart', mouseDownListener);
            draw_canvas.addEventListener('touchmove', mouseMoveListener);
            draw_canvas.addEventListener('touchend', mouseUpListener);

            denied_button.addEventListener('click', denied);
            accepted_button.addEventListener('click', accepted);
        } else {
            draw_photo.setAttribute("src", none_image);
        }
    }
    if (form_num == 3) {
        $('#prev_class_id').html(submit_dict.class_id);
        $('#prev_design_id').html(submit_dict.design_id);
        $('#prev_image_src').attr("src", submit_dict.image_src || none_image);
        $('#prev_feature_image_src').attr("src", submit_dict.feature_im || none_image);
        $('#prev_injection_image_src').attr("src", submit_dict.rejection_im || none_image);
    }
}

function progress_forward() {
    // step_list.forEach(list => {

    //     list.classList.remove('active');

    // });


    num.innerHTML = form_num + 1;
    step_list[form_num].classList.add('active');
}

function progress_backward() {
    var f_num = form_num + 1;
    step_list[f_num].classList.remove('active');
    num.innerHTML = f_num;
}

var step_num_content = document.querySelectorAll(".step-number-content");

function content_change() {
    step_num_content.forEach(function(content) {
        content.classList.remove('active');
        content.classList.add('d-none');
    });
    step_num_content[form_num].classList.add('active');
    step_num_content[form_num].classList.remove('d-none');
}


function validate_form() {
    validate = true;
    var validate_inputs = document.querySelectorAll(".main.active input");
    validate_inputs.forEach(function(validate_input) {
        validate_input.classList.remove('warning');

        if (validate_input.hasAttribute('require')) {
            if (validate_input.value.length == 0 && option_2_rad.checked) {
                validate = false;
                validate_input.classList.add('warning');
            }
        }
    });
    return validate;

}

var slider = document.getElementById("slider");
var output = document.getElementById("focus");

slider.onchange = function() {
    output.innerHTML = this.value;
}
var wrap_image = document.querySelectorAll(".wrap-image");
var list_wrap = [];

function select_wrap(element) {
    let img_tag = element.querySelectorAll("img")
    let a = img_tag[0].getAttribute('src');
    wrap_image[0].src = a;
    let wrap_title = element.textContent;
    if (!list_wrap.includes(wrap_title)) {
        $("#list-wrap").prepend(`<li>${wrap_title}</li>`);
        list_wrap.push(wrap_title);
    }
    // TODO shaking

}
$('.ads_sponsors').slick({
    infinite: true,
    variableWidth: true,
    dots: true,
    cssEase: 'linear',
    useTransform: true,
    //    autoplay: true,
    //    autoplaySpeed: 1000,
    arrows: true,
    //centerMode: true,
    //speed: 500,
    //slidesToShow: 4,
    //slidesToScroll: 4,
});