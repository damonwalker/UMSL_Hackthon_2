const lyft =  require('node-lyft');
let defaultClient = lyft.ApiClient.instance;

let clientAuth = defaultClient.authentications['Client Authentication'];
clientAuth.accessToken = '3tW4d2X4WW8rfyRYuvujo5a8GXDwmz0zs2aCt57qz2eI2y/L79TwrjqilJRFck1TYnD6vSi5jbvglSzGRYq9qmD09bMGlQQXUq1iTCdTSmmCqWqG1IGRNt4=';
let apiInstance = new lyft.PublicApi();

const express = require('express')
const app = express()
//var passedURL;
app.get('/getplaces', (req, res) =>{
  const superagent=require("superagent")

  var url = req.query.passedURL;
  var lat = req.query.latitude;
  var lng = req.query.longitude;

 //lyft
  apiInstance.getDrivers(lat, lng).then((data) => {

    superagent.get(url).end(function (err, response) {
      if(err) {console.log(err);}
      else{
        const responseData = {
          googlePlaces: response.body,
          lyft: data
        };
        res.json(responseData);
      }
    });
  }, (error) => {
    console.error(error);
  });
  
})

app.use(express.static("./public_folder"))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
