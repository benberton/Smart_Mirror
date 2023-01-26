document.addEventListener("DOMContentLoaded", ()=>{
    //basic sending request
    fetch('/api/getTime', {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({"key": "getTime"}),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.time)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
