<template>
    <view class="detail-page">
        <template v-if="goodsObj">            
            <view class="page-banner">
                <img :src="goodsObj.photo">
            </view>
            <view class="detail-title">
                <view class="detail-name">
                    <img src="/static/img/iconGroup/angle.svg" class="angle-icon">
                    <view>{{goodsObj.name}}</view>
                    <view class="price">￥<text>{{goodsObj.price/100}}</text></view>
                </view>
            </view>
            <view class="info-content">            
                <view class="content-name">
                    <img src="/static/img/iconGroup/rules.svg" class="list-icon">
                    <view class="content-name-text">
                        产品介绍
                    </view>
                </view>                
                <view class="content-body">
                    <rich-text :nodes="goodsObj.description"></rich-text>
                </view>
            </view>
            <view class="pay-footer-position">            
                <view class="pay-footer">
                    <view class="price">
                        价格：<text>{{goodsObj.price/100}}</text>元
                    </view>
                    <view class="pay-btn" @click="gotoPayPage">立即购买</view>
                </view>
            </view>
        </template>
        <loading :show-loading="!goodsObj"></loading>     
    </view>
</template>

<script>
import loading from '../../components/loadding'
import { mapState } from 'vuex'
export default {
    components: {
        loading
    },
    computed: {
        ...mapState(['userInfo'])
    },
    data() {
        return {
            goodsId: '',
            goodsObj: null
        }
    },
    created() {
        this.$nextTick(() => {
            this.getGoodsDetail()
        })
    },
    onLoad(option){
        this.goodsId = option.id
    },
    methods: {
        async getGoodsDetail() {
            const res = await this.$api.getGoodsDetail(this.goodsId)
            if (res.code === '0') {
                this.goodsObj = res.data
            } else {
                this.$tip.toast(res.massege,'none')
            }
        },
        gotoPayPage () {
            let hasLogin = !!this.userInfo
            if (!hasLogin) {    
                this.$tip.toast('请先登录','none')          
                uni.navigateTo({
                    url: '../login/login',
                });
                return
            }
            uni.navigateTo({
                url: `../payGoodsPage/payGoodsPage?id=${this.goodsObj.id}`
            })
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
        margin-bottom: 28upx;
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
        padding-bottom: 60upx;
        background: #fff;
    }
    .venue-rules .rules{
        margin-left: 8upx;
        max-width: 382upx;
        font-size: 11px;
        color:#9D9D9D;
        word-break: break-all;
    }
    .detail-name .price {      
        margin-left: auto;  
        position: relative;
    }
    .detail-name .price text{
        font-size: 27px;
        color: #FFCC00;
        font-style: italic;
        margin-right: 30upx;
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
        width: 100%;
        height: 130upx;
        padding-top: 34upx;
        border-top: 1px solid #EDEDED;
    }
    .location .location-name {
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-bottom: 10upx;
    }
    .location .location-name img{
        width: 32upx;
        height: 40upx;
        margin-right: 10px;
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
    }
    .content-name {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
    }
    .content-name .list-icon {
        width: 33upx;
        height: 36upx;
        margin-right: 10upx;
    }
    .content-name-text {
        position: relative;
        margin-bottom: 20upx;
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