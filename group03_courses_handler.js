
'use strict';

const databaseManager = require('./databaseManager');
const { v4: uuidv4 } = require('uuid');

function createResponse(statusCode, message){
  var msg = [message, {responseNotice: 'by group03'}];
  return {
    statusCode: statusCode,
    body: JSON.stringify(msg)
    };
}

module.exports.saveCourse = (event, context, callback) => {
    //Definiere Partion-Key und Sort-Key um einen neuen Kurs zu speichern.
    //Du bekommst das Programm zu dem der Kurs gehört aus der pathParameters übergeben (programId)
    //Die Kurs-ID wird hier erzeugt (courseId)
    //Die sonstigen Parameter des Kurses durch den Benutzer frei wählbar und werden in der
    //POST-Anfrage mitgeschickt.   
    const programId = event.pathParameters.programId;
    const courseId = uuidv4();
    const item = JSON.parse(event.body);


    //item.PK = "Your PK goes here";
    //item.SK = "Your SK goes here";
    item.notice = "saved by group03";
  
    databaseManager.saveItem(item).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });  
  };

  module.exports.getCourses = (event, context, callback) => {
    //Definiere Partion-Key und Sort-Key um alle Kurse eines Programms abzurufen.
    //Du bekommst das Programm zu dem der Kurs gehört aus der pathParameters übergeben (programId)
    const programId = event.pathParameters.programId;
    const query = {
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        ExpressionAttributeValues: {
        //    ":PK": "Your PK goes here",
        //    ":SK": "Your SK goes here"
        }
      }
    
    databaseManager.getItems(query).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    }); 
  };

  module.exports.getCourse = (event, context, callback) => {
    //Definiere Partion-Key und Sort-Key um einen Kurs abzurufen.
    //Du bekommst das Programm zu dem der Kurs gehört (programId)
    //und den Kurs (courseId) in den pathParameters übergeben.
    const programId = event.pathParameters.programId;
    const courseId = event.pathParameters.courseId;
    const key = {
      //PK: "Your PK goes here",
      //SK: "Your SK goes here"
    }
    databaseManager.getItem(key).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });
  };

  module.exports.deleteCourse = (event, context, callback) => {
    //Definiere Partion-Key und Sort-Key um einen Kurs zu löschen.
    //Du bekommst das Programm zu dem der Kurs gehört (programId)
    //und den Kurs (courseId) in den pathParameters übergeben.
    //Orientiere dich an der Funktion "getCourse".

    //Your Code goes here.

    databaseManager.deleteItem(key).then(response => {
      callback(null, createResponse(200, 'Course was deleted by group03-function'));
    });
  };

  module.exports.updateCourse = (event, context, callback) => {
    //Definiere Partion-Key und Sort-Key um ein Key-Value-Paar eines Kurses zu ändern.
    //Du bekommst das Programm zu dem der Kurs gehört (programId)
    //und den Kurs (courseId) in den pathParameters übergeben.
    //Im Body des Put-Aufrufes wird der zu ändernde Key als 'paramName' und
    //der neue Wert dieses Keys als 'paramValue' mitgesendet.
    //Beispiel {"paramName": "email", "paramValue": "neue@email.de"}

    // Your Code to define the key with PK and SK from the pathParameters goes here.

    //Your Code to define the paramName and paramValue from the event.body goes here.
    //Maybe JSON.parse(event.body) can be helpfull.
  
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
    //Definiere Partion-Key und Sort-Key um alle Studenten 
    //eines Kurses abzurufen.
    //Du bekommst das Programm zu dem der Kurs gehört (programId)
    //und den Kurs (courseId) in den pathParameters übergeben.
    const programId = event.pathParameters.programId;
    const courseId = event.pathParameters.courseId;
  
    const query = {
        KeyConditionExpression: "PK = :PK",
        ExpressionAttributeValues: {
          //  ":PK": Your PK goes here
          //  ":SK": Your SK goes here ...if needed... :-)
        }
      }
    
    databaseManager.getItems(query).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    }); 
  };

  module.exports.assignStudentToCourse = (event, context, callback) => {
    //Definiere Partion-Key und Sort-Key einen Student in einen 
    //Kurs einzuschreiben.
    //Du bekommst das übergeordnete Programm (programId)
    //in den pathParameters übergeben.
    //Dem Post-Aufruf wird im Body die Studenten-ID und
    //die Kurs-Id mitgegeben.
    //Beispiel {"studentId": "12345", "courseId": "67890", "optional": "something additional"}
    const programId = event.pathParameters.programId;
    
    //const studentId = Your Code to define studentId goes here
    //const courseId = Your Code to define studentId goes here
    //nutze JSON.parse(event.body)

    //item.PK = Your Code to define PK goes here
    //item.SK = Your Code to define SK goes here
  
    databaseManager.saveItem(item).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });  
  };