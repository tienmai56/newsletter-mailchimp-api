const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")
const app = express()
const https = require("https")
app.use(bodyParser.urlencoded({extended:true}))

// if we want server to serve up static file, need to use special function of express
app.use(express.static("public"))

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/", function(req,res){
    var firstN = req.body.firstN
    var lastN = req.body.lastN
    var email = req.body.email

    var data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstN,
                    LNAME: lastN
                }
            }
        ]
    };
    

    // turn this data into a string in a format of a json
    const jsonData = JSON.stringify(data);

    //send this data to mailchimp - api path to my unique audience list
    const url = "https://us6.api.mailchimp.com/3.0/lists/1bb7e5e86c"
    //post data to this api
    const  options = {
        method: "POST",
        //need to provide some identification if i want my post request to go thru successfully
        auth: "Tien:3e7ddf9357cb6bc3a3feb887aaf8e567-us6"
    }
    const request = https.request(url,options, function(response){ // response from the mailchimp server
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")

        }
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })

    })

    //send data to mailcihmp server

    // request.write(jsonData)
    request.end()
    

})

app.post("/failure", function(req,res){
    res.sendFile(__dirname+"/")

})

app.listen(3000, function(){
    console.log("port is running")
})

// 3e7ddf9357cb6bc3a3feb887aaf8e567-us6
// 1bb7e5e86c