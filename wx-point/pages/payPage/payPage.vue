<template>
    <view class="pay-page">
        <view class="ticket-name">{{ticketBaseInfo.name}}</view>
        <view class="ticket-body" v-if="sellType.oldPriceRule">
            <view class="item">
                <text class="lable">规格</text>
                <text class="discount-name">{{sellType.priceName}}</text>
                <view class="price">￥<text>{{ticketBaseInfo.price/100}}</text></view>
            </view>
            <view class="num-change-item">
                <text class="discount-type">每份含 1 张票</text>
                <view class="num-change">
                    <view class="reduce" @click="reduceNum(1)">-</view>
                    <view class="num-input">{{count1}}</view>
                    <view class="add" @click="addNum(1)">+</view>
                </view>
            </view>
        </view>
        <view class="ticket-body" v-if="sellType.discountRule">
            <view class="item">
                <text class="lable">规格</text>
                <text class="discount-name">{{sellType.discountPriceName}}</text>
                <view class="price">￥<text>{{ticketBaseInfo.discountPrice/100}}</text></view>
            </view>
            <view class="num-change-item">
                <text class="discount-type">每份含 {{ticketBaseInfo.discountNum}} 张票</text>
                <view class="num-change">
                    <view class="reduce" @click="reduceNum(2)">-</view>
                    <view class="num-input">{{count2}}</view>
                    <view class="add" @click="addNum(2)">+</view>
                </view>
            </view>
            <view class="tip">
                * {{ticketBaseInfo.discountHint}}
            </view>
        </view>
        <view class="ticket-info phone-item" v-if="userInfo">
            <view class="item">
                <text class="lable">手机号码</text>
                <text class="value">{{userInfo.phone | phoneText}}</text>
            </view>
        </view>
        <view class="confirm-btn" @click="creatOrder">
            去支付{{ totalPrice }}元   
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex' 
import md5 from '../../libs/md5.min.js'
import { currentAppid, payKey } from '../../libs/envLib'
export default {    
    data() {
        return {
            count1: 0,
            count2: 0,
            forbidClick: false,
            orderId: '',            
            sellType: {
				oldPriceRule     : false,
				discountRule     : false,
				priceName        : '原价',
				discountPriceName: '套票'
			},
            sellTypeNum: 0,
        }
    },
    filters: {
        phoneText(val) {
            let arr = val.split('')
            return `${arr.splice(0,3).join('')}****${arr.splice(4,4).join('')}`
        }
    },
    computed: {
        ...mapState(['ticketBaseInfo','userInfo','locationObj']),
        totalPrice() {
            let total = 0
            if (this.sellType.oldPriceRule) {
                total += this.count1 * (this.ticketBaseInfo.price) 
            }
            if (this.sellType.discountRule) {
                total += this.count2 * (this.ticketBaseInfo.discountPrice)
            }
            return total/100
        }
    },
    created() {
        this.reflashTicket()
    },
    methods: {
        reduceNum (type) {
            if (this[`count${type}`] === 1 && this.sellTypeNum === 1) {
                return
            }
            if (this[`count${type}`]> 0) {
                this[`count${type}`] --
            }
        },
        addNum (type) {
            this[`count${type}`] ++
        },
        creatOrder () {
            if (this.forbidClick) return
            if (!this.checkForm()) return
            this.forbidClick = true
            this.postOrderStatus()
        },
        startPay () {
            let that = this
            // 微信支付流程
            uni.login({
                success: function(res){ 
                    if(res.code) {
                        console.log(res)
                        let params = {
                            code: res.code,
                            orderId: that.orderId
                        }
                        that.$api.wxPay(params).then((data) => {
                            if (data.code === '0') {
                                that.payConfirm(data.data)
                            } else {
                                that.$tip.toast(`${data.code},${data.message}`,'none')
                            }
                        })
                    }else {
                        that.$tip.toast(`获取微信jscode错误，请稍后重试${res.errMsg}`,'none')
                    }          
                }  
            })
        },
        payConfirm (obj) {
            let timeStamp = new Date().getTime()
            let paySign = `appId=${currentAppid}&nonceStr=${obj.nonce_str}&package=prepay_id=${obj.prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=${payKey}`
            console.log('currentAppid',paySign)
            paySign = md5(paySign)
            let that = this
            uni.requestPayment({
                timeStamp: String(timeStamp),
                nonceStr: obj.nonce_str,
                package: `prepay_id=${obj.prepay_id}`,
                signType: 'MD5',
                paySign: paySign,
                success: function() {                    
                    that.$tip.alertDialog(
                        '支付成功，请跳转订单查看',
                        '好的','不用了').then(() => {
                            uni.redirectTo({
                                url: '../order/order',
                            });
                        }).catch(() => {
                            uni.navigateBack()
                        }) 
                },
                fail: function(err) {                       
                    that.$tip.toast(`支付失败，请查看订单`,'none')                 
                    uni.navigateBack()
                }
            })
        }, 
        async postOrderStatus () {   
            let totalCount = this.count1 + this.count2 * this.ticketBaseInfo.discountNum
            let params = {
                count: totalCount,
                price: this.totalPrice*100,
                status: 1,
                itemType: 1,
                itemPlaceId: this.locationObj.id,
                itemPlaceName: this.locationObj.name,
                itemName: this.ticketBaseInfo.name,
                username: this.userInfo.username,
                itemId: this.ticketBaseInfo.id
            }
            let res = await this.$api.creatOrder(params)
            if (res.code === '0') {
                this.$tip.toast('下单成功','none')
                this.orderId = res.data
                setTimeout(() => {                    
                    this.startPay()
                }, 600);
            }
        },
        // async payConfirmBack () {
        //     let res = await this.$api.payConfirm(this.orderId)
        //     if (res.code === '0') {
        //         this.$tip.toast('支付成功','none')
        //         uni.navigateBack();
        //     }
        // },
        async reflashTicket() {
            const res = await this.$api.getTicketDetail(this.ticketBaseInfo.id)
            if (res.code === '0' && res.data) {
                this.$store.commit('SET_TICKET_OBJ',res.data)
                this.sellType = JSON.parse(this.ticketBaseInfo.sellType)
                if (this.sellType.oldPriceRule) {
                    this.count1 = 1
                    this.count2 = 0
                    this.sellTypeNum += 1
				}
				if (this.sellType.discountRule) {                    
                    this.sellTypeNum += 1
                    this.count1 = 0
                    this.count2 = 1
				}
            } else {
                this.$tip.toast('网络繁忙请稍后重试','none')
                uni.navigateBack()
            }
        },
        checkForm () {
            if (this.totalPrice <= 0) {
                this.$tip.toast('请添加商品数量','none')
                return false
            }
            if (!this.userInfo.username || this.count <= 0 || !this.ticketBaseInfo.id) {   
                this.$tip.toast('网路问题，稍后重试','none')
                return false
            }
            return true
        }
    },
}
</script>

<style>
.pay-page {
    width: 100%;
    background: #F3F3F3;
}
.ticket-name {
    width: 100%;
    height: 50upx;
    line-height: 50upx;
    font-size:13px;
    text-align: center;
}
.price {        
    position: relative;
    font-size: 14px;
}
.price text{
    font-size: 27px;
    font-style: italic;
    font-weight: 700;
    color: #FFCC00;
}
.num-change {
    width: 240upx;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    margin-right: 15upx;
}
.num-change .reduce,
.num-change .add  {
    flex-shrink: 0;
    width: 60upx;
    height: 60upx;
    font-size: 25px;
    line-height: 45upx;
    text-align: center;
    color: #CDCDCD;
    border: 1px solid #CDCDCD;
}
.num-change .add {
    color: #FFCC00;
    border: 1px solid #FFCC00;
}
.num-change .num-input {    
    width: 88upx;
    height: 60upx;
    line-height: 50upx;
    color: #000;
    text-align: center;
    border: 1px solid #CDCDCD;
}
.ticket-body,.ticket-info {
    font-size: 12px;
    background: #fff;
    padding-left: 14upx;
    padding-right: 14upx;
    margin-bottom: 20upx;
}
.tip {
    position: absolute;
    bottom: -20px;
}
.ticket-body {
    position: relative;
    color: #000;
}
.ticket-body + .ticket-body {
    margin-bottom: 70upx;
}
.ticket-info {
    color: #9A9A9A;
    margin-bottom: 76upx;
}
.item + .item {
    border-top: 1px solid #eee;
}
.ticket-info .item,
.ticket-body .item,
.num-change-item {    
    width: 100%;
    justify-content: space-between;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    align-items: center;
    height: 90upx;
}
.item .lable {
    color: #9A9A9A;
    width: 110upx;
}
.phone-item .lable{
    width: 150upx;
}
.discount-name {
    font-size: 16px;
    margin-right: auto;
}
.discount-type {    
    color: #9A9A9A;
}
.item .value,
.item .icon-arrow {
    margin-left: auto;
}
.confirm-btn {
    position: relative;
    width: 78.4%;
    height: 74upx;
    margin: 0 auto;
    font-size: 16px;
    line-height: 74upx;
    text-align: center;
    color: #fff;
    border-radius: 6px;
    background: linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));;
}
</style>