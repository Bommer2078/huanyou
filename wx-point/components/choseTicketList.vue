<template>
    <view class="ticket-select-cover" v-show="showTicketList">
        <view class="mask" @click.stop></view>
        <view class="ticket-select">            
            <view class="title">                
                <image src="../static/img/titleIcon.svg" class="title-icon" />
                <text>选择联票</text> 
            </view>
            <view  v-for="(item,index) in ticketList" :key="index" @click.stop="choseTicket(item)" class="ticket-item">                
                <img :src="item.photo" class="banner-cover">
                <view class="ticket-name">
                    <image src="../static/img/NEW.svg" class="new-icon"/>{{item.name}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        ticketList: {
            type: Array,
            default() {
                return []
            }
        },
        showTicketList: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        choseTicket (tiketObj) {
            this.$emit('choseTicket', tiketObj)
        }
    },
}
</script>

<style lang="scss" scoped>
    .ticket-select {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto;
        width: 664upx;
        max-height: 80vh;
        background: #fff;
        border-radius: 8px;
        padding-top: 20upx;
        box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
        overflow: scroll;
        z-index: 101;
    }
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
    .ticket-select .title {
        font-size: 38upx;
        font-weight: 400;
        color: #000000;
        margin-bottom: 40upx;
    }    
    .title-icon {   
        width: 30upx;
        height: 30upx;
        margin-right: 10upx;
    }
    .ticket-item {
        width: 90%; 
        margin-bottom: 30upx;  
    }
    .ticket-select .ticket-name {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100upx;
        text-align: left;
        font-size: 38upx;
        font-weight: 700;
        border-bottom: 6upx solid #eee;
    }
    .ticket-select .ticket-name .new-icon{
        width: 76upx;
        height: 42upx;
        margin-right: 20upx;
    }
    .ticket-select .banner-cover {
        width: 602upx;
        height: 324upx;
        border-radius: 14px;
    }
</style>
        