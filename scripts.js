const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Get video from user's webcam
function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(localMediaStream => {
    console.log(localMediaStream);
    video.srcObject = localMediaStream;
    video.play();
  })
    .catch(err => {
      console.log("ERROR !", err);
  })
}

// Render video to the canvas
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  console.log(width, height);

  return setInterval(() => {
    ctx.drawImage(video, 0 , 0, width, height);
  }, 100)
}

// Take snapshot from the video
function takePhoto() {
  // Play shutter sound
  snap.currentTime = 0;
  snap.play();

  //Take data out of the paintToCanvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src=${data} alt="Handsome Boy">`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
