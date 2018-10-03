if (!localStorage.getItem("token")) { location.href = "./login.html" }

var vm = new Vue({
    el: "#app", // Vue.jsを使うタグのIDを指定
    data: {
        // Vue.jsで使う変数はここに記述する
        user: {
            userId: null,
            password: null,
            confirmPassword: null,
            name: null,
            BMIGroup: null,
            drink: null
        }
    },
    computed: {
        // 計算した結果を変数として利用したいときはここに記述する
    },
    created: () => {
        // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
        // APIにGETリクエストを送る
        fetch(`${url}/user?userId=${localStorage.getItem("userId")}`, {
            method: "GET",
            headers: new Headers({
                "Authorization": localStorage.getItem("token")
            })
        }).then(function (response) {
            if (response.status == 200) {
                return response.json();
            }
            // 200番以外のレスポンスはエラーを投げる
            return response.json().then(function (json) {
                throw new Error(json.message);
            });
        }).then(function (json) {
            // レスポンスが200番で返ってきたときの処理はここに記述する
            vm.user.userId = json.userId;
            vm.user.name = json.name;
            vm.user.BMIGroup = json.BMIGroup;
            vm.user.drink = json.drink;
        }).catch(function (err) {
            // レスポンスがエラーで返ってきたときの処理はここに記述する
            console.log(err);
        });
    },
    methods: {
        // Vue.jsで使う関数はここで記述する
        submit: function () {
            if (vm.user.password != vm.user.confirmPassword) {
                alert("パスワードが一致しません");
                return vm.user.confirmPassword = null;
            }
            // APIにPOSTリクエストを送る
            fetch(url + "/user", {
                method: "PUT",
                headers: new Headers({
                    "Authorization": localStorage.getItem("token")
                }),
                body: JSON.stringify({
                    "userId": localStorage.getItem("userId"),
                    "password": vm.user.password,
                    "name": vm.user.name,
                    "BMIGroup": Number(vm.user.BMIGroup),
                    "drink": vm.user.drink
                })
            }).then(function (response) {
                if (response.status == 200) {
                    return response.json();
                }
                // 200番以外のレスポンスはエラーを投げる
                return response.json().then(function (json) {
                    throw new Error(json.message);
                });
            }).then(function (json) {
                // レスポンスが200番で返ってきたときの処理はここに記述する
                localStorage.setItem("BMIGroup", Number(vm.user.BMIGroup));
                location.href = "./index.html"
            }).catch(function (err) {
                // レスポンスがエラーで返ってきたときの処理はここに記述する
                console.log(err);
            });
        },
        deleteUser: function () {
            const deleteUser = confirm("退会しますか？");
            if (!deleteUser) { return; }
            // APIにPOSTリクエストを送る
            fetch(url + "/user", {
                method: "DELETE",
                headers: new Headers({
                    "Authorization": localStorage.getItem("token")
                }),
                body: JSON.stringify({
                    "userId": localStorage.getItem("userId")
                })
            }).then(function (response) {
                if (response.status === 200) {
                    return response.json();
                }
                // 200番以外のレスポンスはエラーを投げる
                return response.json().then(function (json) {
                    throw new Error(json.massage);
                });
            }).then(function (json) {
                // レスポンスが200番で返ってきたときの処理はここに記述する
                location.href = "./login.html";
            }).catch(function (err) {
                // レスポンスがエラーで返ってきたときの処理はここに記述する
                console.log(err);
            });
        },
        toggleJoin: function () {
            if (vm.user.drink == "true") {
                vm.user.drink = "false";
            } else {
                vm.user.drink = "true";
            }
        }
    }
});
