document.addEventListener("DOMContentLoaded", ()=>{
    //sets the clock every 300ms
    setInterval(function(){
        const date = new Date()
        document.getElementById("time").innerHTML = getTimeString(date)
        //uncomment to add seconds
        // document.getElementById("seconds").innerHTML = getSeconds(date)
        document.getElementById("time_of_day").innerHTML = getTimeOfDay(date)
    }, 30);

    //cylces through the current articles
    let curArticle = 0
    let readTime = 10000
    let articles = []
    let numOfArticles = 5
    setInterval(function(){
        //clearing the container
        let articlesContainer = document.getElementById("news_articles")
        while(articlesContainer.firstChild)
            articlesContainer.removeChild(articlesContainer.firstChild)
        for (let i = 0; i < numOfArticles; ++i)
        {
        
        }
        let article_title = document.getElementById("news_article")
        article_title.innerHTML = articles[curArticle % articles.length]
        curArticle++
    },readTime)

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
            articles = data.articles
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