<template>
    <view class="checkin-box">
        <view class="mask" @click.stop></view>
        <view class="checkin-box-cover">
            <view class="title">                
                <image src="../static/img/titleIcon.svg" class="title-icon" />
                <text>核销扫码</text> 
                <image src="../static/img/closeBox.svg" class="close-icon" @click="closeBox"/>
            </view>
            <view class="header">

            </view>
            <view class="name">
                xxxx
            </view>
            <view class="QR-code"></view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        closeBox () {
            this.$emit('closeBox')
        }
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
        }
        .name {            
            font-size: 36upx;
            font-weight: 500;
            color: #000000;
        }
        .QR-code {
            width: 420upx;
            height: 420upx;
            background: #000;
        }
    }
}
</style>