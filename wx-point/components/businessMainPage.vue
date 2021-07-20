<template>
    <view class="business-banner">
        <img class="bg" src="/static/img/bannerBg.png">
        <view class="business-container">
            <view class="business-body">                    
                <view class="part" @click="startScan(1)">
                    <img src="/static/img/business/check1.png">
                    <text>联票验证</text>
                </view>
                <view class="part" @click="startScan(2)">
                    <img src="/static/img/business/check2.png">
                    <text>票务验证</text>
                </view>
                <view class="part" @click="ticketInfo(1)">
                    <img src="/static/img/business/info.png">
                    <text>联票说明</text>
                </view>
                <view class="part" @click="ticketInfo(2)">
                    <img src="/static/img/business/intro.png">
                    <text>票务说明</text>
                </view>
            </view>
        </view>  
        <template v-if="showBox">            
            <view class="mask" @click="closeBox('showBox')"></view>
            <view class="box" @click="closeBox('showBox')">
                <view class="title">
                    票务说明
                </view>
                <view class="box-name">{{userInfo.description}}</view>
            </view>  
        </template>     
        <template v-if="showNumChoseBox">            
            <view class="mask" @click="closeBox('showNumChoseBox')"></view>
            <view class="num-box">
                <view class="title">
                    选择数量
                </view>
                <view class="box-name">
                    <view class="num-change">
                        <view class="reduce" @click="reduceNum">-</view>
                        <view class="num-input">{{count}}</view>
                        <view class="add" @click="addNum">+</view>
                    </view>
                </view>                
                <view class="btn" @click="confirmScan">确认</view>
            </view>  
        </template>     
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'businessMainPage',    
    computed: {
        ...mapState(['userInfo'])
    },
    data() {
        return {
            showBox: false,
            showNumChoseBox: false,
            count: 1
        }
    },
    watch: {
        showNumChoseBox (nval) {
            if (nval) {
                this.count = 1
            }
        }
    },
    methods: {
        startScan (type) {
            let that = this
            if (type === 2) {
                this.showNumChoseBox = true
                return
            }
            uni.scanCode({
                onlyFromCamera: true,
                scanType: 'QR_CODE',
                success (res) {
                    that.postData(res.result)
                },
                fail () {
                    that.$tip.toast('扫描失败,请重试','none')
                }
            })
        },
        confirmScan () {
            let that = this
            uni.scanCode({
                onlyFromCamera: true,
                scanType: 'QR_CODE',
                success (res) {
                    that.postGoodsData(res.result)
                },
                fail () {
                    that.$tip.toast('扫描失败,请重试','none')
                }
            })
        },
        reduceNum () {
            if (this.count > 1) {
                this.count --
            }
        },
        addNum () {
            this.count ++
        },
        ticketInfo (type) {
            if (type === 1) {                
                this.$tip.toast('功能暂未开放，敬请期待','none')
                return
            }
            this.showBox = true
        },
        closeBox (type) {
            this[type] = false
        },
        async postData (val) {
            let temp = null
            try {
            console.log(val)
                temp = JSON.parse(val)
            } catch (error) {                
                this.$tip.alertDialog('请使用本公司提供的二维码')
                return 
            }
            if (!temp.code || !temp.pcode || !temp.un) {                           
                this.$tip.alertDialog('请使用正确二维码')
                return 
            }
            let now = new Date().getTime()
            if (now - temp.t > 120000) {
                this.$tip.alertDialog('该二维码已超过两分钟有效时间，请提示用户刷新二维码后重试')
                return 
            }
            let params = {
                childCode : temp.code,
                password : temp.pcode,
                username : temp.un
            }
            const res = await this.$api.writeOffYearTicket(params)
            if (res.code === '0') {                
                this.$tip.alertDialog('核销成功!')
            } else {
                this.$tip.alertDialog(`核销失败! ${res.message}`)
            }
            this.closeBox('showNumChoseBox')
        },
        async postGoodsData (val) {
            let temp = JSON.parse(val)
            let params = {
                count  : this.count,
                orderNum : temp.orderNum
            }
            const res = await this.$api.writeOffSpecialTicket(params)
            if (res.code === '0') {                
                this.$tip.alertDialog('核销成功!')
            } else {
                this.$tip.alertDialog(`核销失败! ${res.message}`)
            }
        }
    },
}
</script>

<style>
.business-banner {
    position: relative;
    width: 100%;
    height: 454upx;
    margin-bottom: 5px;
}
.business-banner .bg{
    position: absolute;
    width: 100%;
}
.business-container {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 1;
}
.business-body  {
    display: flex;
    flex-wrap: wrap;
    width: 716upx;
    height: 746upx;
    overflow: hidden;
    border-radius: 14px;
    font-size: 0;
    box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
}
.business-container .part {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 50%;
    height: 373upx;
    background: #fff;
}
.business-container .part img{
    width: 124upx;
    height: 124upx;
    margin-bottom: 18upx;
}
.business-container .part text{
    font-size: 16px;
    color: #38210B;
}
.business-container .part:nth-child(1) {
    border-right: 1px solid #F3F3F3;
    border-bottom: 1px solid #F3F3F3;
}
.business-container .part:nth-child(2) {
    border-left: 1px solid #F3F3F3;
    border-bottom: 1px solid #F3F3F3;
}
.business-container .part:nth-child(3) {
    border-top: 1px solid #F3F3F3;
    border-right: 1px solid #F3F3F3;
}
.business-container .part:nth-child(4) {
    border-top: 1px solid #F3F3F3;
    border-left: 1px solid #F3F3F3;
}
.box, .num-box{
        position: fixed;
        top: 100upx;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto;
        width: 550upx;
        height: 80vh;
        background: #fff;
        border-radius: 8px;
        box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
        overflow: hidden;
        z-index: 2;
    }
    .box .title ,
    .num-box .title {
        width: 100%;
        height: 60upx;
        text-align: center;
        margin-bottom: 10upx;
        background: #ffcc00;
    }
    .num-box .box-name ,
    .box .box-name {
        width: 100%;
        text-align: left;
        font-size: 13px;
        padding: 20upx;
        margin-bottom: 55upx;
    }
    .num-box {
        top: 325upx;
        height: 35vh;
    }
    .num-box .box-name{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #888;
        opacity: .5;
        z-index: 1;
    }
    .num-box .btn{
        background: #ffcc00;
        width: 310upx;
        height: 80upx;
        line-height: 80upx;
        text-align: center;
    }
.num-change {
    margin-top: 20upx;
    width: 310upx;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
}
.num-change .reduce,
.num-change .add  {
    flex-shrink: 0;
    width: 80upx;
    height: 80upx;
    font-size: 50px;
    line-height: 55upx;
    text-align: center;
    color: #CDCDCD;
    border: 1px solid #CDCDCD;
}
.num-change .add {
    color: #FFCC00;
    border: 1px solid #FFCC00;
}
.num-change .num-input {    
    width: 108upx;
    height: 80upx;
    line-height: 80upx;
    color: #000;
    text-align: center;
    border: 1px solid #CDCDCD;
    font-size: 25px;
}
</style>