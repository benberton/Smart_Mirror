const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQCnp_g1PcsYcy12cK6M5AUOJTPZ9IGQqcw9TtOrFWGSHdLia5OHvhvh8z2n0gj2nqWUDw6NEIkkhAyH7QIG7NY0_7hV2ux8sd5rXzLgaXJ6TDTzyWnUFz7HvD3mfYGxIXbYD5bgoPKzwR0HP1mnhbq41yqQkwWDQOIQrHb7t5UEAA-8khZv03geQ9Pq32crwmaaoSlehplYHRfQ0L6R46b3esfESOqYQJYf0oMsQZbjdNHjkfa3RcF-gVPxHHysLMRFMMq5-J8lgFPBzk3UXzhgPRdfwv4cEmCVZXvbpDunr53V6KXf5re7rlApmMyO-GQaqJxBBJ8";


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