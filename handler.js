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

module.exports.getCourses = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const query = {
		KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
	  //ExpressionAttributeNames: {'#PK': 'PK', '#SK': 'SK'},
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

module.exports.getStudents = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const query = {
		KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
	  //ExpressionAttributeNames: {'#PK': 'PK', '#SK': 'SK'},
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

module.exports.getStudentsInCourse = (event, context, callback) => {
  const programId = event.pathParameters.programId;
  const courseId = event.pathParameters.courseId;

  const query = {
		KeyConditionExpression: "PK = :PK",
	  //ExpressionAttributeNames: {'#PK': 'PK', '#SK': 'SK'},
	  ExpressionAttributeValues: {
		  ":PK": `PROG#${programId}#COUR#${courseId}`
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
	  //ExpressionAttributeNames: {'#PK': 'PK', '#SK': 'SK'},
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
 
  console.log("body after JSON.parse: ");
  console.log(body);
  
  const paramName = body.paramName;
  const paramValue = body.paramValue;
  console.log("paramName: ");
  console.log(paramName);
  console.log("paramValue: ");
  console.log(paramValue);
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





