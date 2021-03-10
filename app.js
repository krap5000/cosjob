"use strict";
//const express = require("express");
//const app = express();
//const request = require("request");
//const path = require("path");
require("dotenv").config({
  silent: true
});
const cors = require("cors");
//app.use(cors());
//app.use(express.static(__dirname + '/public/js'));
//app.use(express.static(__dirname + '/public/images'))
//app.use(express.static(__dirname + '/public/css'))
//const port = process.env.PORT || 3000;


const myCOS = require("ibm-cos-sdk");


console.log("hello1");
getCosClient();
getItem("test1-bucket-code-engine", "test1.txt");
console.log("hello2");
console.log("my index is: " + process.env.JOB_INDEX);

/**
 *Define Cloud OBject Storage client configuration
 *
 * @return {*} cosCLient
 */
function getCosClient() {
  var config = {
    endpoint:
      process.env.COS_ENDPOINT ||
      "s3.us-south.cloud-object-storage.appdomain.cloud",
    apiKeyId: process.env.COS_APIKEY,
    ibmAuthEndpoint: "https://iam.cloud.ibm.com/identity/token",
    serviceInstanceId: process.env.COS_RESOURCE_INSTANCE_ID,
  };

  //console.log(process.env);
  var cosClient = new myCOS.S3(config);
  return cosClient;
}



function getItem(bucketName, itemName) {
	let cos = getCosClient();
    console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
    return cos.getObject({
        Bucket: bucketName, 
        Key: itemName
    }).promise()
    .then((data) => {
        if (data != null) {
            console.log('File Contents: ' + Buffer.from(data.Body).toString());
            return Buffer.from(data.Body).toString();
        }    
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}



/*
 * Default route for the web app
 *
app.get('/', function(req, res) {

        res.sendFile(__dirname + "/public/index.html");

});



app.get("/results", async (req, res, next) => {
  try {
    //let result = await getBucketContents(req, res, next, "results");
    //res.send(result);
    let result = await getItem("test1-bucket-code-engine", "test1.txt")
    res.send(result);
    console.log(result)
  } catch (error) {
    // Passes errors into the error handler
    console.log(error);
    return next(error);
  }
});


//app.use(function(error, req, res, next) {
  //res.status(500).send(error.message);
//});

//app.listen(port, () => console.log(`App listening on port ${port}!`));
*/
