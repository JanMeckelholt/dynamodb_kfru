# dynamodb_kfru

A AWS-Dynamo-Database to store information about a university-program.
Entities are Students, Courses and Study-Programs.
Uses AWS lambda funciton to interact with the DB

## databaseManager.js
Build on the AWS SDK and provides the CRUD-functionality to the DB.
The same methods are used for the differen entities.

## handler.js
Provides Methods to CRUD study-program and student data on the Dynamo-Database.
It is also possible to get all the courses of a student and remove a student from a course

## courses_handler.js
As this demo is used for demonstration purposes including excercieses, the methods regarding course data manipulation were extracted in a separate file (courses_handler.js).
The CRUD methods for courses as well the method to assign a student to a course or to get all the students of a course are found here.

## groupXX_courses_handler.js
This is the basis for the exercises. The sceleton files have to be filled by the student. A possible solution is courses_handler.js
