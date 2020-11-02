
//mkdir cd
//npm init -y
//yarn add aws-sdk dayjs uuid --save
//create table in dynamoDB-console

//aws configure


const uuidv4 = require("uuid/v4");
const AWS = require("aws-sdk");
AWS.config.update({region: "eu-central-1"});

const dynamodb = new AWS.DynamoDB.DocumentClient();


//1. Create a study program
const programId = uuidv4();

var params = {
    TableName : 'kfru-programs',
    Item: {
        PK: `PRO#${programId}`,
        SK: `#METADATA#${programId}`,
        name: 'PSE',
        location: 'Boeblingen'

    }
};

dynamodb.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
});