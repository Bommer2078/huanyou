
<template>
    <view class="order-detail">
        <template v-if="orderType == 1">
            <ticket-item :ticket-item="item" :index="index" :key="index" v-for="(item,index) in detailArr1"></ticket-item>
        </template>
        <template v-if="orderType == 2 && detailObj">
           <view class="goods-order-detail">
               <view class="venue-tab" @click="intoVenueDetail">
                   <text class="venue-name">{{detailObj.specialItemVenueName}}</text>
                   <text class="arrow"></text>
               </view>
               <view class="order-info">
                   <text class="order-name">{{detailArr2.itemName}}</text>
                   <text class="order">共包含 {{detailArr2.length}} 张，剩余 {{leftNum}} 张可以使用</text>
               </view>
               <view class="QR-container">
                   <view class="finish" v-if="leftNum === 0">已使用</view>
                   <tki-qrcode :class="{'gery': leftNum === 0}" size="400" unit="upx" background="transparent" :onval="true" @result="qrR" :val="QRStr"  ref="orderQrcode"></tki-qrcode>
               </view>
           </view>
        </template>
    </view>
</template>

<script>
import ticketItem from '../../components/ticket-item'
import tkiQrcode from "../../components/tki-qrcode"
export default {
    data() {
        return {
            orderId: '',
            detailArr1: [],
            detailArr2: [],
            detailObj: null,
            orderType: '0',
            QRStr: '',
            src: ''
        }
    },
    components: {
        ticketItem,
        tkiQrcode
    },
    computed: {
        leftNum() {
            let temp = 0
            this.detailArr2.forEach(ele => {
                if (!ele.binding) {
                    temp ++
                }
            })
            return temp
        }
    },
    onLoad(option){
        this.orderId = option.orderId
        this.orderType = option.orderType
    },
    created() {
        this.$nextTick(() => {            
            this.getOrderDetail()
        })
    },    
    onShareAppMessage: function( options ){
        console.log('options',options)
        let btnId = options && options.target && options.target.id
        this.putShareInfo(btnId)
        let shareObj = {   
            title: "转赠联票",    
    　　　　 path: '/pages/main/main'
        }
        return shareObj
    },
    methods: {
        qrR(res) {
            this.src = res
        },         
        creatQrcode() {
            this.changeQR()
            this.$nextTick(() => {                    
                this.$refs.orderQrcode && this.$refs.orderQrcode._makeCode()
            })
        },
        intoVenueDetail () {
            uni.navigateTo({
                url: `/pages/venueDetail/venueDetail?id=${this.detailObj.specialItemVenueId}`
            })
        },
        async getOrderDetail () {
            let params = {
                orderId : this.orderId
            }
            let res = await this.$api.getOrderDetail(params)
            if (res.code === '0') {
                this.detailObj = JSON.parse(JSON.stringify(res.data))
                if (this.orderType == 1) {                    
                    this.detailArr1 = JSON.parse(JSON.stringify(res.data.ticketDOList))
                } else if (this.orderType == 2) {
                    this.detailArr2 = JSON.parse(JSON.stringify(res.data.ticketDOList))
                }
                this.creatQrcode()
            }
        },
        async putShareInfo (id) {
            if (!id) return
            let tempId = id.split('-')[1]
            let params = {
                forwardedInfo : '',
                ticketId  : tempId
            }
            let res = await this.$api.shareClicked(params)
            if (res.code === '0') {
                console.log('转发接口调用')
            }
        },
        changeQR () {   
            if (this.QRStr) {
                this.$refs.orderQrcode._clearCode()         
            }
            let obj = {
                orderNum: this.detailObj.orderNum
            }
            this.QRStr = JSON.stringify(obj)
        },
    },
}
</script>

<style>
    .order-detail {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 53upx;
        background: #F3F3F3;
    }
    .goods-order-detail {
        width: 90%;  
        display: flex;
        flex-direction: column;      
        align-items: center;
        color: #353535;
    }
    .venue-tab {    
        display: flex;
        align-items: center;
        justify-content: space-between;    
        width: 100%;
        height: 30px;
        font-size: 14px;
        background: #fff;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 5px 5px 0 0;
        margin-bottom: 4px;
    }
    .order-info { 
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;   
        height: 75px;
        padding: 10px;
        padding-bottom: 15px;
        font-size: 14px;    
        background: #fff;
        border-bottom: 2px dashed #f3f3f3;
    }
    .order-info::before,
    .order-info::after{
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f3f3f3;
        bottom: -10px;
        right: -10px;
        z-index: 1;
    }
    .order-info::after {
        left: -10px;
    }
    .gery {
        opacity: .2;
    }
    .finish {
        position: absolute;
        width: 100px;
        text-align: center;
        height: 40px;
        line-height: 40px;
        background: #FFCC00;
        opacity: 1;
        z-index: 1;
    }
    .QR-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding-top: 50px;
        padding-bottom: 50px;
        background: #fff;
        border-radius: 0 0 5px 5px;
    }
    .arrow {        
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