var vm = new Vue({
    el: "#app", // Vue.jsを使うタグのIDを指定
    data: {
        // Vue.jsで使う変数はここに記述する
        mode: "login",
        submitText: "ログイン",
        toggleText: "新規登録",
        user: {
            userId: null,
            password: null,
            confirmPassword: null,
            name: null,
            BMIGroup: null,
            drink: null
        },
        postForm: {
            height: null,
            weight: null
        }
    },
    computed: {
        // 計算した結果を変数として利用したいときはここに記述する
        BMIrange: function () {
            if (this.BMI < 18.5) {
                return "18.5未満"
            }
            if (this.BMI < 25) {
                return "18.5~25.0未満"
            }
            if (this.BMI < 30) {
                return "25.0~30.0未満"
            }
            if (this.BMI < 35) {
                return "30.0~35.0未満"
            }
            if (this.BMI < 40) {
                return "35.0~40.0未満"
            }
            if (40 < this.BMI) {
                return "40.0以上"
            }
        },
        obesityDegree: function () {
            if (this.BMI < 18.5) {
                return "低体重"
            }
            if (this.BMI < 25) {
                return "標準体重"
            }
            if (this.BMI < 30) {
                return "肥満(1度)"
            }
            if (this.BMI < 35) {
                return "肥満(2度)"
            }
            if (this.BMI < 40) {
                return "肥満(3度)"
            }
            if (40 < this.BMI) {
                return "肥満(4度)"
            }
        },
        properWeight: function () {
            if (vm.postForm.height) {
                return Math.round((vm.postForm.height / 100) ** 2 * 22 * 100) / 100;
            }
        },
        weightDiff: function () {
            if (this.BMI) {
                return Math.round((vm.postForm.weight - this.properWeight) * 100) / 100;
            }
        },
        BMI: function () {
            if (vm.postForm.height && vm.postForm.weight) {
                return Math.round(vm.postForm.weight / (vm.postForm.height / 100) ** 2 * 100) / 100;
            }
        }
    },
    created: function () {
        // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    },
    methods: {
        // Vue.jsで使う関数はここで記述する
        toggleMode: function () {
            if (vm.mode == "login") {
                vm.mode = "signup";
                vm.submitText = "新規登録";
                vm.toggleText = "ログイン";
            } else if (vm.mode = "signup") {
                vm.mode = "login";
                vm.submitText = "ログイン";
                vm.toggleText = "新規登録";
            }
        },
        submit: function () {
            if (vm.mode == "login") {
                // APIにPOSTリクエストを送る
                fetch(url + "/user/login", {
                    method: "POST",
                    body: JSON.stringify({
                        "userId": vm.user.userId,
                        "password": vm.user.password
                    })
                }).then(function (response) {
                    if (response.status == 200) {
                        return response.json();
                    }
                    // 200版以外のレスポンスエラーを投げる
                    return response.json().then(function (json) {
                        throw new Error(json.message);
                    });
                }).then(function (json) {
                    // レスポンスが200番で返ってきたときの処理はここに記述する
                    localStorage.setItem("token", json.token);
                    localStorage.setItem("userId", vm.user.userId);
                    localStorage.setItem("name", json.name);
                    localStorage.setItem("BMIGroup", json.BMIGroup);
                    localStorage.href = "./index.html";
                    location.href = "./index.html";
                }).catch(function (err) {
                    // レスポンスがエラーで返ってきたときの処理はここに記述する
                    console.log(err);
                })
            } else if (vm.mode == "signup") {
                if (vm.user.password != vm.user.confirmPassword) {
                    alert("パスワードが一致しません");
                    return vm.user.confirmPassword = null;
                }
                // APIにPOSTリクエストを送る
                fetch(url + "/user/signup", {
                    method: "POST",
                    body: JSON.stringify({
                        "userId": vm.user.userId,
                        "password": vm.user.password,
                        "name": vm.user.name,
                        "BMIGroup": vm.user.BMIGroup,
                        "drink": vm.user.drink
                    })
                }).then(function (response) {
                    if (response.status == 200) {
                        return response.json();
                    }
                    // 200版以外のレスポンスエラーを投げる
                    return response.json().then(function (json) {
                        throw new Error(json.message);
                    });
                }).then(function (json) {
                    // レスポンスが200番で返ってきたときの処理はここに記述する
                    location.href = "./login.html";
                }).catch(function (err) {
                    // レスポンスがエラーで返ってきたときの処理はここに記述する
                    console.log(err);
                })
            }
        },
        toggleJoin: function () {
            if (vm.user.drink) {
                vm.user.drink = false;
            } else {
                vm.user.drink = true;
            }
        }
    },
});
