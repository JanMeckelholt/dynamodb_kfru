'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.saveItem = item => {
	const params = {
		TableName: TABLE_NAME,
		Item: item
	};

	return dynamo.put(params).promise().then(() => {
		return item.itemId;
	});
};


module.exports.getItems = query => {
	//const programId = event.pathParameters.programId;
	var params = query;
	params.TableName = TABLE_NAME;
	console.log(params);
	//var documentClient = new AWS.DynamoDB.DocumentClient();
  
	return dynamo.query(params, function(err, data) {
			if (err) console.log(err);
			else console.log(data);
		}).promise().then(result => {
			console.log(result);
			return result.Items;
		});
  };


module.exports.getItem = key => {
	const params = {
		Key: key,
		TableName: TABLE_NAME
	};
	return dynamo.get(params).promise().then(result => {
		return result.Item;
	});
};



module.exports.deleteItem = key => {
	const params = {
		Key: key,
		TableName: TABLE_NAME
	};
	return dynamo.delete(params).promise();
};

module.exports.updateItem = (key, paramName, paramValue) => {
	console.log(key);
	console.log(paramName);
	console.log(paramValue);
	const params = {
		TableName: TABLE_NAME,
		Key: key,
		UpdateExpression: 'set ' + paramName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramValue
		},
		ReturnValues: 'ALL_NEW'
	};
	return dynamo.update(params).promise().then(response => {
		return response.Attributes;
	});
};