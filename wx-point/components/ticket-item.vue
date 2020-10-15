<template>
    <view class="ticket-item" :class="index % 2 === 0 ? ' yellow-theme' : 'blue-theme'">
        <img src="/static/img/ticketBG.png" class="bg-img" :class="{'bind-bg':ticketItem.binding}" v-if="index % 2 === 0">
        <img src="/static/img/ticketBG2.png" class="bg-img" :class="{'bind-bg':ticketItem.binding}" v-else>
        <view class="container" :class="{'bind-bg':ticketItem.binding}">
            <view class="title">{{ticketItem.itemPlaceName}}</view>
            <view class="name">{{ticketItem.itemName}}</view>
            <view class="info">
                <view>联票编号：{{ticketItem.childCode}}</view>
                <view>密码：{{ticketItem.password}}</view>
            </view>
        </view>
        <template v-if="!ticketItem.binding">            
            <button open-type="share" class="share-btn">送给朋友</button>
            <view class="bind-btn" @click="bindTicket">一键绑定</view>
        </template>
        <template v-else>            
            <view class="bind-icon">
                <img src="/static/img/bind.png">
            </view>
        </template>
    </view>
</template>

<script>
export default {
    name: 'ticketItem',
    props: {
        ticketItem: {
            type: Object,
            default: null
        },
        index: {
            type: Number,
            requeriy: true
        }
    },    
    onShareAppMessage: function( options ){
        return this.$commenShare()
    },
    // onShareAppMessage ( options ) {
    //     let shareObj = {
    // 　　　　title: "转发的标题",        // 默认是小程序的名称(可以写slogan等)
    // 　　　　path: '/pages/share/share',        // 默认是当前页面，必须是以‘/’开头的完整路径
    // 　　　　imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    // 　　　　success: function(res){
    // 　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
    // 　　　　　　}
    // 　　　　},
    // 　　　　fail: function(){
    // 　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
    // 　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
    // 　　　　　　}
    // 　　　　},
    // 　　　　complete: function() {
    // 　　　　}
    // 　　}
    // 　　return shareObj
    // },
    methods: {
        bindTicket() {
            wx.redirectTo({
                url: `/pages/bindTicket/bindTicket?code=${this.ticketItem.childCode}&password=${this.ticketItem.password}&name=${this.ticketItem.itemName}`
            })
        },
        shareTicket () {

        }
    },
}
</script>

<style>
    .blue-theme {
        color: #fff;
    }
    .blue-theme .share-btn,
    .blue-theme .bind-btn {
        background: #0B56D3;
    }
    .yellow-theme {
        color: #38210B;
    }
    .yellow-theme .share-btn,
    .yellow-theme .bind-btn {
        background: #FFF722;
    }
    .ticket-item {
        position: relative;
        width: 586upx;
        height: 297upx;
        border-radius: 20upx;
    }
    .bg-img {
        position: absolute;
        width: 586upx;
        height: 297upx;
    }
    .container {        
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 586upx;
        height: 297upx;
        padding: 18upx;
        padding-bottom: 40upx;
    }
    .container .title{
        font-size: 14px;
    }
    .container .name{
        text-align: center;
        font-size: 54upx;
        font-weight: 700;
        margin-bottom: 30upx;
        text-shadow:4px 3px 2px rgba(0,0,0,0.21);
    }
    .container .info{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        font-size: 26upx;
    }
    .bind-btn, .share-btn {        
        position: absolute;
        height: 36upx;
        line-height: 36upx;
        text-align: center;
        font-size: 24upx;
    }
    .share-btn {
        display: inline-block;
        padding: 0;
        bottom: 44upx;
        left: 80upx;
        width: 120upx;
        border-radius: 18upx;
    }
    .bind-btn {
        bottom: 44upx;
        right: 80upx;
        width: 120upx;
        border-radius: 18upx;
    }
    .bind-icon {
        position: absolute;
        width: 145upx;
        height: 153upx;
        top: -25upx;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 2;
    }
    .bind-icon img{
        width: 145upx;
        height: 153upx;
    }
    .bind-bg {
        opacity: .5;
    }
</style>