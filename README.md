## README File
### Team Members: Jaylene, Ben, Mason, Jesse


### **Project Description:**    
  For our project, we will create a smart mirror that will display temperature, weather, and spotify album covers to the user. We drew inspiration from LuLuLemon's smart mirrors at their stores and also from the SmartMirror app. In addition, the mirror should turn on and off when a user passes in front or away from it. The rasberry pi 
  
### **Materials:**
To develop our project, we are using a raspberry pi, a motion senor, desktop monitor, and a one way mirror. We will download and install SenseHat and use this as a base for displaying images, sensor tracking, and etc.

### Description of Folders & Files:
- Images folder: contains images used in testing.
- javaScript folder: includes functions related to clock like a function to return the current hours.
- login_page folder: includes html page (user.html) and a js file (user.js) that allow the user of the mirror to sign into their spotify account.
- mirror_page folder:
  - mirror.html: the page that is displayed on the mirror. It shows the results from the Spotify API, News API, and Weather API.
  - mirror.js: holds functions and code that communicate with the backend and pulls API information.
  - mirror.css: the styling for the mirror.html page.
- index.js: the backend for the smart mirror. It communicates with the smart mirror html page and sends infromation that is displayed while communicating with APIs.

### How to Run & Test the Files:
1. Download Node js
2. Download Express
3. Download NewsAPI, Get API key from NewsAPI Webstie
4. Download OpenWeatherMap API, Get API key from NewsAPI Website
5. Download Spotify API, Get API key from Spotify Website
6. Enter "node ." in linux terminal
7. Go to "http://localhost:8888/user.html" to log into your spotify account
8. Go to "http://localhost:8888/mirror.html" to see the html page for the smart mirror

## Inspiration Code and Resources:
- Spotify API - https://github.com/tombaranowicz/SpotifyPlaylistExport