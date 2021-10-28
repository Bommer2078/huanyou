<template>
    <view class="detail-page">
        <template>            
            <view class="page-banner" v-if="ticketData">
                <img :src="ticketData.photo">
            </view>
            <view class="detail-title">
                <view class="detail-name">
                    <img src="/static/img/iconGroup/angle.svg" class="angle-icon">
                    <view>{{ticketData.name}}</view>
                </view>
                <view class="venue-rules">
                    <view class="rules">{{venueNum ? `包含 ${venueIntro} 等 ${venueNum}个场馆` : '暂无场馆'}}</view>
                    <view class="price-warp" v-if="sellType">
                        <template v-if="sellType.oldPriceRule && sellType.discountRule">                            
                            <view class="price"><text class="price-tip">{{sellType.discountPriceName}}：</text>￥<text>{{ticketData.discountPrice/100}}</text><text class="unit">元</text></view>
                            <view class="price"><text class="price-tip">{{sellType.priceName}}：￥{{ticketData.price/100}}元</text></view>
                        </template>
                        <template v-else-if="sellType.discountRule">                            
                            <view class="price"><text class="price-tip">{{sellType.discountPriceName}}：</text>￥<text>{{ticketData.discountPrice/100}}</text><text class="unit">元</text></view>
                        </template>
                        <template v-else-if="sellType.oldPriceRule">                                              
                            <view class="price"><text class="price-tip">{{sellType.priceName}}：</text>￥<text>{{ticketData.price/100}}</text><text class="unit">元</text></view>        
                        </template>
                    </view>
                </view>
            </view>
            <view class="detail-location">
                <view class="location">                
                    <view class="location-name">
                        <img src="/static/img/iconGroup/location.svg" class="location-icon">
                        <view class="">{{locationObj.name}}</view>
                    </view>
                    <view class="location-detail">
                        联票归属地
                    </view>
                </view>
            </view>
            <view class="info-content">            
                <view class="content-name">
                    <img src="/static/img/iconGroup/rules.svg" class="list-icon">
                    <view class="content-name-text">
                        联票介绍
                    </view>
                </view>
                <view class="content-body">
                    <rich-text :nodes="strings"></rich-text>
                </view>
            </view>
        </template>
        <loading :show-loading="!ticketData"></loading> 
        <view class="pay-btn" @click="gotoPay">购买联票</view> 
        <chose-ticket-list :show-price="true" :ticket-list="ticketList" :showTicketList="showTicketList" @choseTicket="choseTicket"></chose-ticket-list> 
    </view>
</template>

<script>
import loading from '../../components/loadding'
import payBall from '../../components/payBall'
import choseTicketList from '../../components/choseTicketList'
import { mapState } from 'vuex' 
export default {
    components: {
        loading,
        payBall,
        choseTicketList
    },
    onShareAppMessage: function( options ){
        return this.$commenShare()
    },
    data() {
        return {
            ticketData: null,
            venueIntro: '暂无场馆',
            venueNum: '0',
            strings: '', // 富文本内容
            sellType: null,
            nowTicketInfo: null,
            showTicketList: false,
            ticketList: []
        }
    },
    computed: {
        ...mapState(['locationObj','ticketBaseInfo','userInfo'])
    },
    onShow () {
        this.initPage()
        // this.initTicketData()
    },
    onHide () {
        this.showTicketList = false
    },
    methods: {
        initPage () {
            let temp = uni.getStorageSync('fromMainPageBanner')
            if (temp) {
                this.initTicketData()
                uni.removeStorageSync('fromMainPageBanner')
            } else {
                this.getTicketList()
            }
        },
        showChoseBox () {
            this.showTicketList = true
        },
        choseTicket (obj) {            
            this.$store.commit('SET_TICKET_OBJ',obj) 
            this.initTicketData(obj.id)
            this.showTicketList = false 
        },
        async initTicketData(id) {
            let tempId = id || this.ticketBaseInfo.id
            const res = await this.$api.getTicketDetail(tempId)
            if (res.code === '0') {
                this.ticketData = res.data
                this.sellType = JSON.parse(res.data.sellType)
                this.strings = res.data.description
                this.processVenueIntro()
            }
        },
        async getTicketList () {
            let params = {
                pageNum: 1,
                pageSize: 10,
                placeId: this.locationObj.id
            }               
            const res2 = await this.$api.getTickeList(params)
            if (res2.code === '0') {
                let tempArr = res2.data.list.filter((item) => {
                    return item.status === 1
                })
                this.ticketList = tempArr
                if (tempArr && tempArr.length === 1) {   
                    this.choseTicket(tempArr[0])
                } else if (tempArr && tempArr.length > 1) {
                    this.showTicketList = true
                } else {
                    this.$tip.toast('敬请期待','none')
                }
            }  
        },
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
        },
        processVenueIntro () {
            let temp = this.ticketData.relatedVenueList
            if (temp.length === 0) {
                this.venueIntro = '暂无场馆'
            } else {
                let tempArr = []
                temp.forEach(item => {
                    console.log(item)
                    let obj = JSON.parse(item.relatedRedundancy)
                    tempArr.push(obj.text)
                });
                this.venueNum = tempArr.length
                this.venueIntro = tempArr.splice(0,3).join('，')
            }
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
    }
    .detail-name {
        display: flex;
        align-items: center;
        padding-left: 15upx;
        padding-bottom: 28upx;
        font-size: 16px;
        font-weight: 700;
        color: #000;
    }
    .detail-name img {
        width: 22upx;
        height: 22upx;
        margin-right: 10upx;
    }
    .venue-rules {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-left: 15upx;
        padding-right: 15upx;
        padding-bottom: 30upx;
        background: #fff;
    }
    .venue-rules .rules{
        margin-left: 8upx;
        max-width: 45vw;
        font-size: 11px;
        color:#9D9D9D;
        word-break: break-all;
    }
    .venue-rules .price {        
        position: relative;
    }
    .venue-rules .price text{
        font-size: 27px;
        font-style: italic;
        font-weight: 700;
        color: #FFCC00;
    }
    .venue-rules .price .price-tip {
        color: #888;
        font-style: normal;
        font-weight: 400;
        font-size: 11px;
    }
    .venue-rules .price .unit {
        color: #888;
        font-style: normal;
        font-weight: 400;
        font-size: 11px;
        margin-left: 5px;
        white-space: nowrap;
    }
    .detail-location {
        display: flex;
        align-items: center;
        width: 100%;        
        padding-left: 15upx;
        padding-right: 15upx;
        margin-bottom: 20upx;
        background: #fff;
    }
    .detail-location .location {
        display: flex;
        align-items: center;
        width: 100%;
        height: 89upx;
        border-top: 1px solid #EDEDED;
    }
    .location .location-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 10upx;
    }
    .location .location-name img{
        width: 32upx;
        height: 40upx;
        margin-right: 5px;
    }
    .location .location-detail{
        font-size: 11px;
        color: #C5C5C5; 
        margin-left: 16upx;
    }
    .detail-location .phone{
        width: 130upx;
        height: 130upx;
        padding-top: 46upx;
        border-top: 1px solid #EDEDED;
    }
    .detail-location .phone img{
        padding-left: 43upx;
        width: 35upx;
        height: 41upx;
        border-left: 1px solid #C5C5C5;
    }
    .info-content {
        width: 100%;
        padding: 30upx 15upx 0 15upx;
        background: #fff;
        margin-bottom: 40px;
    }
    .content-name {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 25upx;
    }
    .content-name .list-icon {
        width: 33upx;
        height: 36upx;
        margin-right: 10upx;
    }
    .content-name-text {
        position: relative;
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
    .pay-btn{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        background: #FFCC00;
        line-height: 40px;
    }
</style>