const express = require('express')
const fs = require('fs')

const port = 8888

const app = express()

app.use(express.static('public'))
//using json format
app.use(express.json());

var SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];


// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '28cafb8e6ad643abb3c590097c498b8d',
    clientSecret: 'fc7c371dc50241b49afea980c72d5aaa',
    redirectUri: 'http://localhost:8888/callback'
});
  
  
//redirects user to spotify login, then triggers the callback call (bellow)
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});
  

//is called once the user is logged in. It returns the access token and refreshes to make sure a valid token is in use
app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];
    console.log("acces token granted")
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    //refreshes the access token once 90% of its time has been used
    setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        // console.log('The access token has been refreshed!');
        // console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
    }, expires_in * .9);
    })
    .catch(error => {
    console.error('Error getting Tokens:', error);
    res.send(`Error getting Tokens: ${error}`);
    });
});


app.post("/api/getCurrentSong", function(req,res) {
    spotifyApi.getMyCurrentPlayingTrack().then(e => {
        let song = e.body.item.name
        let album = e.body.item.album.name
        let image = e.body.item.album.images[0].url
        let artists = []
        for (let i = 0; i < e.body.item.artists.length; ++i)
            artists.push(e.body.item.artists[i].name)
        
        res.send(JSON.stringify({"song": song, "album": album,"artists": artists, "image": image}))
        res.end()
      }
    )
})

app.listen(port,function(error) {
    if (error)
        console.log("Error: " + error)
    else
        console.log("Server started on port " + port)
})




// //basic api call example
// app.post("/api/getTime", function(req,res) {
//     console.log(req.data)
//     res.send(JSON.stringify({"time": Date().toISOString()}))
//     res.end()
// })