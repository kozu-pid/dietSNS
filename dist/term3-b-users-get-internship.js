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

    let param = {
        TableName: tableName
    };

    //ユーザー一覧を取得
    dynamo.scan(param, function(err, data) {
        //データの取得に失敗
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }
        //全ユーザのpasswordを隠蔽
        if (data.Items) {
            data.Items.forEach(function(elem) {
                delete elem.password;
                delete elem.BMIGroup;
            });
        }
        response.body = JSON.stringify({
            users: data.Items
        });
        callback(null, response);
    });
};
