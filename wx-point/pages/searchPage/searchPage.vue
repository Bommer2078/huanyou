<template>
    <view class="search-page">
        <view class="search-input-cover">
            <input type="text" class="search-input" v-model.trim="searchContent">
            <view class="search-btn" @click="handleSearch">
                确认
            </view>
        </view>
        <view class="tabs">
            <view class="tabs-item" :class="{'active' : currentTab === 1}" @click="changeTabs(1)">精选场馆</view>
            <view class="tabs-item" :class="{'active' : currentTab === 2}" @click="changeTabs(2)">特惠商品</view>
        </view>
        <view class="search-body">
            <template v-if='currentTab === 1'>                
                <view class="search-item" v-for="(item,index) in searchArr1" :key="index" @click="intoVenueDetail(item)">
                    <img src="/static/img/venue0.png">
                    <view class="item-name">{{item.name}}</view>
                </view>
                <view class="empty" v-if="searchArr1.length === 0">暂无内容</view>
            </template>
            <template v-else>                
                <view class="search-item" v-for="(item,index) in searchArr2" :key="index">
                    <img src="/static/img/ticket0.png">
                    <view class="item-name">{{item.name}}</view>
                </view>
                <view class="empty" v-if="searchArr2.length === 0">暂无内容</view>
            </template>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            currentTab : 1,
            searchArr1: [],
            searchArr2: [],
            searchContent: ''
        }
    },
    computed: {
        ...mapState(['ticketBaseInfo'])
    },
    methods: {
        changeTabs(tab) {
            if ( this.currentTab === tab ) return
            this.currentTab = tab
        },
        handleSearch () {
            if (!this.searchContent) {
                this.$tip.toast('请填入搜索关键词','none')
                return
            }
            if (this.currentTab === 1) {
                this.getVenueList()
            }
            if (this.currentTab === 2) {
                this.getGoodsList()
            }
        },
        intoVenueDetail(item) {                        
            let tempStr = this.$options.filters['rulesText'](item)
            uni.navigateTo({
                url: `/pages/venueDetail/venueDetail?id=${item.id}&str=${tempStr}`
            })
        },
        async getVenueList () {
            let params = {
                yearTicketId: this.ticketBaseInfo.id,
                venueName: this.searchContent,
                pageNum: 1,
                pageSize: 100,
            }                
            const res = await this.$api.getVenueList(params)
            if (res.code === '0') {
                this.searchArr1 = res.data.list
            }
        },
        async getGoodsList () {
            let params = {
                name: this.searchContent,
                pageNum: 1,
                pageSize: 100,
            }                
            const res = await this.$api.getGoodsList(params)
            if (res.code === '0') {
                this.searchArr2 = res.data.list
            }
        }
    },
}
</script>

<style>
    .search-page {
        width: 100%; 
        background: #F3F3F3;
    }
    .search-input-cover {
        height: 80upx;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FFCC00;
    }
    .search-input {
        height: 40upx;
        line-height: 40upx;
        width: 550upx;
        padding-left: 20upx;
        font-size: 11px;
        background: #F1F1F1;
        border-radius: 4px;
    }
    .search-btn {
        width: 72upx;
        height: 56upx;
        line-height: 55upx;
        font-size: 12px;
        text-align: center;
        margin-left: 26upx;
        background:rgba(255,255,255,1);
        border-radius:7upx;
    }
    .tabs {
        width: 100%;
        height: 62upx;
        line-height: 62upx;
        background: #fff;
        margin-bottom: 18upx;
    }
    .tabs-item {
        position: relative;
        display: inline-block;
        width: 50%;
        text-align: center;
        color: #797979;
        font-size: 12px;
    }
    .search-body {
        margin-left: 20upx;
        margin-right: 20upx;
        background: #fff;
        box-shadow:0px 6px 4px 0px rgba(0,0,0,0.02);
        border-radius:14px;
        overflow: hidden;
    }
    .search-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 25upx;
        height: 95upx;
        font-size: 13px;
        color: #373737;
        border-bottom: 1px solid #f0f0f0;
    }
    .search-item img {
        width:60upx;
        height:60upx;
        background:linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));
        border-radius:50%;
        margin-right: 22upx;
    }
    .active {
        font-size: 14px;
        color: #000;
    }
    .active::after {
        content: '';
        position: absolute;
        display: block;
        left: 50%;
        bottom: 6upx;
        margin-left: -18upx;
        width:35upx;
        height:6upx;
        background:linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));
    }
    .empty {
        padding-top: 60upx;
        padding-bottom: 60upx;
        font-size:14px;
        color: #888;
        text-align: center;
    }
</style>