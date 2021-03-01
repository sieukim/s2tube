import ysFixWebmDuration from 'fix-webm-duration';

const recorderContainer = document.getElementById('jsRecordContainer');
const recordBtn = document.getElementById('jsRecordBtn');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;
let startTime;

const handleVideoData = async (event) => {
  const { data: videoFile } = event;
  const duration = Date.now() - startTime;
  const fixedVideoFile = await new Promise((resolve) =>
    ysFixWebmDuration(videoFile, duration, resolve)
  );
  const link = document.createElement('a');

  link.href = URL.createObjectURL(fixedVideoFile);
  link.download = 'recorded.webm';
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener('click', stopRecording);
  recordBtn.addEventListener('click', getVideo);
  recordBtn.innerHTML = 'Start recording';
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  startTime = Date.now();
  videoRecorder.addEventListener('dataavailable', handleVideoData);
  recordBtn.addEventListener('click', stopRecording);
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = 'Stop recording';
    streamObject = stream;
    startRecording();
  } catch (error) {
    console.error(error);
    recordBtn.innerHTML = 'cannot record';
  } finally {
    recordBtn.removeEventListener('click', getVideo);
  }
};

function init() {
  recordBtn.addEventListener('click', getVideo);
}

if (recorderContainer) {
  init();
}
