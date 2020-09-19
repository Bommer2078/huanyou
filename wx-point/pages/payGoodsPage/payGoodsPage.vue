<template>
    <view class="pay-page">
        <view class="ticket-name">{{goodsObj.name}}</view>
        <view class="ticket-body">
            <view class="item">
                <text class="lable">数量</text>
                <view class="num-change">
                    <view class="reduce" @click="reduceNum">-</view>
                    <view class="num-input">{{count}}</view>
                    <view class="add" @click="addNum">+</view>
                </view>
            </view>
            <view class="item">
                <text class="lable">单价</text>
                <view class="price">￥<text>{{goodsObj.price/100}}</text></view>
            </view>
        </view>
        <view class="ticket-info" v-if="goodsObj.type === 0">
            <view class="item">
                <text class="lable">手机号码</text>
                <input type="text" class="form-input" v-model.trim="phone" placeholder="请输入...">
            </view>
            <view class="item">
                <text class="lable">收件人姓名</text>
                <input type="text" class="form-input" v-model.trim="checkName" placeholder="请输入...">
            </view>
            <view class="item">
                <text class="lable">收件人地址</text>
                <input type="text" class="form-input" v-model.trim="checkAdd" placeholder="请输入...">
            </view>
            <view class="item">
                <view class="total-count">
                    总计：<text>{{totalPrice}}</text>元
                </view>
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
export default {    
    data() {
        return {
            count: 1,
            forbidClick: false,
            orderId: '',
            phone: '',
            checkName: '',
            checkAdd: '',
            goodsObj: null,
            goodsId: ''
        }
    },
    filters: {
        phoneText(val) {
            let arr = val.split('')
            return `${arr.splice(0,3).join('')}****${arr.splice(4,4).join('')}`
        }
    },
    onLoad(option) {
        this.goodsId = option.id
    },    
    created() {
        this.$nextTick(() => {
            this.getGoodsDetail()
        })
    },
    computed: {
        ...mapState(['ticketBaseInfo','userInfo','locationObj']),
        totalPrice() {
            if (this.goodsObj) {                
                return this.count * (this.goodsObj.price/100)
            } else {
                return 1000
            }
        }
    },
    methods: {
        reduceNum () {
            if (this.count > 1) {
                this.count --
            }
        },
        addNum () {
            this.count ++
        },
        creatOrder () {
            if (this.forbidClick) return
            if (!this.checkForm()) return
            // this.$tip.alertDialog('库存不足，敬请期待')
            // return
            this.forbidClick = true
            this.postOrderStatus()
        },
        startPay () {
            let that = this
            // 微信支付流程
            uni.login({
                success: function(res){ 
                    if(res.code) {
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
            let paySign = `appId=wxd56c7ad09b4f58c7&nonceStr=${obj.nonce_str}&package=prepay_id=${obj.prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=2A0D555A40FCF76A664C66CC424E22DC`
            paySign = md5(paySign)
            let that = this
            uni.requestPayment({
                timeStamp: String(timeStamp),
                nonceStr: obj.nonce_str,
                package: `prepay_id=${obj.prepay_id}`,
                signType: 'MD5',
                paySign: paySign,
                success: function() {                    
                    that.$tip.toast('支付成功','none')  
                },
                fail: function(err) {                     
                    that.$tip.toast(`支付失败，请查看订单`,'none') 
                },
                complete: function() {                   
                    uni.navigateBack()
                },
            })
        },
        async postOrderStatus () {            
            let params = {
                count: this.count,
                price: this.totalPrice*100,
                status: 1,
                itemType: this.goodsObj.type === 1 ? 2 : 3, //goodsObj.type = 1 时，订单类型为特惠票
                itemName: this.goodsObj.name,
                username: this.userInfo.username,
                itemId: this.goodsObj.id
            }
            if (this.goodsObj.type === 0) {                
                params.trackingAddress = this.checkAdd
                params.trackingName = this.checkName
                params.trackingPhone = this.phone
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
        async getGoodsDetail() {
            const res = await this.$api.getGoodsDetail(this.goodsId)
            if (res.code === '0' && res.data) {
                this.goodsObj = res.data
            } else {
                this.$tip.toast('网络繁忙请稍后重试','none')
                uni.navigateBack()
            }
        },
        checkForm () {
            if (this.totalPrice <= 0 || !this.userInfo.username || this.count <= 0 || !this.goodsObj) {   
                this.$tip.toast('网路问题，稍后重试','none')
                return false
            }
            if (this.goodsObj.type === 1) return true
            if (this.phone === '') {   
                this.$tip.toast('收件人电话不能为空','none')
                return false
            }
            if (this.checkName === '') {   
                this.$tip.toast('收件人不能为空','none')
                return false
            }
            if (this.checkName === '') {   
                this.$tip.toast('收件人地址不能为空','none')
                return false
            }
            return true
        }
    }
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
.ticket-body {
    color: #000;
}
.ticket-info {
    color: #000;
    margin-bottom: 76upx;
}
.pay-page .ticket-info .item {
    display: flex;
    justify-content: flex-start;
}
.item + .item {
    border-top: 1px solid #eee;
}
.ticket-info .item,
.ticket-body .item {    
    width: 100%;
    justify-content: space-between;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    align-items: center;
    height: 90upx;
}
.item .lable {
    width: 159upx;
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
.form-input {
    width: 340upx;
}
.total-count {
    margin-left: auto;
}
</style>