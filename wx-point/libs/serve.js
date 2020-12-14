import tip from '@/utils/tip'
import store from '@/store'
let baseUrl = 'https://www.gzlxtx.cn/api' //乐行正式环境接口
// let baseUrl = 'http://gzlxtx.cn:8887/api' //乐行测试环境接口
// let baseUrl = 'https://gzlxtx.cn:7777/api' //欢游正式环境接口
// let baseUrl = 'http://gzlxtx.cn:7776/api' //欢游测试环境接口
let httpNum = 0;
let http = {
	post: "",
    get: "",
    put: ''
};
let typeArr = ['/user/register','/ticket/writeOffYearTicket','/ticket/writeOffSpecialTicket']
http.post = (api, data) => {    
    let header = {
        'token': uni.getStorageSync('token'),
        'isApplet': 'true'
    }
    if (typeArr.indexOf(api) >= 0) {              
        header['content-type'] = 'application/x-www-form-urlencoded'
    }
    if (httpNum <= 0) {
        tip.loading();
    }
    httpNum++;
    return new Promise((resolve, reject) => {
        uni.request({
            data:data,
            method:'post',
            url: baseUrl + api,
            header: {
                ...header
            },
            success: function (res) {
                httpNum--;
                if (httpNum <= 0) {
                    tip.loaded();
                }
                if(res.statusCode == 200) {
                    if(res.data.code == '401') {
                        tip.alertDialog('请重新登录').then((val) => {
                            setTimeout(() => {                                
                                store.commit('SET_USER_INFO', null)
                                store.commit('SET_ROLE_TYPE', null)
                            },1000)
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        })
                    } else {
                        resolve(res.data)
                    }
                } else {
                    tip.alertDialog(res.statusCode + '错误，请稍后再试')
                }
            },
            fail:function (err) {
                httpNum--;
                tip.loaded();
                reject(err)
            }
        })
    });
}

http.get = (api, data) => {
    if (httpNum <= 0) {
        tip.loading()
    }
    httpNum++;
    return new Promise((resolve, reject) => {
        uni.request({
            data:data,
            method:'get',
            url: baseUrl + api,
            header: {  
                'token': uni.getStorageSync('token'),       
                'isApplet': 'true'
            },
            success: function (res) {
                httpNum--;
                if (httpNum <= 0) {
                    tip.loaded();
                }
                if(res.statusCode == 200) {
                    if(res.data.code == '401') {
                        tip.alertDialog('请重新登录').then((val) => {
                            store.commit('SET_USER_INFO', null)
                            store.commit('SET_ROLE_TYPE', null)
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        })
                    } else {                            
                        resolve(res.data)
                    }
                } else {
                    tip.alertDialog(res.statusCode + '错误，请稍后再试')
                }
            },
            fail:function (err) {
                httpNum--;
                tip.loaded();
                reject(err)
            }
        })
    });
}

http.delete = (api, data) => {
    if (httpNum <= 0) {
        tip.loading()
    }
    httpNum++;
    return new Promise((resolve, reject) => {
        uni.request({
            data:data,
            method:'delete',
            url: baseUrl + api,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': uni.getStorageSync('token'),
                'isApplet': 'true'
            },
            success: function (res) {
                httpNum--;
                if (httpNum <= 0) {
                    tip.loaded();
                }
                if(res.statusCode == 200) {
                    if(res.data.code == '401') {
                        tip.alertDialog('请重新登录').then((val) => {
                            store.commit('SET_USER_INFO', null)
                            store.commit('SET_ROLE_TYPE', null)
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        })
                    } else {                            
                        resolve(res.data)
                    }
                } else {
                    tip.alertDialog(res.statusCode + '错误，请稍后再试')
                }
            },
            fail:function (err) {
                httpNum--;
                tip.loaded();
                reject(err)
            }
        })
    });
}
http.put = (api, data) => {
    if (httpNum <= 0) {
        tip.loading()
    }
    httpNum++;
    return new Promise((resolve, reject) => {
        uni.request({
            data:data,
            method:'put',
            url: baseUrl + api,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': uni.getStorageSync('token'),
                'isApplet': 'true'
            },
            success: function (res) {
                httpNum--;
                if (httpNum <= 0) {
                    tip.loaded();
                }
                if(res.statusCode == 200) {
                    if(res.data.code == '401') {
                        tip.alertDialog('请重新登录').then((val) => {
                            store.commit('SET_USER_INFO', null)
                            store.commit('SET_ROLE_TYPE', null)
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        })
                    } else {                            
                        resolve(res.data)
                    }
                } else {
                    tip.alertDialog(res.statusCode + '错误，请稍后再试')
                }
            },
            fail:function (err) {
                httpNum--;
                tip.loaded();
                reject(err)
            }
        })
    });
}

export default http;