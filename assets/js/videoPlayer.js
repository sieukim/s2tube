const videoContainer = document.getElementById('jsVideoPlayer');
const videoPlayer = document.querySelector('#jsVideoPlayer video');
const playBtn = document.getElementById('jsPlayBtn');
const volumeBtn = document.getElementById('jsVolumeBtn');
const fullScreenBtn = document.getElementById('jsFullScreenBtn');
const currentTime = document.getElementById('jsCurrentTime');
const totalTime = document.getElementById('jsTotalTime');
const volumeRange = document.getElementById('jsVolumeRange');

const registerView = () => {
  const videoId = window.location.href.split('/videos/')[1];
  fetch(`/api/${videoId}/view`, {
    method: 'POST',
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function exitFullScreen() {
  fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScreenBtn.addEventListener('click', fullScreen);
  document.exitFullscreen();
}

function fullScreen() {
  videoContainer.requestFullscreen();
  fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenBtn.removeEventListener('click', fullScreen);
  fullScreenBtn.addEventListener('click', exitFullScreen);
}

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 100);
}

function handleEnded() {
  registerView();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
  const { value } = event.target;
  videoPlayer.volume = value;
  if (value >= 0.7) volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  else if (value >= 0.3)
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  else volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
}

function initVideoSize() {
  const vh = (v) => {
    const h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    return (v * h) / 100;
  };
  videoPlayer.addEventListener('loadedmetadata', () => {
    const videoContainerStyle = window.getComputedStyle(videoContainer);
    const videoHeight = +videoContainerStyle.height.replace('px', '');
    const videoWidth = +videoContainerStyle.width.replace('px', '');
    const ratio = videoWidth / videoHeight;
    const vh80 = vh(80);

    if (vh80 < videoHeight) {
      videoContainer.style.height = `${vh80}px`;
      videoContainer.style.width = `${vh80 * ratio}px`;
    }
  });
}

function init() {
  initVideoSize();
  videoPlayer.volume = 0.5;
  volumeBtn.addEventListener('click', handleVolumeClick);
  playBtn.addEventListener('click', handlePlayClick);
  fullScreenBtn.addEventListener('click', fullScreen);
  videoPlayer.addEventListener('loadedmetadata', setTotalTime);
  if (videoPlayer.readyState >= 1) setTotalTime();
  videoPlayer.addEventListener('ended', handleEnded);
  volumeRange.addEventListener('input', handleDrag);
}

if (videoContainer) {
  init();
}
