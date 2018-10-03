'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "term3-b-user";

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

    //リクエストbodyを取得し、jsのオブジェクトにパースする
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

    //bodyの中身を取得
    let userId = body.userId;

    if (!userId) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "パラメータが足りません"
        });
        callback(null, response);
        return;
    }

    //ログイン判定
    var param = {
        TableName: tableName,
        Key: {
            userId: userId
        }
    };
    //データの削除
    dynamo.delete(param, function(err, data) {
    //削除に失敗した場合
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
            //削除に成功した場合
        } else {
            response.body = JSON.stringify({
                message: "アカウントの削除に成功しました"
            });
            callback(null, response);
            return;
        }
    });
};
