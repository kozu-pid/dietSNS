'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "term3-b-user";
const token = "mti-intern";
let BMIGroup = "";

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
            message: "パラメータが不足しています"
        });
        callback(null, response);
        return;
    }

    //bodyの中身を取得
    let userId = body.userId;
    let password = body.password;

    //userId or passwordが空だったら返す
    if (!userId || !password) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "パラメータが不足しています"
        });
        callback(null, response);
        return;
    }

    //認証(userIdとpasswordが合致するものがあるか)
    let param = {
        TableName: tableName,
        //キー、インデックスによる検索の定義
        KeyConditionExpression: "userId = :uid",
        //プライマリーキー以外の属性でのフィルタ
        FilterExpression: "#pass = :pass",
        //属性名のプレースホルダの定義
        ExpressionAttributeNames: {
            "#pass": "password"
        },
        //検索値のプレースホルダの定義
        ExpressionAttributeValues: {
            ":uid": userId,
            ":pass": password
        }
    };
    dynamo.query(param, function (err, data) {
        //userの取得に失敗
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }
        //該当するデータが見つからない(ログイン失敗)
        if (!data.Items.length) {
            response.statusCode = 401;
            response.body = JSON.stringify({
                message: "userIdまたはpasswordが一致しません"
            });
            callback(null, response);
            return;
        }
        //認証成功
        response.body = JSON.stringify({
            "token": token,
            "BMIGroup": data.Items[0].BMIGroup,
            "name": data.Items[0].name
        });
        callback(null, response);
    });
};
