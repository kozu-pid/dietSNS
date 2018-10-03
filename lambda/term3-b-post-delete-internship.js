'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "term3-b-post";

exports.handler = (event, context, callback) => {
    let response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            "message": ""
        })
    };

    //認証情報をチェックする
    if (!event.headers || event.headers.Authorization !== "mti-intern") {
        response.statusCode = 403;
        response.body = JSON.stringify({
            message: "権限がありません"
        });
        callback(null, response);
        return;
    }

    let body = JSON.parse(event.body);

    //bodyが空だったら返す
    if (!body) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "bodyが空です"
        });
        callback(null, response);
        return;
    }

    let userId = body.userId;
    let timestamp = body.timestamp;
    if (!userId && !timestamp) {
        response.statusCode = 401;
        response.body = JSON.stringify({
            message: "パラメータが足りません"
        });
        callback(null, response);
        return;
    }

    let param = {
        TableName: tableName,
        Key: {
            userId: userId,
            timestamp: timestamp
        }
    };

    dynamo.delete(param, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました"
            });
            console.log(response);
            callback(null, response);
            return;
        } else {
            response.body = JSON.stringify({
                message: "success"
            });
            callback(null, response);
            return;
        }
    });
};
