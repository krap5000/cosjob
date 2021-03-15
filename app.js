"use strict";

require("dotenv").config({
  silent: true
});
const cors = require("cors");


const myCOS = require("ibm-cos-sdk");

var i = 1; process.env.JOB_INDEX;
console.log("my index is: " + i);

getCosClient();

getItem("cos-bucket-ce1", "test"+i+".txt");


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
	var dBucketName = "cos-bucket-ce2";
    console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
    return cos.getObject({
        Bucket: bucketName, 
        Key: itemName
    }).promise()
    .then((data) => {
        if (data != null) {
		var fileText = Buffer.from(data.Body).toString();
            console.log('File Contents: ' + fileText;
            itemName = itemName + "_PROCESSED";
	    console.log(`Creating new item: ${itemName}`);
           cos.putObject({
               Bucket: dBucketName, 
                Key: itemName, 
                Body: fileText
             }).promise()
             .then(() => {
        console.log(`Item: ${itemName} created!`);
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
		
	     //		return Buffer.from(data.Body).toString();
        }    
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}


function createTextFile(bucketName, itemName, fileText) {
    console.log(`Creating new item: ${itemName}`);
    return cos.putObject({
        Bucket: bucketName, 
        Key: itemName, 
        Body: fileText
    }).promise()
    .then(() => {
        console.log(`Item: ${itemName} created!`);
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}


function deleteItem(bucketName, itemName) {
    console.log(`Deleting item: ${itemName}`);
    return cos.deleteObject({
        Bucket: bucketName,
        Key: itemName
    }).promise()
    .then(() =>{
        console.log(`Item: ${itemName} deleted!`);
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
