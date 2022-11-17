function readURL(input) {
  if (input.files && input.files[0]) {

    let reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
		$('.image-upload-wrap').addClass('image-dropping');
	});
	$('.image-upload-wrap').bind('dragleave', function () {
		$('.image-upload-wrap').removeClass('image-dropping');
});
function loadCamera(){
    let socket = io.connect(window.location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', function(){
        console.log("Connected...!", socket.connected)
    });


    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    const video = document.querySelector("#videoElement");

    video.width = 400;
    video.height = 300;


    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err0r) {

        });
    }

    const FPS = 6;
    setInterval(() => {
        width=video.width;
        height=video.height;
        context.drawImage(video, 0, 0, width , height );
        let data = canvas.toDataURL('image/jpeg', 0.5);
        context.clearRect(0, 0, width,height );
        socket.emit('image', data);
    }, 1000/FPS);

    socket.on('response_back', function(image){
            photo.setAttribute('src', image );

    });

}
function myfunction(){
   $('.collapse').collapse('show');
}
function myfunction2(){
  $('.collapse').collapse('hide');
}

