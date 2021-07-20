<template>
    <view class="goods-order">
        <view class="order-header">{{_shop_type === 'lx' ? '乐行天下' : '多彩神州'}}</view>
        <view class="order-body">
            <view class="order-location">
                <view class="img-cover">
                    <img src="/static/img/order.svg">
                </view>
                <view class="location-info">
                    <view class="row">
                        <text class="name">{{item.trackingName}}</text>
                        <text class="phone">{{item.trackingPhone}}</text>
                    </view>
                    <view class="row">
                        <text class="location-text">{{item.trackingAddress}}</text>
                    </view>
                </view>
            </view>
            <view class="order-state" @click="handleTap">                
                <view class="img-cover">
                    <img src="/static/img/order.svg">
                </view>
                <view class="order-state-text">
                    <view class="left">{{item.status | statusText}}</view>
                    <view class="right">{{item.status === 1 ? '去付款' : '查看快递单号'}}
                        <text></text>
                    </view>
                </view>
            </view>
            <view class="order-end">       
                <view class="order-title">
                    <view class="left">{{item.itemName}}</view>
                    <view class="right">￥<text>{{item.price/100}}</text></view>
                </view>
            </view>
        </view>
        <view class="order-detail" v-if="showDetail">
            <view class="mask"></view>
            <view class="detail-box">
                <view class="box-header">
                    物流详情
                </view>
                <view class="box-body">
                    <view class="box-row">
                        <text class="left">                          
                            {{item.itemName}}
                        </text>
                        <text class="right">  
                           x {{item.count}}
                        </text>
                    </view>
                    <view class="box-row">
                        <text class="left">快递单号</text>
                        <text class="right">{{item.status === 3 ? item.trackingNumber : '暂未发货'}}</text>
                    </view>
                    <view class="box-row">
                        <text class="left">收件人</text>
                        <text class="right">{{item.trackingName}}</text>
                    </view>
                    <view class="box-row">
                        <text class="left">联系方式</text>
                        <text class="right">{{item.trackingPhone}}</text>
                    </view>
                    <view class="box-row">
                        <text class="left">收件地址</text>
                        <text class="right">{{item.trackingAddress}}</text>
                    </view>
                </view>
                <view class="box-end">
                    <view class="confirm-btn" @click="closeDetail">
                        确定
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import md5 from '../libs/md5.min.js'
import { _shop_type, currentAppid, payKey } from '../libs/envLib'
export default {
    name: 'goodsOrder',
    props: {
        item: {
            Type: Object,
            requiery: true
        }
    },
    data() {
        return {
            showDetail: false
        }
    },
    filters: {
        statusText (val) {
			// 0. 已取消，1. 待付款，2. 待发货，3. 已发货
			let arr = [ '已取消', '待付款', '待发货', '已发货' ]

			return arr[val]
        }
    },
    methods: {
        handleTap () {
            if (this.item.status !== 1) {
                this.showDetail = true
                return
            }
            if (this.item.status === 1) {
                this.startPay()
            }
        },
        closeDetail () {
            this.showDetail = false
        },
        startPay () {
            let that = this
            // 微信支付流程
            uni.login({
                success: function(res){ 
                    if(res.code) {
                        let params = {
                            code: res.code,
                            orderId: that.item.id
                        }
                        // console.log(res.code)
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
                    console.log(err)                      
                    that.$tip.toast(`支付失败`,'none') 
                },
                complete: function() {                   
                    uni.navigateBack()
                },
            })
        },  
    },
}
</script>

<style>
    .goods-order {        
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 333upx;
        background: #fff;
        border-radius: 12px;
        margin-bottom: 20upx;
    }
    .order-header {
        width: 100%;
        text-align: left;
        height: 41upx;
        line-height: 41upx;
        font-size: 24upx;
        padding-left: 20upx;
        border-bottom: 1px solid #EDEDED;
    }
    .order-body {
        width: 100%;
        padding-left: 20upx;
        padding-right: 20upx;
    }
    .order-location ,.order-state, .order-end{
        display: flex;
        align-items: center;
        height: 98upx;
        width: 100%;
        font-size: 13px;
        border-bottom: 1px solid #EDEDED;
    }
    .order-location .img-cover{
        background: #FF900E;
    }
    .order-state .img-cover{
        background: #0054FF;
    }
    .order-detail .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
        opacity: .5;
        z-index: 2;
    }
    .order-detail .detail-box {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        margin-top: 250upx;
        width: 580upx;
        background: #fff;
        border-radius: 10px;
        z-index: 3;
    }
    .box-header {
        height: 76upx;
        line-height: 76upx;
        text-align: center;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        font-weight: 700;
    }
    .box-body {        
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    .box-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #3D3D3D;
        margin-bottom: 5px;
    }
    .box-row text {
        flex-shrink: 0;
        word-break: break-word;
    }
    .box-row .right {
        max-width: 350upx;
    }
    .box-end {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 164upx;
    }
    .confirm-btn {
        width: 400upx;
        height: 62upx;
        line-height: 62upx;
        text-align: center;
        font-size: 14px;
        border-radius: 10px;
        background:linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));
        color: #fff;
    }
    .img-cover {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        width: 60upx;
        height: 60upx;
        margin-right: 20upx;
        border-radius: 50%;
    } 
    .img-cover img{
        width: 31upx;
        height: 36upx;
    }
    .location-info .row {
        display: flex;
        align-items: center;
        max-width: 600upx;
    }
    .location-info .row .name {
        margin-right: 19upx;
    }
    .location-info .row .phone {
        margin-right: 19upx;
        color:#A5A5A5;
    }
    .location-text {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .order-state-text {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .order-state-text .right {
        position: relative;
        margin-right: 30upx;
        color: #9A9A9A;
        font-size: 12px;
    }
    .order-state-text .right > text{     
        position: absolute;  
        top: 12upx; 
        display: inline-block;
        width: 6px;
        height: 6px;
        border: 1px solid #9A9A9A;
        transform: rotate(45deg);
        border-left: transparent;
        border-bottom: transparent;
    }   
    .order-end {
        border:none
    }
    .order-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
    } 
    .order-title .right text{
        color: #FFCC00;
    }
</style>