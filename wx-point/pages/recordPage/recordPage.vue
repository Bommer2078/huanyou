<template>
    <view class="record-list">
        <view class="record-item-cover" v-for="(item,index) in recordList" :key="item.id">
            <view class="record-day" v-show="showDay(index)">{{dayText(item.createTime)}}</view>
            <view class="record-item">
                <view class="record-time">{{timeText(item.createTime)}}</view>
                <view class="record-info-cover">
                    <image src="" />
                    <view class="record-info">
                        <view class="venue-name">
                            <text>{{item.venueName}}</text>
                            <view class="ticket-name">
                                {{item.itemName}}
                            </view>
                        </view>
                        <view class="venue-summary">{{`“${item.bindingName}”到此一游`}}</view>
                    </view>
                    <view class="border-line"></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState(['userInfo']),
    },
    data() {
        return {
            recordList: []
        }
    },
    created() {
        this.getUserRecord()
    },
    methods: {
        showDay (index) {
            if (index === 0) {
                return true
            }
            let temp1 = this.recordList[index]
            let temp2 = this.recordList[index - 1]
            let str1 = this.$timeText(temp1.createTime)
            let str2 = this.$timeText(temp2.createTime)
            let arr1 = str1.split(' ')
            let arr2 = str2.split(' ')
            return arr1[0] === arr2[0]
        },
        dayText (txt) {
            let str = this.$timeText(txt)
            let arr = str.split(' ')
            return arr[0]
        },   
        timeText (txt) {
            let str = this.$timeText(txt)
            let arr = str.split(' ')
            return arr[2]
        },   
        async getUserRecord () {  
            let params = {
                pageNo: 1,
                pageSize: 100,
                // verifyUsername: this.userInfo.username
            }
            const res = await this.$api.getFootprint(params)
            if (res.code === '0') {
                this.recordList = res.data.list
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.record-list {    
    background: #F3F3F3;
    width: 100%;
    min-height: 100vh;
    .record-item-cover {
        .record-day {
            height: 55upx;
            line-height: 55upx;
            padding-left: 18upx;
            font-size: 26upx;
            color: #000;
        }
        .record-item {
            position: relative;
            width: 100%;
            height: 212upx;
            padding-left: 40upx;
            background: #fff;
            .record-time {     
                height: 57upx;           
                line-height: 57upx;           
                font-size: 22upx;
                font-weight: 400;
                color: #FFCC00;
            }
            &::before {
                content: '';  
                position: absolute;              
                height: 212upx;
                width: 1px;
                left: 20upx;
                background: #bbb;
                transform: scaleX(0.5);
            }
            &::after {
                content: '';  
                position: absolute;              
                height: 8upx;
                width: 8upx;
                left: 18upx;
                top: 20upx;
                background: #FFCC00;
                border-radius: 50%;
            }
        }
        .record-info-cover {
            position: relative;
            display: flex;
            height: 156upx;
            align-items: flex-start;
            padding-bottom: 20upx;
            padding-right: 40upx;
            box-sizing: border-box;
            .border-line {  
                width: calc(100% - 40upx);         
                position: absolute;
                bottom: -1upx;     
                height: 1px;
                background:  #bbb;
                transform: scaleY(0.5);
            }
            image {
                height: 136upx;
                width: 185upx;
                border-radius: 10upx;
                margin-right: 20upx;
            }
            .record-info {
                .venue-name {
                    display: flex;
                    align-items: center;
                    font-size: 0;
                    height: 40upx;
                    text {
                        line-height: 40upx;
                        color: #111;
                        font-size: 36upx;
                        margin-right: 20upx;
                    }
                    .ticket-name {
                        height: 40upx;
                        line-height: 30upx;
                        text-align: center;
                        padding-left: 20upx;
                        padding-right: 20upx;
                        font-size: 24upx;
                        color: #ffcc00;
                        border: 2upx solid #ffcc00;
                        background: #fff;
                        border-radius: 6upx;
                    }
                }                
                .venue-summary {                        
                    font-size: 28upx;
                    opacity: 0.55;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #ACACAC;
                }
            }
        }
    }
}
</style>