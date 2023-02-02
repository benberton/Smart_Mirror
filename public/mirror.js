document.addEventListener("DOMContentLoaded", ()=>{
    //sets the clock every 300ms
    setInterval(function(){
        const date = new Date()
        document.getElementById("time").innerHTML = getTimeString(date)
        //uncomment to add seconds
        // document.getElementById("seconds").innerHTML = getSeconds(date)
        document.getElementById("time_of_day").innerHTML = getTimeOfDay(date)
    }, 300);


    let imageNum = 0;
    //rotates between images
    setInterval(function(){
        let container = document.getElementById("image_container")
        container.removeChild(container.lastElementChild)
        let image = document.createElement("img")
        image.id = "image"
        image.src = "images/" + (imageNum % 5) + ".png"
        container.appendChild(image)
        imageNum++
    },10000)
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