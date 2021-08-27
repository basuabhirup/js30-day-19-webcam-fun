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

    // Take the pixels out of the Canvas
    let pixels = ctx.getImageData(0, 0, width, height);

    // Mess with the Pixels
    // pixels = redEffect(pixels;)
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);

    // Put the pixels back to the canvas
    ctx.putImageData(pixels, 0, 0);

  }, 120);
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

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] += 100; //Red
    pixels.data[i + 1] -= 50; //Green
    pixels[i + 2] *= 0.5; //Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i - 550] = pixels.data[i + 0]; //Red
    pixels.data[i + 400] = pixels.data[i + 1]; //Green
    pixels[i - 650] = pixels.data[i + 2]; //Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  })

  for (let i = 0; i < pixels.data.length; i += 4) {
    let red = pixels.data[i + 0];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];

    if(red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin
      && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
        pixels.data[i + 3] = 0; // Make the pixel fully transparent (remove it)
      }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
