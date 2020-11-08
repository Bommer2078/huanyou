<template>
    <view class="user-content">
        <view class="user-banner">
            <img class="bg" src="/static/img/bannerBg.png">
            <view class="user-bottom"></view>
            <view class="user-container">
                <view class="user-header">
                    <img src="/static/img/logo.png">
                    <view class="info">
                        <text>欢迎，</text>
                        <text class="tip">{{userInfo ? userInfo.username : '游客'}}</text>
                    </view>
                </view>
                <view class="user-body">
                    <view class="item" @click="gotoBindTicket">
                        <img src="/static/img/iconGroup/ticket.svg" >
                        <text class="lable">联票绑定</text>
                        <view class="icon-arrow"></view>
                    </view>
                    <view class="item" @click="gotoAppointmentList">
                        <img src="/static/img/iconGroup/venue.svg">
                        <text class="lable">我的预约</text>
                        <view class="icon-arrow"></view>
                    </view>
                </view>
                <view class="user-body">
                    <view class="item" @click="intoRecord">
                        <img src="/static/img/iconGroup/foot.svg">
                        <text class="lable">我的足迹</text>
                        <view class="icon-arrow"></view>
                    </view>
                    <view class="item" @click="intoOrder">
                        <img src="/static/img/iconGroup/rules.svg">
                        <text class="lable">我的订单</text>
                        <view class="icon-arrow"></view>
                    </view>
                </view>
                <view class="user-body user-body-end">
                    <view class="item" @click="intoChangePassword">
                        <img src="/static/img/iconGroup/set.svg">
                        <text class="lable">修改密码</text>
                        <view class="icon-arrow"></view>
                    </view>
                    <view class="item" @tap="gotoLoginOut">
                        <img src="/static/img/iconGroup/login.svg">
                        <text class="lable">登录设置</text>
                        <view class="icon-arrow"></view>
                    </view>
                </view>
            </view>            
        </view> 
    </view>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                showBox:false
            }
        },
        created() {
            this.hasLogin()
        },
        computed: {
            ...mapState(['userInfo'])
        },
        methods: {
            gotoLoginOut () {                
                uni.navigateTo({
                    url: '../login/login?pageType=loginOut',
                });
            },
            bindLogin() {
                uni.reLaunch({
                    url: '../login/login',
                });
            },
            hasLogin () {
                let hasLogin = !!this.userInfo
                if (!hasLogin) {
                    this.bindLogin()
                }
            },
            intoOrder () {
                uni.navigateTo({
                    url: '../order/order',
                });
            },
            intoRecord () {                
                uni.navigateTo({                
                    url: '../recordPage/recordPage'
                })
            },
            intoChangePassword () {
                uni.navigateTo({                
                    url: '../signUp/signUp?page=changePassword'
                })
            },
            gotoBindTicket () {
                uni.navigateTo({                
                    url: '../bindTicket/bindTicket'
                })
            },
            gotoAppointmentList () {
                uni.navigateTo({                
                    url: '../appointmentList/appointmentList'
                })
            }
        }
    }
</script>

<style>
.user-content {
    width: 100%;
    min-height: 100vh;
    background: #F3F3F3;
}
.user-banner {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 500upx;
    margin-bottom: 68upx;
}
.user-banner .bg{
    position: absolute;
    top: 0;
    width: 100%;
}
.user-bottom {    
    position: absolute;
    top: 50upx;
    width: 95%;
    height: 660upx;
    border-radius: 8px;
    background: #F3F3F3;
    z-index: 1;
    box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
}
.user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50upx;
    width: 95%;
    border-radius: 8px;
    z-index: 2;
}
.user-container .user-header {
    position: relative;
    width: 100%;
    height: 187upx;
    padding-left: 100upx;
    background: #fff;
    margin-bottom: 10upx;
    border-radius: 8px 8px 0 0;
}
.user-header .info {
    position: absolute;
    top: 47upx;
    left: 310upx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.user-container .user-header img {
    position: absolute;
    top: -90upx;
    width: 249upx;
    height: 250upx;
    left: 60upx;
}
.user-container .user-header text {
    font-weight: 700;
    font-size: 16px;
}
.user-container .info .tip {
    font-size: 12px;
    font-weight: 400;
    color: #5F5F5F;
    margin-top: 10px;
}

.user-body {
    width: 100%;
    background: #fff;
    padding-left: 22upx;
    padding-right: 22upx;
    margin-bottom: 10upx;
    background: #fff;
}
.user-body .item {
    width: 100%;
    display: flex;
    align-items: center;
    height: 90upx;
}
.item + .item {
    border-top: 1px solid #eee;
}
.user-body .item img {    
    width: 38upx;
    height: 38upx;
    margin-right: 20upx;
}
.user-body .lable {
    font-size: 15px;
    color: #444343;
}
.user-body-end {
    border-radius: 0 0 8px 8px;
}
.icon-arrow {
    width: 16px;
    height: 16px;
    margin-left: auto;
    margin-right: 6px;
    border: 1px solid #38210B;
    transform: rotate(45deg);
    border-left: transparent;
    border-bottom: transparent;
}
.box {
        position: fixed;
        top: -50upx;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto;
        width: 550upx;
        max-height: 80vh;
        background: #fff;
        border-radius: 8px;
        box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
        overflow: hidden;
        z-index: 4;
    }
    .box .title {
        width: 100%;
        height: 60upx;
        text-align: center;
        margin-bottom: 10upx;
        background: #ffcc00;
    }
    .box .box-name {
        width: 100%;
        text-align: left;
        font-size: 13px;
        padding: 20upx;
    }
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #888;
        opacity: .5;
        z-index: 3;
    }
</style>
