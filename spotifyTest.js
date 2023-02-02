const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQBVqlt51cF5QN0CsXq1vNzAuyIhb8QTI1O-MDnn5xadTCtoueuZUp3Tj_24WZzZAdpMXyvvP4ZhTIypDRYa8XMPk3fC5cJOEOxlZhW9gsvvaKN8BOiWHogt9thsrhUboIse3wyx95Soz591qJy4-ARRgMTi02iQgJH7wDFNpzmjRfzBj8xLxEM4RP3J7zdz9lyMrCesW5JOwp4HPuoVNUNFBekfisvpezRJK7p2njaNHlBIdaLGel03lQK4WkeDmCt_9iHwfJcvE1KuSHzPMOy6dpbEtF0jBTTtmt2dhnAvdYMmOOGlV2KeX5lL4pVmdSADUu3C1tE";



const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    const data = await spotifyApi.getMyCurrentPlayingTrack()
    console.log(data.body.items)
    // getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []
    
  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    // fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();