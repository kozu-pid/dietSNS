// APIにPOSTリクエストを送る
fetch(url + "/test/echo", {
    method: "POST",
    body: JSON.stringify({
        key1: "value1",
        key2: "value2",
        key3: "value3"
    })
})
    .then(function(response) {
        if (response.status == 200) {
            return response.json();
        }
        // 200番以外のレスポンスはエラーを投げる
        return response.json().then(function(json) {
            throw new Error(json.message);
        });
    })
    .then(function(json) {
    // レスポンスが200番で返ってきたときの処理はここに記述する
    })
    .catch(function(err) {
    // レスポンスがエラーで返ってきたときの処理はここに記述する
    });
