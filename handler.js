
//mkdir cd
//npm init -y
//yarn add aws-sdk dayjs uuid --save
//create table in dynamoDB-console

//aws configure

'use strict';

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



module.exports.saveStudent = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const item = JSON.parse(event.body);
  const studentId = uuidv4();
  item.PK = `PROG#${programId}`;
  item.SK = `STUD#${studentId}`;

  databaseManager.saveItem(item).then(response => {
    console.log("Response saveStudent: " + response);
    callback(null, createResponse(200, response));
  });  
};



module.exports.getStudents = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const query = {
		KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
	  ExpressionAttributeValues: {
		  ":PK": `PROG#${programId}`,
		  ":SK": "STUD#"
	  }
	}
  databaseManager.getItems(query).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  }); 
};


module.exports.getCoursesOfStudent = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const studentId = event.pathParameters.studentId;

  const query = {
    IndexName: "SK-PK-Index",
    KeyConditionExpression: "SK = :SK",
	  ExpressionAttributeValues: {
		  ":SK": `PROG#${programId}#STUD#${studentId}`
	  }
	}
  
  databaseManager.getItems(query).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  }); 
};

module.exports.getProgram = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const key = {
    PK: `PROG#${programId}`,
    SK: `#METADATA#${programId}`
  }
  databaseManager.getItem(key).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};
module.exports.getStudent = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const studentId = event.pathParameters.studentId;
  const key = {
    PK: `PROG#${programId}`,
    SK: `STUD#${studentId}`
  }
  databaseManager.getItem(key).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};


module.exports.removeStudentFromCourse = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const studentId = event.pathParameters.studentId;
  const courseId = event.pathParameters.courseId;
  const key = {
    PK: `PROG#${programId}#COUR#${courseId}`,
    SK: `PROG#${programId}#STUD#${studentId}`
    }
  databaseManager.deleteItem(key).then(response => {
    callback(null, createResponse(200, 'Student was removed from Course'));
  });  
};

module.exports.deleteStudent = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const studentId = event.pathParameters.studentId;
  const key = {
    PK: `PROG#${programId}`,
    SK: `STUD#${studentId}`
  }
  
  databaseManager.deleteItem(key).then(response => {
    callback(null, createResponse(200, 'Student was deleted'));
  });
};

module.exports.deleteProgram = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const key = {
    PK: `PROG#${programId}`,
    SK: `#METADATA#${programId}`
  }
  databaseManager.deleteItem(key).then(response => {
    callback(null, createResponse(200, 'Course was deleted'));
  });
};

module.exports.updateStudent = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const studentId = event.pathParameters.studentId;
  const key = {
    PK: `PROG#${programId}`,
    SK: `STUD#${studentId}`
  }
  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateItem(key, paramName, paramValue).then(response => {
    console.log("Response: " + response);
    callback(null, createResponse(200, response));
  });
};

module.exports.updateProgram = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const key = {
    PK: `PROG#${programId}`,
    SK: `#METADATA${programId}`
  }
  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateItem(key, paramName, paramValue).then(response => {
    console.log("Response: " + response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getStudentByName = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const studentName = decodeURI(event.pathParameters.studentName);
  const query = {
    IndexName: "PK-data-Index",
    KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK)",
    ExpressionAttributeNames: {'#PK': 'PK', '#SK': 'data'},
    ExpressionAttributeValues: {
      ":PK": `PROG#${programId}`,
      ":SK": `STUD#${studentName}`
    }
  };
  databaseManager.getItems(query).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  }); 
};






