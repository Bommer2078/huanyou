<template>    
    <view class="check-in-content">
        <view class="check-in-banner">
            <img class="bg" src="/static/img/bannerBg.png">
            <view class="check-in-bottom"></view>
            <view class="check-in-container">
                <view class="check-in-header">
                    <image :src="currentTicketObj.bindingPhoto" @click="clickImg" mode="aspectFill"></image>
                    <text class="right">{{currentTicketObj.bindingName}}</text>
                    <view class="cancel-btn">取消绑定</view>
                </view>
                <view class="check-in-body">
                    <view class="item">
                        <text class="left">手机号码</text>
                        <text class="right">{{currentTicketObj.username}}</text>
                    </view>
                    <view class="item">
                        <text class="left">有效时间</text>
                        <text class="right">2019.01.01-2020.01.01</text>
                    </view>
                    <view class="item">
                        <text class="left">联票编码</text>
                        <text class="right">{{currentTicketObj.childCode}}</text>
                    </view>
                </view>
            </view>            
        </view>
        <view class="QRcode">
             <img class="ticket-bg" src="/static/img/checkTicket.png">
             <view class="QRcode-container">
                 <view class="QRcode-header">
                     <view class="title has-icon" @click="switchCurrentTicketType">
                        <text>
                             {{currentTicketObj.itemName}}
                        </text>
                        <view class="switch-icon">
                            <image src="../../static/img/switch.svg"></image>
                        </view>
                    </view>
                     <view class="code">
                         <text>密码</text>
                         <text class="code-num" hover-class="password-open">{{currentTicketObj.password}}</text>
                     </view>
                 </view>
                 <view class="QRcode-body" @click="handleChangeQR">
                     <tki-qrcode size="400" unit="upx" background="transparent" :onval="true" @result="qrR" :val="QRStr"  ref="qrcode"></tki-qrcode>
                 </view>
             </view>
            <view class="left-btn" @tap="goLeft"></view>
            <view class="right-btn" @tap="goRight"></view>
        </view>
    </view>
</template>

<script>
    import tkiQrcode from "../../components/tki-qrcode"
    import { mapState } from 'vuex'
    export default {
        computed: {
            ...mapState(['userInfo']),            
            currentTicketObj() {
                return this.ticketList[this.currentTicket]
            },
        },
        components: {tkiQrcode},
        data() {
            return {
                ticketList: [],
                currentTicket: 0,
                currentTime: '',
                timer: null,
                QRStr: '',
                isChange: false,
                src: ''
            }
        },
        onHide() {
            uni.hideLoading()
            clearInterval(this.timer)
        },
        onShow() {
            this.hasLogin()
            this.openTimer()
        },
        watch: {
            currentTime() {                  
                this.changeQR()
            },
            currentTicket () {                
                this.changeQR()
            }
        },
        methods: {  
            qrR(res) {
                this.src = res
            },   
            clickImg: function(){
                var imgUrl = this.currentTicketObj.bindingPhoto;
                uni.previewImage({
                    urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                })
            }, 
            hasLogin () {
                let hasLogin = !!this.userInfo
                if (!hasLogin) {
                    this.bindLogin()
                } else {                    
                    this.getTicketList()
                }
            },   
            bindLogin() {
                uni.reLaunch({
                    url: '../login/login',
                });
            },   
            creatQrcode() {
                let temp = new Date()
                this.currentTime = new Date().getTime()
                this.$nextTick(() => {                    
                    this.$refs.qrcode._makeCode()
                })
            },
            openTimer() {                
                //定时刷新
                this.timer = setInterval(() => {
                    this.currentTime = new Date().getTime()
                },120000)
            },
            handleChangeQR () {
                if (this.isChange) {
                    return
                }                
                this.isChange = true
                setTimeout(() => {
                    this.isChange = false
                },2000)
                this.currentTime = new Date().getTime()
            },
            changeQR () {   
                if (this.QRStr) {
                    this.$refs.qrcode._clearCode()         
                }
                let code = this.currentTicketObj.childCode
                let pcode = this.currentTicketObj.password
                let un = this.currentTicketObj.username
                let t = this.currentTime
                let obj = {
                    code,pcode,un,t
                }
                this.QRStr = JSON.stringify(obj)
            },
            goRight () {
                if ( this.ticketList.length - 1 > this.currentTicket) {
                    this.currentTicket++
                } else {
                    this.$tip.toast('没有更多了','none')
                }
            },
            goLeft () {                
                if ( this.currentTicket <= 0) {                    
                    this.$tip.toast('没有更多了','none')
                } else {
                    this.currentTicket--
                }
            },
            switchCurrentTicketType () {

            },
            async getTicketList () {
                let params = {
                    pageNum: 1,
                    pageSize: 100,
                    username: this.userInfo.username
                }
                const res = await this.$api.bindTicketList(params)
                if (res.code === '0') {
                    if (res.data.list.length > 0) {
                        this.ticketList = res.data.list
                        setTimeout(() => {
                            this.creatQrcode()
                        }, 500);
                    } else {
                        this.$tip.toast('还未绑定联票,请先去绑定','none')
                        uni.redirectTo({
                            url: '/pages/bindTicket/bindTicket'
                        })
                    }
                }
            }
        }
    }
</script>

<style>
.check-in-content {
    width: 100%;
    min-height: 100vh;
    background: #F3F3F3;
}
.check-in-banner {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 500upx;
    margin-bottom: 60rpx;
}
.check-in-banner .bg{
    position: absolute;
    top: 0;
    width: 100%;
}
.check-in-bottom {    
    position: absolute;
    top: 50upx;
    width: 86%;
    height: 450upx;
    border-radius: 8px;
    background: #fff;
    opacity: .9;
    z-index: 1;
    box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
}
.check-in-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 50upx;
    width: 86%;
    height: 450upx;
    border-radius: 8px;
    z-index: 2;
}
.check-in-container .check-in-header {
    width: 100%;
    position: absolute;
    top: -33upx;
    overflow: hidden;
    flex-shrink: 0;    
    padding-left: 67upx;
    overflow: hidden;
}
.check-in-container .check-in-header image{
    width: 192upx;
    height: 192upx;
    opacity: 1;
    vertical-align: middle;
    border-radius: 16px;
    margin-right: 19upx;
}
.check-in-container .check-in-header text {
    font-weight: 700;
    font-size: 36upx;
}
.check-in-body {
    position: absolute;
    bottom: 20upx;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-left: 90upx;
    padding-right: 100upx;
}
.check-in-body .item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 30upx;
    font-size: 14px;
}
.check-in-body .item .left {
    color: #5F5F5F;
    margin-right: 9upx;
}
.check-in-body .item .right {
    display: inline-block;
    width: 320upx;
    height: 22px;
    line-height: 22px;
    background: #FFF4CA;
    text-align: center;
    border-radius: 4px;
}
.cancel-btn {
    position: absolute;
    top: 50upx;
    right: -20upx;
    width: 160upx;
    height: 50upx;
    background: linear-gradient(-53deg, #FF900E, #FFCC00);
    border-radius: 25upx;
    font-size: 26upx;
    text-align: center;
    color: #fff;
    line-height: 50upx;
}
.QRcode {
    position: relative;
    width: 576upx;
    height: 612upx;
    margin: 0 auto;
    margin-bottom: 20upx;
    border-radius: 17px;
} 
.QRcode .ticket-bg{    
    position: absolute;    
    width: 576upx;
    height: 612upx;
}
.QRcode-container {       
    position: absolute; 
    padding-left: 20upx;   
    padding-right: 20upx;   
    padding-top: 20upx;   
    width: 576upx;
    height: 612upx;
    z-index: 1;
}
.QRcode-container .QRcode-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 22upx;
}
.QRcode-header .title text{
    color:#5A4705;
    font-size: 36upx;
    color: #fff;
    font-weight: 700;
}
.QRcode-header .title{
    height: 75upx;
    background: linear-gradient(360deg, #FF900E, #FFCC00);
    border-radius: 4px;
    text-align: center;
    line-height: 75upx;
    /* margin-top: -51upx; */
    position: relative;
    padding-left: 30upx;
    padding-right: 30upx;
    top: -50upx;
}
.QRcode-header .has-icon {
    padding-right: 50upx;
}
.QRcode-header .code {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #000;
    margin-bottom: 20upx;
    position: relative;
    bottom: 30upx;
}
.code .code-num {
    display: inline-block;
    width: 312upx;
    height: 16px;
    margin-left: 9px;
    color: #390C0C;
    text-align: center;
    font-size: 0;
    border-radius: 4px;
    background: #e6e8fa;
}
.code .code-num:hover {    
    font-size: 14px;
    background: #FFF4CA;
}
.password-open{
    font-size: 14px;
    background: #FFF4CA;
}
.QRcode-container .QRcode-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50upx;
}
.left-btn {
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    left: -90upx;
    border-right: 14px solid #FFCB00;
    border-top: 14px solid transparent;
    border-left: 14px solid transparent;
    border-bottom: 14px solid transparent;
}
.right-btn {
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    right: -90upx;
    border-right: 14px solid transparent;
    border-top: 14px solid transparent;
    border-left: 14px solid #FFCB00;
    border-bottom: 14px solid transparent;
}
.switch-icon {
    position: absolute;
    right: 20upx;
    bottom: 20upx;
    width: 20upx;
    height: 20upx;
    border-radius: 50%;
    background: #fff;
    justify-content: center;
    display: flex;
    align-items: center;
}
.switch-icon image {
    width: 80%;
    height: 80%;
}
</style>
