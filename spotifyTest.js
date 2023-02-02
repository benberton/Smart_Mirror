const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "";


const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    const data = await spotifyApi.getMyCurrentPlayingTrack()
    console.log(data.body.item.artists)
    // getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}


getMyData();