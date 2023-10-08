const audio = document.querySelector('#stream');
const playPauseButton = document.querySelector('[name="play-pause"]');
const playPauseButtonIcon = playPauseButton.querySelector('i');
const volumeControl = document.querySelector('[name="volume"]');
const currentlyPlaying = document.querySelector('.currently-playing-title');
const volumeButton = document.querySelector('[name="mute"]');
const volumeButtonIcon = volumeButton.querySelector('i');

let isPlaying = false;
let fetchInterval = null;
let currentVolume = 1;

audio.volume = currentVolume;

async function getNowPlaying() {
  console.log("getting now playing");
  let request = await fetch('https://ice64.securenetsystems.net/WTTS', {
		headers: {
			"Icy-Metadata": "1"
		},
    mode: 'no-cors'
	});
  console.log("recieved response")
}

playPauseButton.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    playPauseButtonIcon.classList.remove('fa-pause');
    playPauseButtonIcon.classList.add('fa-play');
    clearInterval(fetchInterval);
  } else {
    audio.play();
    playPauseButtonIcon.classList.remove('fa-play');
    playPauseButtonIcon.classList.add('fa-pause');
    fetchInterval = setInterval(getNowPlaying, 5 * 1000); //every 5 seconds
  }
  isPlaying = !isPlaying;
})