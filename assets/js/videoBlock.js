function thumbnailPlay(event) {
	event.target.play();
}

function thumbnailStop(event) {
	console.log(event)
	event.target.pause();
}

const videoBlocks = document.querySelectorAll('.videoBlock video');

if (videoBlocks) {
	for (let i = 0; i < videoBlocks.length; i++) {
		videoBlocks[i].addEventListener('mouseenter', thumbnailPlay);
		videoBlocks[i].addEventListener('mouseleave', thumbnailStop);
	}
}