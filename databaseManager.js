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
		return item;
	});
};


module.exports.getItems = query => {
	var params = query;
	params.TableName = TABLE_NAME;
	return dynamo.query(params).promise().then(result => {
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
		TableName: TABLE_NAME,
		ReturnValues: 'ALL_OLD'
	};
	return dynamo.delete(params).promise().then(response =>{
		return response.Attributes;
	});
};

module.exports.updateItem = (key, paramName, paramValue) => {
	console.log(key);
	console.log(paramName);
	console.log(paramValue);
	const params = {
		TableName: TABLE_NAME,
		Key: key,
		UpdateExpression: 'set #pN = :pV',
		ConditionExpression: 'attribute_exists(#pN)',
		ExpressionAttributeNames: {
			'#pN': paramName
		},
		ExpressionAttributeValues: {
			':pV': paramValue
		},
		ReturnValues: 'ALL_NEW'
	};
	return dynamo.update(params).promise().then(response => {
		return response.Attributes;
	});
};