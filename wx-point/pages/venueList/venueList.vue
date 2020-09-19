<template>
    <view class="venue-list">
        <view class="ticket-name">{{ticketBaseInfo.name}}</view>
        <view class="search-group">
            <picker @change="bindPickerChange" :value="venueTypeIndex" :range="venueTypeTextArr">
                <view class="select">{{venueTypeTextArr[venueTypeIndex] ? venueTypeTextArr[venueTypeIndex] : '按分类筛选'}}</view>
            </picker>
            <view class="search-btn-cover" @click="goToSearch">
                <view class="search-btn">关键词搜索</view>
            </view>
        </view>
        <template v-for="(item,index) in venueArr">
            <view class="venue-list-contianer" :key="index" @click="intoVenueDetail(item)">
                <view class="venue-item">
                    <view class="venue-tip" >
                    <text class="order" v-if="!item.newAdd">{{index + 1 - addNewNum}}</text>
                    <text class="new-order" v-else>新增</text>
                    <text class="type">{{ item.venueTypeName }}</text>
                    </view>
                    <view class="venue-name-row">
                        <view class="venue-name">
                            {{item.name}}
                        </view>
                        <view class="venue-price">
                            <text class="price-icon">价值￥</text><text class="price">{{item.referPrice/100}}</text>
                        </view>
                    </view>
                    <view class="rules">
                        {{ item | rulesText }}
                    </view>
                </view>
            </view>
        </template>
        <pay-ball></pay-ball>
        <loading :show-loading="showLoading"></loading> 
    </view>
</template>

<script>
import { mapState } from 'vuex'
import payBall from '../../components/payBall'
import loading from '../../components/loadding'
export default {    
    components: {
        loading,
        payBall
    },
    created() {
        this.getVenueList()
    },
    data() {
        return {
            showLoading: false,
            venueTypeIndex: 0,
            venueArr: [],
            searchTypeId: ''
        }
    },
    computed: {
        ...mapState(['locationObj','ticketBaseInfo','venueTypeArr']),
        addNewNum() {
            let tempArr = this.venueArr
            let num = 0
            for (let i = 0;i < tempArr.length;i+=1 ) {
                    console.log(tempArr[i].newAdd)
                if (tempArr[i].newAdd) {
                    num++
                }
            }
            return num
        },
        venueTypeTextArr() {
            let tempArr = []
            this.venueTypeArr.forEach((i) => {
                tempArr.push(i.itemName)
            })
            tempArr.unshift('全部类型')
            return tempArr
        }
    },
    methods: {
        async getVenueList() {
            let params = {
                yearTicketId: this.ticketBaseInfo.id,
                venueType: this.searchTypeId,
                pageNum: 1,
                pageSize : 100,
            }
            const res = await this.$api.getVenueList(params)
            if (res.code === '0') {
                this.venueArr = res.data.list
            }
        },
        bindPickerChange(e) {
            let index =  e.detail.value
            if (this.venueTypeIndex === index) return
            this.venueTypeIndex = index
            this.searchTypeId = Number(index) ? this.venueTypeArr[index - 1].id : ''
            this.getVenueList()
        },
        intoVenueDetail (item) {
            let tempStr = this.$options.filters['rulesText'](item)
            uni.navigateTo({
                url: `/pages/venueDetail/venueDetail?id=${item.id}&str=${tempStr}`
            })
        },
        goToSearch () {
            uni.navigateTo({
                url: '/pages/searchPage/searchPage'
            })
        }
    },
}
</script>

<style>
    .venue-list {
        width: 100%;
        background: #F3F3F3;
    }
    .ticket-name {
        width: 100%;
        height: 65upx;
        line-height: 65upx;
        text-align: center;
        color: #38210B;
        font-size: 16px;
        background: #FFCC00;
    }
    .search-group {     
        display: flex;
        align-items: center;
        justify-content: space-around;   
        width: 100%;
        height: 65upx;
        margin-bottom: 14upx;
        background: #fff;
    }
    .search-group picker{
        width: 50%
    }
    .search-group .select {
        position:relative;
        width: 100%;
        text-align: center;
        font-size: 13px;
        color: #666666;
    }
    .search-group .select::after {
        content: '';
        position: absolute;
        top: 6px;
        margin-left: 5px;
        border: 5px solid;
        border-color: #666666 transparent transparent transparent;
    }
    .search-btn-cover {
        width: 50%;
    }
    .search-btn {
        width: 164upx;
        height: 40upx;
        line-height: 40upx;
        text-align: center;
        font-size: 11px;
        color: #fff;
        background: #FFCC00;
        border-radius: 6upx;
        margin: auto;
    }
    .venue-list-contianer {
        margin-left: 14upx;
        margin-right: 14upx;
    }
    .venue-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 190upx;
        padding: 0 12upx;
        margin-bottom: 8upx;
        background: #fff;
        border-radius: 8upx;
    }
    .venue-item .rules{
        font-size: 11px;
        color: #FFCC00;
        margin-bottom: 20upx;
    }
    .venue-tip {
        display: flex;
        align-items: flex-end;
        margin-top: 10upx;
    }
    .venue-item .order ,
    .venue-item .new-order {
        font-size: 13px;
        font-weight: 700;
        color: #FFCC00;
        font-style: italic;
        margin-right: 8px;
    }
    .venue-item .new-order {
        font-size: 11px;
        color: #E51919;
    }
    .venue-item .type {
        font-size: 11px;
        color: #666666;
    }
    .venue-name-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .venue-name-row .venue-name {
        display: flex;
        align-items: flex-start;
        max-width: 524upx;
        min-height: 65upx;
        justify-content: space-between;
        font-weight: 700;
        font-size: 15px;      
        margin-top: 10upx;
    }
    .venue-price .price-icon {        
        font-size: 15px;
    }
    .venue-price .price {        
        font-size: 21px;
        color: #ffcc00;
        font-weight: 700;
        font-style: italic;
        margin-right: 10upx;
    }
</style>