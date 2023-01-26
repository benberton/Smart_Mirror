document.addEventListener("DOMContentLoaded", ()=>{

    setInterval(setTime, 300);
});

function setTime()
{
    const date = new Date()
    
    document.getElementById("time").innerHTML = date.getHours() + ":" + convertToTime(date.getMinutes())
    document.getElementById("seconds").innerHTML = convertToTime(date.getSeconds())
}

// if the time is less that 10, a zero is added in front (ex: 8 -> 08)
function convertToTime(time)
{
    if (time < 10)
        return "0" + time
    return time
}





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