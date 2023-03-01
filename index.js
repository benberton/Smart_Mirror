const express = require('express');
const { OpenWeatherAPI } = require("openweather-api-node");
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');
require("dotenv").config();

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
// Portion for the Spotify API

// ************ CHANGE THE clientID and clientSecret values to your own************
// -------->  https://developer.spotify.com/dashboard/applications GO HERE <-----
// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '8a7db05a27494724906dbc7372bdd65f',
    clientSecret: 'd5b31c86cd344e488a6336dc9dc17f43',
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


app.put("/api/getCurrentSong", function(req,res) {
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

// ********* Portion for the Weather API ********
let API_KEY = "22f285771efbaa99078e550b6dd6a77d";

const forecast = function (latitude, longitude) { 
  
    var url = `http://api.openweathermap.org/data/2.5/weather?`
                +`lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      
        request({ url: url, json: true }, function (error, response) { 
            if (error) { 
                console.log('Unable to connect to Forecast API'); 
            } 
              else { 
      
                console.log('It is currently '
                    + ((response.body.main.temp - 273.15) * 9/5 + 32).toFixed(2)
                    + ' degrees out.'
                ); 
      
                console.log('The high today is '
                    + ((response.body.main.temp_max - 273.15) * 9/5 + 32).toFixed(2)
                    + ' with a low of '
                    + ((response.body.main.temp_min - 273.15) * 9/5 + 32).toFixed(2)
                ); 
      
                console.log('Humidity today is '
                    + response.body.main.humidity
                ); 
            } 
        }) 
    } 
      
    var latitude = 47.658779; // Indore latitude 
    var longitude = -117.426048; // Indore longitude 
      
    // Function call 
    forecast(latitude, longitude); 