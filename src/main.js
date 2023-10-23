const playPauseButton = document.querySelector('[name="play-pause"]');
const volumeControl = document.querySelector('[name="volume"]');
const currentlyPlaying = document.querySelector('.currently-playing-title');
const volumeButton = document.querySelector('[name="mute"]');
const volumeButtonIcon = volumeButton.querySelector('i');
const albumCoverElement = document.querySelector('#album-cover')

let isPlaying = false;
let currentVolume = 1;

const animation = lottie.loadAnimation({
  container: playPauseButton,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Demo Animation",
});
animation.goToAndStop(14, true);
setupLastfm();
const player = new IcecastMetadataPlayer("https://corsproxy.io/?https%3A%2F%2Fice64.securenetsystems.net%2FWTTS", {
  onMetadata: async (metadata) => {
    console.log(`"${metadata.StreamTitle}"`) 
    currentlyPlaying.innerText = metadata.StreamTitle;
    const [artist, album] = metadata.StreamTitle.split(" - ");
    let albumCover = await getAlbumCover(album, artist);
    albumCoverElement.setAttribute("src", albumCover)
    console.log(albumCover);
  },
  metadataTypes: ["icy"]
})
playPauseButton.addEventListener('click', () => {
  if (isPlaying) {
    animation.playSegments([0, 14], true);
    player.stop();
  } else {
    animation.playSegments([14, 27], true)
    player.play();
  }
  isPlaying = !isPlaying;
})
async function getAlbumCover(song, artist = "") {
  let response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=471768afa0e8702597d45964b3035b55&artist=${artist}&track=${song}&format=json`)
  let data = await response.json();
  if (data.error == 6) {
    return "https://pbs.twimg.com/profile_images/900115872567631872/a2TttW0m_400x400.jpg";
  }
  response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=471768afa0e8702597d45964b3035b55&artist=${artist}&album=${data.track.album.title}&format=json`)
  data = await response.json();
  return (data.album.image[4])["#text"];
}
async function setupLastfm() {
  let response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=auth.gettoken&api_key=471768afa0e8702597d45964b3035b55&format=json`);
  let data = await response.json();
  if (window.localStorage.getItem("last.fm") == null) {
    window.open('https://www.last.fm/api/auth/?api_key=471768afa0e8702597d45964b3035b55&token=' + data.token, '_blank', )
    window.localStorage.setItem("last.fm", data.token)
  }
  let apisig = md5(`api_key471768afa0e8702597d45964b3035b55methodauth.getSessiontoken${data.token}d13f3e935acd7834438c97523db81caa`)
  response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=auth.getsession&api_key=471768afa0e8702597d45964b3035b55&token=${data.token}&format=json`);
  data = await response.json();
  console.log(data.token);
}

async function handleAuth() {

}