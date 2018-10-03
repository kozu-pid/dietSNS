'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "term3-b-post";

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
    let userId_post = body.userId_post;
    let timestamp = body.timestamp;
    let likedUser = body.likedUser;//これ足りん
    let userId_nice = body.userId_nice;
    let BMIGroup = body.BMIGroup;
    let nice = body.nice;
    let category = body.category;
    let name = body.name;
    let text = body.text;

    if (!userId_post || !userId_nice || !timestamp || !likedUser || !BMIGroup || nice < 0 || !name || !text) {
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
            userId: userId_post,
            timestamp: timestamp,
            likedUser: likedUser,
            BMIGroup: BMIGroup,
            nice: nice,
            category: category,
            name: name,
            text: text
        }
    };

    //データの更新
    dynamo.put(param, function (err, data) {
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
            response.body = JSON.stringify(param.Item.likedUser);
            callback(null, response);
            return;
        }
    });
};
