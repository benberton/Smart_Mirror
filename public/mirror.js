//Gets called when the mirror.html page is loaded
document.addEventListener("DOMContentLoaded", ()=>{
    //sets the clock on the mirror.html page every 30ms
    setInterval(function(){
        const date = new Date()
        document.getElementById("time").innerHTML = getTimeString(date)
        ////uncomment to add seconds
        // document.getElementById("seconds").innerHTML = getSeconds(date)
        document.getElementById("time_of_day").innerHTML = getTimeOfDay(date)
    }, 30);

   
    // let articles = []
    let articles = [
        "Apple high-yield Savings account one step closer to launch",
        "iPhone global sell-through improved in January, still declining overall",
        "Apple has released a Rapid Security Response update for the iPhone and Mac",
        "Apple Permanently Closes Charlotte, North Carolina Store After Multiple Shooting Incidents"
    ]

    //uses modular math to cycle between the articles returned by the news API
    let numOfArticles = 0
    let curArticle = 0
    let readTime = 50000
    setInterval(function(){
        let article_title = document.getElementById("news_article")
        article_title.innerHTML = "- " + articles[curArticle % articles.length]
        curArticle++
    },readTime)

    //calls for news article once every set period, in this case, once every 20 minutes
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
            numOfArticles = data.articles.length
            curArticle = 0
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },10000)

    //sets spotify song once every 3 seconds using the Spotify API
    let curSong = ""
    setInterval(function(){
  
        //call to backend for the users data
        fetch('/api/getCurrentSong', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({"key": "na"}),
        })
        .then((response) => response.json())
        .then((data) => {
            //backend returns the user's Spotify data
            //list of artists is parsed
            let artists = ""
            for (let i = 0; i < data.artists.length; ++i)
            {
                artists += String(data.artists[i])
                if (i != data.artists.length - 1)
                    artists += ", "
            }
                
            //song div in html only set if a new song is played
            let song = data.song + " - " + artists
            if (curSong != song)
            {
                document.getElementById("album_cover").src = data.image
                document.getElementById("song_info").innerHTML = song
                curSong = song
            }           

        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },3000)
  
});

