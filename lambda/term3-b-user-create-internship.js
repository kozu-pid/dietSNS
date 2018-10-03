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
    let BMIGroup = body.BMIGroup;
    let drink = false;
    let name = body.name;
    let password = body.password;

    //userテーブルのvalidation(パラメータのどれかが空だったら返す)
    if (!userId || !password || !BMIGroup || !name) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "パラメータが足りません"
        });
        callback(null, response);
        return;
    }

    //登録するデータ内容
    let item = {
        userId: userId,
        BMIGroup: BMIGroup,
        drink: drink,
        name: name,
        password: password
    };

    let param = {
        TableName: tableName,
        Item: item,
        Expected: {
            "userId": {
                "Exists": "False"
            }
        }
    };

    //データの登録
    dynamo.put(param, function(err, data) {
        //登録に失敗した場
        if (err && err.message === "The conditional request failed") {
            response.statusCode = 400;
            response.body = JSON.stringify({
                "message": "userIdがすでに登録されています"
            });
            //登録に成功した場合
        } else if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "予期せぬエラーが発生しました"
            });
        } else {
            delete param.Item.password; //パスワードは返さない
            response.body = JSON.stringify(param.Item);
        }
        callback(null, response);
        return;
    });
};
