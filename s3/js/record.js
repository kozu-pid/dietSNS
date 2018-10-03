if (!localStorage.getItem("token")) { location.href = "./login.html" }

let weight = [], timestamp = [], bmi = [], date = [];
let myChart;

var vm = new Vue({
    el: "#app", // Vue.jsを使うタグのIDを指定
    data: {
        // Vue.jsで使う変数はここに記述する
        userId: localStorage.getItem("userId"),
        postForm: {
            height: 160, // 初期値
            weight: null
        },
        func: null
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
        fetch(url + `/user/record?userId=${localStorage.getItem("userId")}`, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(function (response) {
            vm.func = "permit";
            if (response.status == 200) {
                return response.json();
            }
            // 200番以外のレスポンスはエラーを投げる
            return response.json().then((json) => {
                throw new Error(json.message);
            });
        }).then(function (json) {
            weight = json.weight;
            timestamp = json.timestamp;
            weight.forEach(function (el) {
                bmi.push(Math.round(el / (vm.postForm.height / 100) ** 2 * 100) / 100);
            })
            timestamp.forEach(function (el) {
                date.push(new Date(el).toLocaleDateString());
            });

            myChart = new Chart("myChart", {
                type: "line",
                data: {
                    labels: date,
                    datasets: [{
                        label: "Your weight",
                        data: weight,
                        borderColor: "orange",
                        pointBackgroundColor: "orange",
                        fill: false,
                        yAxisID: "weight",
                    }, {
                        label: "Your BMI",
                        data: bmi,
                        borderColor: "green",
                        pointBackgroundColor: "green",
                        fill: false,
                        yAxisID: "BMI"
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            id: "weight",
                            position: "left"
                        }, {
                            id: "BMI",
                            position: "right",
                            ticks: {
                                max: 30,
                                min: 16,
                            },
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }]
                    }
                }
            });
        }).catch(function (err) {
            console.log(err);
        });

    },
    methods: {
        // Vue.jsで使う関数はここで記述する
        recordPost: function () {
            weight.push(Number(vm.postForm.weight));
            let temp = Date.now()
            timestamp.push(temp);
            bmi.push(Math.round(vm.postForm.weight / (vm.postForm.height / 100) ** 2 * 100) / 100);
            date.push(new Date(temp).toLocaleDateString());
            fetch(url + "/user/record", {
                method: "POST",
                headers: new Headers({
                    "Authorization": localStorage.getItem("token")
                }),
                body: JSON.stringify({
                    "userId": localStorage.getItem("userId"),
                    "height": vm.postForm.height,
                    "weight": weight,
                    "timestamp": timestamp
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
                myChart.update();
            }).catch(function (err) {
                console.log(err);
                location.href = "./record.html";
            });
            vm.postForm.weight = null;
        }
    },
});
