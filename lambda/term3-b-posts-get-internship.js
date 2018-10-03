'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "term3-b-post";

exports.handler = (event, context, callback) => {
    const GET_MAX = 100; //postを取得できる最大件数
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

    let queryStrings = event.queryStringParameters || null;
    //クエリストリングが空だったら返す
    if (!queryStrings) {
        response.statusCode = 401;
        response.body = JSON.stringify({
            message: "パラメータが不正です"
        });
        callback(null, response);
        return;
    }

    let BMIGroup = queryStrings.BMIGroup;

    let param = {
        TableName: tableName,
        IndexName: "BMIGroup-index",
        KeyConditionExpression: "BMIGroup = :BMI",
        ExpressionAttributeValues:{
            ":BMI": BMIGroup
        },
        Limit: GET_MAX
    };
    dynamo.query(param, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        } else {
            /*if (data.Items) {
                data.Items.forEach(function(elem) {
                    delete elem.BMIGroup;
                });
            }*/
            response.body = JSON.stringify({
                posts: data.Items
            });
            callback(null, response);
            return;
        }
    });
};
