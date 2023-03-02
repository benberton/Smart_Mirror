document.addEventListener("DOMContentLoaded", ()=>{
    //sets the clock every 300ms
    setInterval(function(){
        const date = new Date()
        document.getElementById("time").innerHTML = getTimeString(date)
        //uncomment to add seconds
        // document.getElementById("seconds").innerHTML = getSeconds(date)
        document.getElementById("time_of_day").innerHTML = getTimeOfDay(date)
    }, 300);


    // let imageNum = 0;
    // //rotates between images
    // setInterval(function(){
    //     let container = document.getElementById("image_container")
    //     container.removeChild(container.lastElementChild)
    //     let image = document.createElement("img")
    //     image.id = "image"
    //     image.src = "images/" + (imageNum % 5) + ".png"
    //     container.appendChild(image)
    //     imageNum++
    // },10000)


    //calls for news article once every hour
    setInterval(function(){
        fetch('/api/getArticles', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({"key": "na"}),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.articles)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },10000)

    //sets spotify song once every 3 seconds
    let curSong = ""
    setInterval(function(){
  
        fetch('/api/getCurrentSong', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({"key": "na"}),
        })
        .then((response) => response.json())
        .then((data) => {
            let artists = ""
            for (let i = 0; i < data.artists.length; ++i)
            {
                artists += String(data.artists[i])
                if (i != data.artists.length - 1)
                    artists += ", "
            }
                
            //song html only set if a new song is played
            let song = data.song + " - " + artists
            if (curSong != song)
            {
                document.getElementById("album_cover").src = data.image
                document.getElementById("song_info").innerHTML = song
                curSong = song
            }           

            // console.log("Song: " + data.song)
            // console.log("Album: " + data.album)
            // console.log("Artists: " + data.artists)
            // console.log("Image:" + data.image)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },3000)
  
});







//request example
    // //basic sending request
    // fetch('/api/getTime', {
    //     method: 'POST', // or 'PUT'
    //     headers: {
    //     'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({"key": "getTime"}),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //     document.getElementById("time").innerHTML = data.time
    //     // console.log(data.time)
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });