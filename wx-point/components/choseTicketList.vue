<template>
    <view class="ticket-select-cover" v-show="showTicketList">
        <view class="mask" @click.stop></view>
        <view class="ticket-select">
            <view class="title">
                选择联票
            </view>
            <view  v-for="(item,index) in ticketList" :key="index" @click.stop="choseTicket(item)" class="ticket-item">                
                <view class="ticket-name">{{item.name}}</view>
                <img :src="item.photo" class="banner-cover">
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
        width: 550upx;
        max-height: 80vh;
        background: #fff;
        border-radius: 8px;
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
        width: 100%;
        height: 60upx;
        text-align: center;
        margin-bottom: 10upx;
        background: #6F9CFF;
    }
    .ticket-item {
        width: 90%;    
    }
    .ticket-select .ticket-name {
        width: 100%;
        text-align: left;
        font-size: 13px;
        margin-bottom: 10upx;
    }
    .ticket-select img {
        width: 100%;
        height: 365upx;
    }
</style>
        