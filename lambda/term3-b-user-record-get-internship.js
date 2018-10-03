'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "term3-b-user-record";

exports.handler = (event, context, callback) => {
    //レスポンスの雛形
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

    //クエリストリングが空だったら返す
    if (!event.queryStringParameters) {
        response.statusCode = 401;
        response.body = JSON.stringify({
            message: "パラメータが空です"
        });
        callback(null, response);
        return;
    }

    //クエリストリングを取得
    let userId = event.queryStringParameters.userId; //見たいユーザのuserId

    //クエリストリングの値がないなら返す
    if (!userId) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "パラメータに値が入力されていません"
        });
        callback(null, response);
        return;
    }

    //ログインしているかの判定
    let param = {
        TableName: tableName,
        Key: {
            userId: userId
        }
    };
    //ユーザー情報を取得
    dynamo.get(param, function (err, data) {
        //データの取得に失敗
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }
        response.body = JSON.stringify(data.Item);
        callback(null, response);
    });
};
