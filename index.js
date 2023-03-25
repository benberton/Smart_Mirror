const express = require('express')
const fs = require('fs')
require('http').request

//run through port 8888
const port = 8888

const app = express()

app.use(express.static('public'))
//using json format
app.use(express.json());

//defining Spotify API object
var SpotifyWebApi = require('spotify-web-api-node');

// defines scopes define the type of data returned by the Spotify API
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


// credentials are optional, used by spotify 
var spotifyApi = new SpotifyWebApi({
    clientId: '8a7db05a27494724906dbc7372bdd65f',
    clientSecret: 'd5b31c86cd344e488a6336dc9dc17f43',
    redirectUri: 'http://localhost:8888/callback'
});
  
  
//redirects user to spotify login, then triggers the callback call (bellow)
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});
  

//is called once the user is logged in. It returns the access token 
// it refreshes once the 90 percent of the access token's time has been used up (usually only lasts 60 minutes)
app.get('/callback', (req, res) => {

    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    //getting access token and refresh token and setting it within the spotifyAPI object
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

// returns information about the current song the user is listening to
app.post("/api/getCurrentSong", function(req,res) {
    // using the Spotify API to get the current song
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


//credentials for news api
const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI('55da6f5670cf41eb8f4ba23ac03a1323');
const newsapi = new NewsAPI('a383db00532449a784029a7a4829665f');


//returns top news articles (usually around 50)
app.post("/api/getArticles", function(req,res) {
  newsapi.v2.topHeadlines({
        language: 'en',
        country: 'us',
        sortby: 'popularity',
    }).then(response => {
        let titles = []
        let articles = response.articles
        for (let i = 0; i < articles.length; ++i)
            titles.push(articles[i].title)
        res.send(JSON.stringify({"articles": titles}))
    });
})


app.listen(port,function(error) {
    if (error)
        console.log("Error: " + error)
    else
        console.log("Server started on port " + port)
})

// ***************** Weather API *****************
var request = require ('request');
const API_KEY = "22f285771efbaa99078e550b6dd6a77d";

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/mirror.html');
});
// establishes connection to weather api
app.post('/weather', function(req, res) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=Spokane&appid=${API_KEY}&units=metric`;

  request(url, function (err, response, body) {
    if (err) {
      res.status(500).send('Error fetching weather data');
    } else {
      const weatherData = JSON.parse(body);
        // Gets the JSON response from the api and sends it to the front end
      res.json({
        temperature: weatherData.main.temp,
        high: weatherData.main.temp_max,
        low: weatherData.main.temp_min,
        icon: weatherData.weather[0].icon
      });
    }
  });
});
