const createSongRow = function (songNumber, songName, songLength) {
  const template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + songLength + '</td>'
   + '</tr>';

  const $row = $(template);

  const handleSongClick = function() {
    const clickedSongNumber = $(this).attr('data-song-number');

    // 1. There is a song that is currently playing
    if (currentlyPlayingSongNumber !== null) {
      const currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');

      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
  
    // 2. There is a song currently playing, but a different one was clicked to play, OR there is not a song currently playing
    if (clickedSongNumber !== currentlyPlayingSongNumber) {
      currentlyPlayingSongNumber = clickedSongNumber;

      setSong(songNumber);

      currentSoundFile.play();

      $(this).html(pauseButtonTemplate);
  
    // 3. The currently playing song was clicked
    } else {
      if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
      } else {
        // currentlyPlayingSongNumber = null;
        $(this).html(playButtonTemplate);
        currentSoundFile.pause();
      }
    }
  };

  const onHover = function () {
    const songItem = $(this).find('.song-item-number');
    const songNumber = songItem.attr('data-song-number');

    if (songNumber !== currentlyPlayingSongNumber) {
      songItem.html(playButtonTemplate);
    }
  }

  const offHover = function () {
    const songItem = $(this).find('.song-item-number');
    const songNumber = songItem.attr('data-song-number');

    if (songNumber !== currentlyPlayingSongNumber) {
      songItem.html(songNumber);
    }
  }

  $row.find('.song-item-number').on('click', handleSongClick);
  $row.hover(onHover, offHover);

  return $row;
};

const setCurrentAlbum = album => {
  currentAlbum = album;

  const $albumTitle = $('.album-view-title');
  const $albumArtist = $('.album-view-artist');
  const $albumReleaseInfo = $('.album-view-release-info');
  const $albumImage = $('.album-cover-art');
  const $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (let i = 0; i < album.songs.length; i++) {
    const $songRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($songRow);
  }
};

const setSong = function (songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  const songUrl = currentAlbum.songs[currentlyPlayingSongNumber - 1].audioUrl;

  currentSoundFile = new buzz.sound(songUrl, {
    formats: [ 'mp3' ],
    preload: true,
  });
}

const pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
const playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
let currentlyPlayingSongNumber = null;
let currentAlbum = null;
let currentSoundFile = null;

setCurrentAlbum(albums[0]);