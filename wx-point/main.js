import Vue from 'vue'
import App from './App'

import store from './store'
import api from './libs/api.js'
import tip from './utils/tip'
import timeText from './utils/timeText'
import commenShare from './libs/commenShare.js'
import QQMapWX from './libs/qqmap-wx-jssdk.min.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$tip = tip
Vue.prototype.$qqmapsdk = new QQMapWX({
    key: 'BAQBZ-ZYOCW-KKURC-OGP6F-Q4TXJ-WMBGQ'
})
Vue.prototype.$timeText = timeText
Vue.prototype.$commenShare = commenShare


App.mpType = 'app'

Vue.filter('rulesText', function (obj) {    
    let rules = obj.rules
    let times = obj.times
    let period = obj.period 
    let relatedRedundancy = null
    try {        
        relatedRedundancy = JSON.parse(obj.relatedRedundancy)
    } catch (error) {
        console.log(error)
    }
    if (relatedRedundancy.mainPageText) return relatedRedundancy.mainPageText
    if (rules === 1) {
        if (period === 2) {
            return `联票绑定照片本人可免费游玩 ${times}次 ，价值${obj.referPrice/100}元`
        } else if (period === 1) {
            return `每月可免费游玩 ${times} 次`
        } else if (period === 0) {
            return `每日可免费游玩 ${times} 次`
        }
    } else {                
        let tempArr = relatedRedundancy.confirmVenueArr
        let tempArr2 = []
        let tempLength = tempArr.length
        let tempIndex = tempArr.findIndex((item) => {
            return item.id === obj.id
        })
        tempArr.splice(tempIndex,1)
        tempArr.forEach(ele => {
            tempArr2.push(ele.text)
        });
        let tempStr = tempArr2.splice(0,2).join(',')
        return `可与${tempStr}等 ${tempLength} 个场馆任选 ${times} 个游玩`
    }
})

const app = new Vue({
    store,
    ...App
})
app.$mount()
