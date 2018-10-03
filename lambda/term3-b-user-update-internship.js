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
    let password = body.password;
    let BMIGroup = body.BMIGroup;
    let drink = body.drink;
    let name = body.name;
    if (!userId || !password || !BMIGroup || !drink) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "パラメータが足りません"
        });
        callback(null, response);
        return;
    }

    var param = {
        TableName: tableName,
        Item: {
            userId: userId,
            password: password,
            BMIGroup: BMIGroup,
            drink: drink,
            name: name
        }
    };

    //データの更新
    dynamo.put(param, function(err, data) {
        //更新に失敗した場合
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
            //更新に成功した場合
        } else {
            delete param.Item.password;
            response.body = JSON.stringify(param.Item);
            callback(null, response);
            return;
        }
    });
};
