<template>
    <view class="checkin-box">
        <view class="mask" @click.stop></view>
        <view class="checkin-box-cover">
            <view class="title">                
                <image src="../static/img/titleIcon.svg" class="title-icon" />
                <text>核销扫码</text> 
                <image src="../static/img/closeBox.svg" class="close-icon" @click="closeBox"/>
            </view>
            <view class="header" @click="clickImg">
                <image :src="boxInfo.bindingPhoto"/>
            </view>
            <view class="name">
                {{boxInfo.bindingName}}
            </view>
            <view class="QR-code" @click="handleChangeQR">
                <tki-qrcode size="420" unit="upx" background="transparent" :onval="true" @result="qrR" :val="QRStr"  ref="qrcode"></tki-qrcode>
            </view>
        </view>
    </view>
</template>

<script>
import tkiQrcode from "./tki-qrcode"
export default {
    props: {
        boxInfo: {
            type: Object,
            require: true
        },
        showCheckinBox: {
            type: String,
            default: false
        },
    },    
    data() {
        return {
            currentTime: '',
            timer: null,
            QRStr: '',
            isChange: false,
            src: ''
        }
    },
    watch: {
        currentTime() {                  
            this.changeQR()
        }
    },
    created() {        
        this.creatQrcode()
        this.openTimer()
    },
    destroyed() {        
        clearInterval(this.timer)
    },
    components: {tkiQrcode},
    methods: {
        closeBox () {
            this.$emit('closeBox')
        },
        openTimer() {                
            //定时刷新
            this.timer = setInterval(() => {
                this.currentTime = new Date().getTime()
            },120000)
        },
        qrR(res) {
            this.src = res
        },  
        clickImg: function(){
            var imgUrl = this.boxInfo.bindingPhoto;
            uni.previewImage({
                urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        },
        creatQrcode() {
            let temp = new Date()
            this.currentTime = new Date().getTime()
            this.$nextTick(() => {                    
                this.$refs.qrcode._makeCode()
            })
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
            let code = this.boxInfo.childCode
            let pcode = this.boxInfo.password
            let un = this.boxInfo.username
            let t = this.currentTime
            let obj = {
                code,pcode,un,t
            }
            this.QRStr = JSON.stringify(obj)
        },
    },
}
</script>

<style lang="scss" scoped>
.checkin-box {
    .mask{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
        opacity: .5;
        z-index: 100;
    }
    .checkin-box-cover {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30upx;
        margin: auto;
        width: 88vw;
        max-height: 80vh;
        background: #fff;
        border-radius: 8px;
        box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
        overflow: scroll;
        z-index: 101;
        .title {            
            font-size: 38upx;
            font-weight: 400;
            color: #000000;
            margin-bottom: 55upx;
            .title-icon {   
                width: 30upx;
                height: 30upx;
                margin-right: 10upx;
            }
            .close-icon {
                position: absolute;
                width: 40upx;
                height: 40upx;
                right: 10upx;
                top: 10upx;
            }
        }
        .header {
            width: 192upx;
            height: 192upx;
            border-radius: 27upx;
            background: #ccc;
            margin-bottom: 30upx;
            overflow: hidden;
            image {                
                width: 192upx;
                height: 192upx;
            }
        }
        .name {            
            font-size: 36upx;
            font-weight: 500;
            color: #000000;
            margin-bottom: 40upx;
        }
        .QR-code {
            width: 420upx;
            height: 420upx;
        }
    }
}
</style>