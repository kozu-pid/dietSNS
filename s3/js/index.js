if (!localStorage.getItem("token")) {
    location.href = "./login.html"
}

var vm = new Vue({
    el: "#app", // Vue.jsを使うタグのIDを指定
    data: {
        // Vue.jsで使う変数はここに記述する
        userId: localStorage.getItem("userId"),
        postForm: {
            text: null,
            BMIGroup: null,
            category: null,
        },
        posts: [],
        query: {
            userId: null,
            start: null,
            end: null,
            BMIGroup: null
        },
        imageForm: {
            image: null,
        },
        uploadedImage: "",
        uploadedImages: [],
        images: []
    },
    computed: {
        // 計算した結果を変数として利用したいときはここに記述する
        sortedPosts: function () {
            let result = this.posts;
            console.log(this.posts);

            result.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            result.forEach(function (target) {
                return target.date = new Date(target.timestamp).toLocaleString();
            });
            return result;
        }
    },
    created: function () {
        // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
        fetch(url + `/posts?BMIGroup=${localStorage.getItem("BMIGroup")}`, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(function (response) {
            if (response.status == 200) {
                return response.json();
            }
            // 200番以外のレスポンスはエラーを投げる
            return response.json().then(function (json) {
                throw new Error(json.message);
            });
        }).then(function (json) {
            vm.posts = json.posts;
        }).catch(function (err) {
            console.log(err);
        });
    },
    methods: {
        // Vue.jsで使う関数はここで記述する
        post: function () {
            var imageData = "";
            var vm = this;
            for (var i = 0; i < this.images.length; i++) {
                console.log(this.images[i].thumnail);
                imageData += this.images[i].thumnail + ",";
            }

            fetch(url + "/post", {
                method: "POST",
                headers: new Headers({
                    "Authorization": localStorage.getItem("token")
                }),
                body: JSON.stringify({
                    "userId": localStorage.getItem("userId"),
                    "text": vm.postForm.text,
                    "BMIGroup": localStorage.getItem("BMIGroup"),
                    "name": localStorage.getItem("name"),
                    "category": vm.postForm.category,
                    "imageData": imageData,
                })
            }).then(function (response) {
                if (response.status == 200) {
                    // 画像欄を初期化する
                    vm.images = [];
                    return response.json();
                }
                // 200番以外のレスポンスはエラーを投げる
                return response.json().then(function (json) {
                    throw new Error(json.message);
                });
            }).then(function (json) {
                vm.posts.unshift(json);
                vm.postForm.text = null;
            }).catch(function (err) {
                console.log(err);
            });
        },
        deletePost: function (post) {
            fetch(url + "/post", {
                method: "DELETE",
                headers: new Headers({
                    "Authorization": localStorage.getItem("token")
                }),
                body: JSON.stringify({
                    "userId": localStorage.getItem("userId"),
                    "timestamp": post.timestamp
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
                const INDEX = vm.posts.indexOf(post);
                vm.posts.splice(INDEX, 1);
            }).catch(function (err) {
                console.log(err);
            });
        },
        nice: function (post) {
            //likedUser内に名前の無い時
            if (post.likedUser.indexOf(vm.userId) == -1) {
                fetch(url + "/post", {
                    method: "PUT",
                    headers: new Headers({
                        "Authorization": localStorage.getItem("token")
                    }),
                    body: JSON.stringify({
                        "userId_nice": vm.userId,
                        "timestamp": post.timestamp,
                        "userId_post": post.userId,
                        "likedUser": post.likedUser + "," + vm.userId,
                        "BMIGroup": post.BMIGroup,
                        "nice": post.nice + 1,
                        "category": post.category,
                        "name": post.name,
                        "text": post.text
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
                    console.log(json);
                }).catch(function (err) {
                    console.log(err);
                });
                post.nice++;
                post.likedUser = post.likedUser + "," + vm.userId;
            }
            //ここの判定はできてる
            else if (vm.userId !== post.userId) {
                var a = post.likedUser.replace("," + vm.userId, "");
                fetch(url + "/post", {
                    method: "PUT",
                    headers: new Headers({
                        "Authorization": localStorage.getItem("token")
                    }),
                    body: JSON.stringify({
                        "userId_nice": vm.userId,
                        "timestamp": post.timestamp,
                        "userId_post": post.userId,
                        "likedUser": a,
                        "BMIGroup": post.BMIGroup,
                        "nice": post.nice - 1,
                        "category": post.category,
                        "name": post.name,
                        "text": post.text
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
                    console.log(json);
                }).catch(function (err) {
                    console.log(err);
                });
                post.nice--;
                post.likedUser = a;
            }
        },
        //nice!ボタンの中身を切り替える
        niceButton: function(likedUser,userId_nice){
            if (likedUser.indexOf(userId_nice) == -1) {
                return true;
            }
            else{
                return false;
            }
        },

        onFileChange: function (e) {
            var files = e.target.files || e.dataTransfer.files;
            for (var file of files) {
                this.createImage(file);
            }
        },
        // アップロードした画像を表示
        createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var obj = {};
            var vm = this;
            reader.onload = function (e) {
                obj.thumnail = e.target.result;
                obj.uploadFile = file;
                obj.name = file.name;
                vm.images.push(obj);
            };
            reader.readAsDataURL(file);
        },
    },
});
