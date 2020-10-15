<template>
    <view class="detail-page">
        <template v-if="venueData">       
            <view class="page-banner">
                <img :src="venueData.photo">
            </view>
            <view class="detail-title">
                <view class="detail-name">
                    <img src="/static/img/iconGroup/angle.svg" class="angle-icon">
                    <view>{{venueData.name}}</view>
                </view>
                <view class="venue-rules">
                    <view class="rules">{{rulesStr}}</view>
                    <view class="book-btn-part">
                        <view class="book-btn" @click="gotoAppointment" v-if="venueData.booking">点击预约</view>
                        <view class="price">￥<text>{{venueData.referPrice/100}}</text></view>
                    </view>
                </view>
            </view>
            <view class="info-content">
                <view class="content-name location-content" @click="gotoMap">
                    <img src="/static/img/iconGroup/location.svg" class="location-icon">
                    <view class="content-name-text">
                        地址导航
                    </view>
                </view>   
                <view class="detail-location">
                    <view class="location" @click="gotoMap">                
                        <view class="location-name">
                            <view class="">{{venueData.address}}</view>
                        </view>
                    </view>
                    <view class="phone" @click="callPhone">
                        <img src="/static/img/iconGroup/phone.svg" class="phone-icon">
                    </view>
                </view>   
            </view>                   
            <view class="info-content">   
                <view class="content-name">
                    <img src="/static/img/iconGroup/trafc.svg" class="location-icon">
                    <view class="content-name-text">
                        交通路线
                    </view>
                </view>  
                <view class="route-detail">
                    <view class="route-row" v-for="(item,index) in routeArr" :key="index">{{item}}</view>
                </view>
            </view>
            <view class="info-content">            
                <view class="content-name">
                    <img src="/static/img/iconGroup/rules.svg" class="list-icon">
                    <view :class="currentTab === 1 ? 'content-name-text' : 'tab-name-text'" class="tab-item" @click="changeCurrentTab(1)">
                        场馆介绍
                    </view>
                    <view :class="currentTab === 2 ? 'content-name-text' : 'tab-name-text'" class="tab-item" @click="changeCurrentTab(2)">
                        评论
                    </view>
                </view>
                <view class="content-body" v-show="currentTab === 1">                
                    <rich-text :nodes="processImg(venueData)"></rich-text>
                </view>
                <view class="comment-body" v-show="currentTab === 2"> 
                    <template v-if="!commentData || commentData.length === 0">
                        <view class="no-comment">暂无评论</view>
                    </template>  
                    <template v-else>
                        <template v-for="item in commentData">                        
                            <comment-item :comment-data="item" :key="item.id"></comment-item>   
                        </template>
                    </template>
                </view>
            </view>
        </template>
        <!-- <view class="pay-footer-position">            
            <view class="pay-footer">
                <view class="price">
                    价格：<text>245</text>元
                </view>
                <view class="pay-btn">立即购买</view>
            </view>
        </view> -->
        <pay-ball v-if="currentTab === 1"></pay-ball>
        <image src="../../static/img/commentBtn.png" class="comment-btn" v-else/>
        <loading :show-loading="!venueData"></loading>     
    </view>
</template>

<script>
import loading from '../../components/loadding'
import payBall from '../../components/payBall'
import commentItem from '../../components/commentItem'
export default {
    components: {
        loading,
        payBall,
        commentItem
    },
    created() {
        this.$nextTick(() => {            
            this.getVenueDetail()
        })
    },
    onLoad (option) {
        this.venueId = option.id
        this.rulesStr = option.str
    },    
    onShareAppMessage: function( options ){
        return this.$commenShare()
    },
    data() {
        return {
            showLoading: false,
            venueData: null,
            rulesStr: '',
            venueId: '',
            phoneCall: '',
            timer: null,
            currentTab: 1, // 1详情,2评论
            commentData: [{
                id:1,
                name:'189****1235',
                content: '超级好玩得地方',
                creatTime: '08-21 19:12'
            }]
        }
    },
    computed: {
        routeArr() {
            if (this.venueData) {
                let arr = this.venueData.route.split(/；|;/)
                return arr
            }
            return []            
        }
    },
    methods: {
        async getVenueDetail () {
            const res = await this.$api.getVenueDetail(this.venueId)
            if (res.code === '0') {
                this.venueData = res.data
                this.phoneCall = res.data.phone
            }
        },
        processImg (obj) {
            if (!obj) return
            let val = obj.description
            return val.replace(/\<img/g, '<img style="max-width:100%;height:auto" ')
        },
        callPhone () {
            let phoneCall = [this.phoneCall]
            uni.showActionSheet({
                itemList: [phoneCall[0]],
                success: function (res) {
                    wx.makePhoneCall({
                        phoneNumber: phoneCall[res.tapIndex], //此号码并非真实电话号码，仅用于测试  
                        success: function () {
                            console.log("拨打电话成功！")
                        },
                        fail: function () {
                            console.log("拨打电话失败！")
                        }
                    })
                },
                fail: function (res) {
                    console.log(res.errMsg)
                }
            })
        },
        gotoAppointment () {            
            uni.navigateTo({
                url: `/pages/appointmentPage/appointmentPage?id=${this.venueId}`
            })
        },
        gotoMap () {
            let lng = this.venueData.addressLng
            let lat = this.venueData.addressLat
            let name = this.venueData.name

            uni.navigateTo({
                url: `../map/map?lng=${lng}&lat=${lat}&name=${name}`
            })
        },
        changeCurrentTab (type) {
            this.currentTab = type
        }
    },
}
</script>

<style>
    .detail-page {
        width: 100%;
        min-height: 100vh;
        background: #F3F3F3;
    }
    .page-banner {
        display: flex;
        justify-content: center;
        width: 100%;
        padding-top: 21upx;
        padding-bottom: 21upx;
        background: #fff;
    }
    .page-banner img{
        width: 680upx;
        height: 330upx;
        border-radius: 27upx;
        box-shadow:0px 8px 16px 0px rgba(0, 0, 0, 0.47);
    }
    .detail-title {
        width: 100%;
        background: #fff;
        margin-bottom: 20upx;
    }
    .detail-name {
        display: flex;
        align-items: center;
        padding-left: 15upx;
        font-size: 16px;
        font-weight: 700;
        color: #000;
    }
    .detail-name img {
        width: 25upx;
        height: 25upx;
        margin-right: 10px;
    }
    .venue-rules {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-left: 15upx;
        padding-right: 15upx;
        background: #fff;
    }
    .venue-rules .rules{
        margin-left: 16upx;
        max-width: 382upx;
        font-size: 11px;
        color:#9D9D9D;
        word-break: break-all;
    }
    .content-body /deep/ img {
        max-width: 550upx !important;
    }
    .content-body {
        padding-left: 15upx;
        padding-right: 15upx;
    }
    .comment-body {
        min-height: 400upx;
    }
    .no-comment {
        width: 100%;
        padding-top: 120upx;
        height: 300upx;
        text-align: center;
        color: #ACACAC;
        font-size: 28upx;
        background: #fff;
    }
    .comment-btn {
        position: fixed;
        width: 130upx;
        height: 130upx;
        bottom: 104upx;
        right: 0;
    }
    .venue-rules .price::after{
        content: "";
        position: absolute;
        top: 15px;
        left: 0;
        display: inline-block;
        width: 100%;
        height: 6px;
        border-bottom: 2px solid #000;
        border-top: 2px solid #000;
    }
    .venue-rules .price {        
        position: relative;
    }
    .venue-rules .price text{
        font-size: 27px;
        color: #FFCC00;
    }
    .book-btn-part {        
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    .book-btn {
        background: #ffcc00;
        padding-left: 15px;
        padding-right: 15px;
        font-size: 16px;
        border-radius: 5px;
        line-height: 30px;
    }
    .detail-location {
        display: flex;
        align-items: center;
        width: 100%;      
        height: 50upx;  
        padding-left: 15upx;
        padding-right: 15upx;
        background: #fff;
    }
    .detail-location .location {
        width: calc(100% -130upx);
        /* height: 130upx;
        padding-top: 34upx; */
        overflow: hidden;
    }
    .location .location-name {
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-bottom: 10upx;
    }
    .location .location-name view{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .location-icon{
        margin-right: 10upx;
        width: 32upx;
        height: 50upx;
    }
    .location .location-detail{
        font-size: 11px;
        color: #C5C5C5; 
        margin-left: 16upx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .detail-location .phone{
        flex-shrink: 0;
        width: 100upx;
        height: 130upx;
        margin-left: auto;
    }
    .detail-location .phone img{
        padding-left: 43upx;
        width: 35upx;
        height: 41upx;
        border-left: 1px solid #C5C5C5;
    }
    .info-content {
        width: 100%;
        padding: 15upx 15upx 0 15upx;
        background: #fff;
        margin-bottom: 20upx;
    }
    .content-name {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 20upx;
    }
    .location-content { 
        width: 300px;
    }
    .content-name .list-icon {
        width: 33upx;
        height: 36upx;
        margin-right: 10upx;
    }
    .content-name .tab-item {
        width: 140upx;
        text-align: center;
    }
    .content-name-text {
        position: relative;
    }
    .tab-name-text {
        font-size: 24upx;
        font-weight: 400;
        color: #9E9E9E;
    }
    .route-detail {        
        padding-bottom: 15upx;
    }
    .route-row {
        margin-left: 15upx;
        font-size: 12px;
        color: #888;
    }
    .content-name-text::after {
        content: '';
        position: absolute;
        bottom: -8px;
        right: 25px;
        width: 15px;
        height: 4px;
        border-radius: 2px;
        background:linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));
    }
    .pay-footer-position {        
        width: 100%;
        height: 88upx;
    }
    .pay-footer {
        position: fixed;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 88upx;
        background: #fff;
        border-top: 1px solid #f3f3f3;
    }
    .pay-footer .price {
        margin-left: 27upx;
        font-size: 11px;
        color: #B7B7B7;
    }
    .pay-footer .price text{
        color: #FFCC00;
    }
    .pay-footer .pay-btn{
        width: 136upx;
        height: 60upx;
        margin-right: 44upx;
        line-height: 60upx;
        border-radius: 7px;
        text-align: center;
        font-size: 13px;
        color: #fff;
        background:linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));
    }
</style>