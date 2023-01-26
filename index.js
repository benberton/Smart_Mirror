const express = require('express')
const fs = require('fs')

const port = 8080
// const port = 8080
const app = express()


app.use(express.static('public'))
//using json format
app.use(express.json());


app.listen(port,function(error) {
    if (error)
        console.log("Error: " + error)
    else
        console.log("Server started on port " + port)
})

// the default page is set to the mirror html page when site is visited
app.get('/', function(req, res){
    res.redirect('/mirror.html');
});



// //basic api call example
// app.post("/api/getTime", function(req,res) {
//     console.log(req.data)
//     res.send(JSON.stringify({"time": Date().toISOString()}))
//     res.end()
// })