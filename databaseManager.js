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


module.exports.getCourses = programId => {
	//const programId = event.pathParameters.programId;
	var params = {
	  TableName: TABLE_NAME,
	  KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
	  //ExpressionAtrributeNames: {'#PK': 'PK', '#SK': 'SK'},
	  ExpressionAttributeValues: {
		  ":PK": `PROG#${programId}`,
		  ":SK": "COUR#"
	  }
	};
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


module.exports.getItem = itemId => {
	const params = {
		Key: {
			itemId: itemId
		},
		TableName: TABLE_NAME
	};
	return dynamo.get(params).promise().then(result => {
		return result.Item;
	});
};



module.exports.deleteItem = itemId => {
	const params = {
		Key: {
			itemId: itemId
		},
		TableName: TABLE_NAME
	};
	return dynamo.delete(params).promise();
};

module.exports.updateItem = (itemId, paramsName, paramsValue) => {
	console.log(itemId);
	console.log(paramsName);
	console.log(paramsValue);
	const params = {
		TableName: TABLE_NAME,
		Key: {
			itemId
		},
		ConditionExpression: 'attribute_exists(itemId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};
	return dynamo.update(params).promise().then(response => {
		return response.Attributes;
	});
};