<template>
    <view class="ticket-order" @click="handleTap">
        <view class="order-header">
            <text class="location">{{item.itemPlaceName || '特惠票'}}</text>
            <text class="order-num">{{item.count}}张票</text>
        </view>
        <view class="order-info">
            <view class="row-item">               
                <view class="ticket-title"> 
                    <img class="ticket-icon" src="/static/img/icon.png">
                    <text>
                        {{item.itemName}}
                    </text>
                </view>                
                <text class="ticket-pirce">                    
                    ￥{{item.price/100}}                        
                </text>
            </view>
            <view class="row-item">          
                <text class="item-left">
                    购买时间：{{$timeText(item.createTime)}}
                </text>
                <text class="item-right">
                    总价：{{item.price/100}}
                </text>
            </view>
        </view>
        <view class="order-bottom">                  
            <text class="item-left" v-if="item.status === 3">
                {{item | bindText}}
            </text>
            <text class="item-left" v-if="item.status === 1">
                去付款
            </text>
            <view class="item-right icon-arrow">
            </view>
        </view>
    </view>
</template>

<script>
import md5 from '../libs/md5.min.js'
import { currentAppid, payKey } from '../libs/envLib'
export default {
    name: 'ticketOrder',
    props: {
        item: {
            type: Object,
            default: null
        }
    },
    filters: {
        bindText (val) {
            if (val.unBoundNum > 0) {
                return '去绑定'
            } else {
                return '已绑定'
            }
        }
    },
    methods: {
        intoDetail () {
            uni.navigateTo({
                url: `../orderDetail/orderDetail?orderId=${this.item.id}&orderType=${this.item.itemType}`
            })
        },
        handleTap () {
            if (this.item.status === 3) {
                this.intoDetail()
                return
            }
            if (this.item.status === 1) {
                this.startPay()
            }
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
                    that.$emit('reflash') 
                },
                fail: function(err) {  
                    console.log(err)                      
                    that.$tip.toast(`支付失败`,'none') 
                }
            })
        },  
        // async payConfirmBack () {
        //     let res = await this.$api.payConfirm(this.item.id)
        //     if (res.code === '0') {
        //         this.$tip.toast('支付成功','none')
        //         this.$emit('reflash')
        //     }
        // }
    },
}
</script>

<style>
    .ticket-order {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 297upx;
        padding-left: 26upx;
        padding-right: 26upx;
        background: #fff;
        border-radius: 12px;
    }
    .order-header,.row-item,.order-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .order-header {
        height: 60upx;
        line-height: 60upx;
        border-bottom: 1px solid #F3F3F3;
    }
    .order-header .location {
        font-size: 15px;
    }
    .order-header .order-num {
        font-size: 14px;
        color: #7C7C7C;
    }
    .order-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 167upx;
        color: #000;
        padding-top: 20upx;
        padding-bottom: 20upx;
        border-bottom: 1px solid #F3F3F3;
    }
    .order-info .ticket-title {
        font-size: 16px;
        font-weight: 700;
        vertical-align: middle;
    }
    .order-info .ticket-pirce,
    .order-info .item-right {
        font-size: 14px;
    }
    .order-info .item-left,    
    .order-bottom .item-left {
        font-size: 15px;
    }
    .order-info .item-right {        
        color: #7C7C7C;
        flex-shrink: 0;
    }
    .order-bottom {
        height: 67upx;
        line-height: 67upx;
    }
    .ticket-icon {
        width: 41upx;
        height: 31upx;
        margin-right: 5px;
        vertical-align: middle;
    }
    .icon-arrow {        
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        border: 1px solid #38210B;
        transform: rotate(45deg);
        border-left: transparent;
        border-bottom: transparent;
    }
</style>