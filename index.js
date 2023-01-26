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

// the default page is set to the create poll page when site is visited
app.get('/', function(req, res){
    res.redirect('/mirror.html');
});

//basic api call
app.post("/api/getTime", function(req,res) {
    res.send(JSON.stringify({"time": "11am"}))
    res.end()
})