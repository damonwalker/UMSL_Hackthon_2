const express = require('express')
const app = express()
console.log("anything")
app.get('/getplaces', (req, res) =>{
  const superagent=require("superagent")
  var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.89458,-97.14137&sensor=true&key=AIzaSyAVU6qsGHwi9ARnA7RuxUIH20oqPiQiCv8&rankby=distance&types=bus_station";
  superagent.get(url).end(function (err, response) {
    if(err) {console.log(err);}
    else{res.json(response.body);}
  });
})

app.use(express.static("./public_folder"))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
