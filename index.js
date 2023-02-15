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

const apiKey = "22f285771efbaa99078e550b6dd6a77d"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    // It will not fetch and display any data in the index page
    res.render("index", { weather: null, error: null });
  });

app.post('/', function(req, res) {
// Get city name passed in the form
let city = req.body.city;

// Use that city name to fetch data
// Use the API_KEY in the '.env' file
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

request(url, function(err, response, body) {

    // On return, check the json data fetched
    if (err) {
        res.render('index', { weather: null, error: 'Error, please try again' });
    } else {
        let weather = JSON.parse(body);
    }

    console.log(weather);

    if (weather.main == undefined) {
        res.render('index', { weather: null, error: 'Error, please try again' });
    } else {
        // we shall use the data got to set up your output
        let place = `${weather.name}, ${weather.sys.country}`,
        /* you shall calculate the current timezone using the data fetched*/
        weatherTimezone = `${new Date(
            weather.dt * 1000 - weather.timezone * 1000
        )}`;
        let weatherTemp = `${weather.main.temp}`,
        weatherPressure = `${weather.main.pressure}`,
        /* you will fetch the weather icon and its size using the icon data*/
        weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        weatherDescription = `${weather.weather[0].description}`,
        humidity = `${weather.main.humidity}`,
        clouds = `${weather.clouds.all}`,
        visibility = `${weather.visibility}`,
        main = `${weather.weather[0].main}`,
        weatherFahrenheit;
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        // you shall also round off the value of the degrees fahrenheit calculated into two decimal places
        function roundToTwo(num) {
          return +(Math.round(num + "e+2") + "e-2");
        }
        weatherFahrenheit = roundToTwo(weatherFahrenheit);
        res.render("index", {
            weather: weather,
            place: place,
            temp: weatherTemp,
            pressure: weatherPressure,
            icon: weatherIcon,
            description: weatherDescription,
            timezone: weatherTimezone,
            humidity: humidity,
            fahrenheit: weatherFahrenheit,
            clouds: clouds,
            visibility: visibility,
            main: main,
            error: null
            });
        }
    });
});

  app.listen(5000, function () {
    console.log("Weather app listening on port 5000!");
  });