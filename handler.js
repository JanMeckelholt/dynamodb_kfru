'use strict';

//const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

const databaseManager = require('./databaseManager');
const { v4: uuidv4 } = require('uuid');



function createResponse(statusCode, message){
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveProgram = (event, context, callback) => {
  const item = JSON.parse(event.body);
  const programId = uuidv4();
  item.PK = `PROG#${programId}`;
  item.SK = `#METADATA#${programId}`;

  databaseManager.saveItem(item).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });  
};

module.exports.saveCourse = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const item = JSON.parse(event.body);
  const courseId = uuidv4();
  item.PK = `PROG#${programId}`;
  item.SK = `COUR#${courseId}`;

  databaseManager.saveItem(item).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });  
};

module.exports.saveStudent = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const item = JSON.parse(event.body);
  const studentId = uuidv4();
  item.PK = `PROG#${programId}`;
  item.SK = `STUD#${studentId}`;

  databaseManager.saveItem(item).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });  
};

module.exports.getCourses = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  databaseManager.getCourses(programId).then(response => {
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