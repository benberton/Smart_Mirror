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

    // setArticles()
    // //calls for news article once every set period, in this case, once every 20 minutes
    // setInterval(setArticles(),50000)

    //uses modular math to cycle between the articles returned by the news API
    let articles = []
    let curArticle = 0
    let readTime = 50000
    // setInterval(function(){
    //     // let article_title = document.getElementById("news_article")
    //     // article_title.classList.add
    //     // for (let i = 0; i < 20; ++i)
    //     //     if(i != curArticle % 20)
    //     //         article_title.childNodes[i].classList.add("hidden")
    //     //     else
    //     //         article_title.childNodes[i].classList.remove("hidden")

    //     //         // console.log("Current Article: " + curArticle)
    //     // curArticle++
    // },2000)


    //sets spotify song once every 3 seconds using the Spotify API
    let curSong = ""
    setInterval(function(){
  
        //call to backend for the user's current song playing on Spotify
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
            let artists = ""
            for (let i = 0; i < data.artists.length; ++i)
            {
                artists += String(data.artists[i])
                if (i != data.artists.length - 1)
                    artists += ", "
            }
                
            //song text in mirror.html only set if a new song is played
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

function setArticles()
{
    fetch('/api/getArticles', {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({"key": "na"}),
    })
    .then((response) => response.json())
    .then((data) => {
        let article_title = document.getElementById("news_article")
        //clearing the news API container
        while(article_title.firstChild)
            article_title.removeChild
        
        articles = data.articles
        //only adding the top 2 articles to the list of articles on the mirror
        for (let i = 0; i < 2; i++) {
            let article = document.createElement("div")
            article.innerHTML = data.articles[i]
            article_title.appendChild(article)
        }
        // articles = data.articles
        // numOfArticles = data.articles.length
        // console.log(numOfArticles)
        // curArticle = 0
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}