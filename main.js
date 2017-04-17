var express = require("express")
var app = express()
var request = require("request")
var port = 3002
var apiKey = "tiNFg9zDKRWXaIpI8pPyWbXd4ACa9ZDt"
var findURL = "https://api.trustpilot.com/v1/business-units/find?name="
var reviewsURL = "https://api.trustpilot.com/v1/business-units/" // Remeber to add /reviews


app.listen(port, function(){
    console.log("Server started on " + port)
})

app.get('/calculator/:domain', (req,res) =>{
    let domain = req.params.domain
    getCompanyID(domain, (err,average,numberOfReviews) =>{
        if(!err){
            var obj = new Object
            obj.averageGrade = average
            obj.numberOfReviews = numberOfReviews
            res.json(obj)
        }
        else{
            res.json("Something Went Wrong: " + err)
        }
    })
})



function getCompanyID(domain, callback){
    let options = {
        url : findURL + domain,
        headers: {
            apiKey : apiKey,
        }
    }
    request(options, function(error, response, body){
        let obj = JSON.parse(body)
        getReviews(obj.id, callback)
    })
}

function getReviews(id, callback){
    if(id == null){
        callback(Error("Not Found"))
        return;
    }    
    let options = {
        url : reviewsURL + id + "/reviews",
        headers: {
            apiKey : apiKey,
        }
    }

    request(options, function(error, response,body){
        let obj = JSON.parse(body)
        let reviews = obj.reviews
        let lengthOfLoop = reviews.length
        if(lengthOfLoop > 300){
            lengthOfLoop = 300
        }

        let sumOfAllReviews = 0
        for(var i = 0; i < lengthOfLoop; i++){
            sumOfAllReviews += reviews[i].stars
        }
        let averageScore = sumOfAllReviews / lengthOfLoop
        callback(null, averageScore, reviews.length)
    })

}





