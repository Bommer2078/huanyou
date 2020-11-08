<template>
    <view class="pay-ball" @click="gotoPay">
        <img src="/static/img/iconGroup/payBall.png" >
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'payBall',
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        gotoPay () {            
            let hasLogin = !!this.userInfo
            if (!hasLogin) {    
                this.$tip.toast('请先登录','none')          
                uni.navigateTo({
                    url: '../login/login',
                });
                return
            }
            uni.navigateTo({
                url: '../payPage/payPage'
            })
        }
    },
}
</script>

<style>    
.pay-ball {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140upx;
    height: 140upx;
    bottom: 90upx;
    right: 30upx;
    box-shadow:3px 2px 8px 0px rgba(0,0,0,0.14);
    border-radius: 50%;
    z-index: 2;
}
.pay-ball img{
    width: 140upx;
    height: 140upx;
}
</style>