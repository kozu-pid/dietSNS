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
    let timestamp = Date.now();
    let BMIGroup = body.BMIGroup;
    let category = body.category;
    let name = body.name;
    let nice = 0;
    let text = body.text;

    //null判定
    if (!userId || !text) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "パラメータが足りません"
        });
        callback(null, response);
        return;
    }

    if(!BMIGroup){
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "BMIGroupが判別できません"
        });
        callback(null, response);
        return;
    }

    //postのデータ登録用のパラメータ
    let param = {
        TableName: tableName,
        Item: {
            userId: userId,
            timestamp: timestamp,
            BMIGroup: BMIGroup,
            category: category,
            name: name,
            nice: nice,
            text: text,
            likedUser:userId
        }
    };

    //postの登録
    dynamo.put(param, function(err, data) {
    //登録に失敗
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
            //登録に成功
        } else {
            response.body = JSON.stringify(param.Item);
            callback(null, response);
            return;
        }
    });
};
