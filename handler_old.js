'use strict';

const databaseManager = require('./databaseManager');
const uuidv4 = require("uuid/v4");



function createResponse(statusCode, message){
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveProgram = (event, context, callback) => {
  console.log("event.body: " + event.body);
  const item = JSON.parse(event.body);
  const programId = uuidv4();
  console.log("after JSON.parse: ");
  console.log(item);
  item.PK = `PRO#${programId}`;
  item.SK = `#METADATA#${programId}`;
  console.log(item);

  databaseManager.saveItem(item).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });  
};

// module.exports.getItem = (event, context, callback) => {
//   const itemId = event.pathParameters.itemId;

//   databaseManager.getItem(itemId).then(response => {
//     console.log(response);
//     callback(null, createResponse(200, response));
//   });
// };


// module.exports.deleteItem = (event, context, callback) => {
//   const itemId = event.pathParameters.itemId;

//   databaseManager.deleteItem(itemId).then(response => {
//     callback(null, createResponse(200, 'Item was deleted'));
//   });
// };

// module.exports.updateItem = (event, context, callback) => {
//   const itemId = event.pathParameters.itemId;
//   console.log(itemId);
  
//   const body = JSON.parse(event.body);
 
//   console.log("body after JSON.parse: ");
//   console.log(body);
  
//   const paramName = body.paramName;
//   const paramValue = body.paramValue;
//   console.log("paramName: ");
//   console.log(paramName);
//   console.log("paramValue: ");
//   console.log(paramValue);
//   databaseManager.updateItem(itemId, paramName, paramValue).then(response => {
//     console.log("Response: " + response);
//     callback(null, createResponse(200, response));
//   });
// };