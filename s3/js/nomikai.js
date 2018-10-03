var vm = new Vue({
    el: "#app", // Vue.jsを使うタグのIDを指定
    data: {
        // Vue.jsで使う変数はここに記述する
        users : [],
        query : {
            userId: null,
            name: null,
            drink: null
        }
    },
    computed: {
        // 計算した結果を変数として利用したいときはここに記述する
        filteredUsers: function(){
            var result = this.users;
            var BMIGroup = localStorage.getItem('BMIGroup');
            if(this.query.name){
                result = result.filter(function(target){
                    return (String)(target.name).match(vm.query.name);
                });
            }
            if(this.query.userId){
                result = result.filter(function(target){
                    return (String)(target.userId).match(vm.query.userId);
                });
            }
            if(this.query.drink){
                result = result.filter(function(target){
                    return target.drink == vm.query.drink;
                });
            }
            return result;
        }
    },
    created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
        // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // APIにGETリクエストを送る
        fetch(url + "/users",{
            method: "GET",
            headers: new Headers({
                "Authorization": localStorage.getItem("token")
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
                vm.users = json.users;
            })
            .catch(function(err) {
                // レスポンスがエラーで返ってきたときの処理はここに記述する
            });
    },

    methods: {
    // Vue.jsで使う関数はここで記述する
    },
});
