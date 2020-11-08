
'use strict';

const databaseManager = require('./databaseManager');
const { v4: uuidv4 } = require('uuid');

function createResponse(statusCode, message){
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

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

  module.exports.getCourses = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const query = {
          KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        ExpressionAttributeValues: {
            ":PK": `PROG#${programId}`,
            ":SK": "COUR#"
        }
      }
    
    databaseManager.getItems(query).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    }); 
  };

  module.exports.getCourse = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const courseId = event.pathParameters.courseId;
    const key = {
      PK: `PROG#${programId}`,
      SK: `COUR#${courseId}`
    }
    databaseManager.getItem(key).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });
  };

  module.exports.deleteCourse = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const courseId = event.pathParameters.courseId;
    const key = {
      PK: `PROG#${programId}`,
      SK: `COUR#${courseId}`
    }
    databaseManager.deleteItem(key).then(response => {
      callback(null, createResponse(200, 'Course was deleted'));
    });
  };

  module.exports.updateCourse = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const courseId = event.pathParameters.courseId;
    const key = {
      PK: `PROG#${programId}`,
      SK: `COUR#${courseId}`
    }
    const body = JSON.parse(event.body);
    const paramName = body.paramName;
    const paramValue = body.paramValue;
  
    databaseManager.updateItem(key, paramName, paramValue).then(response => {
      console.log("Response: " + response);
      callback(null, createResponse(200, response));
    });
  };

  module.exports.getCourseByName = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const courseName = decodeURI(event.pathParameters.courseName);
    const query = {
      IndexName: "PK-data-Index",
      KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK)",
      ExpressionAttributeNames: {'#PK': 'PK', '#SK': 'data'},
      ExpressionAttributeValues: {
        ":PK": `PROG#${programId}`,
        ":SK": `COUR#${courseName}`
      }
    };
    databaseManager.getItems(query).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    }); 
  };
  
  module.exports.getStudentsInCourse = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const courseId = event.pathParameters.courseId;
  
    const query = {
          KeyConditionExpression: "PK = :PK",
        ExpressionAttributeValues: {
            ":PK": `PROG#${programId}#COUR#${courseId}`
        }
      }
    
    databaseManager.getItems(query).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    }); 
  };

  module.exports.assignStudentToCourse = (event, context, callback) => {
    const programId = event.pathParameters.programId;
    const item = JSON.parse(event.body);
    const studentId = item.studentId;
    const courseId = item.courseId;
    item.PK = `PROG#${programId}#COUR#${courseId}`;
    item.SK = `PROG#${programId}#STUD#${studentId}`;
  
    databaseManager.saveItem(item).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });  
  };