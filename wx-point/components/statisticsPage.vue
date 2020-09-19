<template>
    <view class="statistics-page">
        <view class="search-header">
            <picker mode="date" :value="date" start="2020-01-01" :end="endDate" @change="bindDateChange" class="date-select">
                <view class="uni-input">{{date}}</view>
            </picker>
            <view class="search-input">
                <img src="/static/img/search.svg">
                <input type="search" placeholder="请输入用户手机号码" v-model.trim="searchContent">
                <view class="search-btn" @click="search">
                    搜索
                </view>
            </view>
        </view>
        <view class="statis-num">
            历史核销数：{{allCount}}，当日核销数：{{todayCount}}
        </view>
        <template v-if="listArr.length > 0">            
            <view class="statistics-item" v-for="(item,index) in listArr" :key="index">
                <view class="title-row">                
                    <text>用户帐号</text>
                    <text v-if="item.bindingName">姓名</text>
                    <text>核销时间</text>
                </view>
                <view class="info-row">
                    <text>{{item.username}}</text>
                    <text  v-if="item.bindingName">{{item.bindingName}}</text>
                    <text>{{$timeText(item.createTime)}}</text>
                </view>
                <view class="code">{{item.bindingName ? `联票编号：${item.childCode}` : '特惠票'}}</view>
            </view>
        </template>
        <template v-else>            
            <view class="none-item">
                当日暂无相关数据
            </view>
        </template>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'statisticsPage',
    computed: {
        ...mapState(['userInfo']),        
        startDate() {
            return this.getDate('start');
        },
        endDate() {
            return this.getDate({
                format: true
            })
        }
    },
    data () {
        const currentDate = this.getDate({
            format: true
        })
        return {
            todayCount: 0,
            allCount: 0,
            listArr: [],
            pageNum:1,
            pageSize: 100,
            verifyDate: '',
            username: '',
            date: currentDate,
            searchContent: ''
        }
    },
    created() {
       this.getStatisticsList(true)
       this.getAllCount()
    },
    methods: {
        async getStatisticsList (bolean) {
            let time = new Date(this.date).getTime() - 8*60*60*1000
            let params = {
                pageNum : this.pageNum,
                pageSize : this.pageSize,
                verifyUsername : this.userInfo.username,
                username: this.searchContent,
                verifyDate : time
            }
            const res = await this.$api.getStatisList(params)
            if (res.code === '0') {                
                this.listArr = res.data.list
                if (bolean) {
                    this.todayCount = res.data.total
                }
            }
        },
        async getAllCount () {
            let params = {
                verifyUsername: this.userInfo.username
            }
            const res = await this.$api.getAllCount(params)
            if (res.code === '0') {
                this.allCount = res.data
            }
        },
        bindDateChange(e) {
            this.searchContent = ''
            this.date = e.target.value
            this.getStatisticsList(true)
        },
        search () {            
            if (!this.checkPhone(this.searchContent)) {
                this.$tip.toast('请填写完整的用户手机号','none')
                return
            }
            this.getStatisticsList(false)
        },
        checkPhone (phone) {
            if(!(/^1[34578]\d{9}$/.test(phone))){ 
                return false    
            }
            return true
        },
        getDate(type) {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (type === 'start') {
                year = year - 5;
            } else if (type === 'end') {
                year = year + 2;
            }
            month = month > 9 ? month : '0' + month;;
            day = day > 9 ? day : '0' + day;
            return `${year}-${month}-${day}`;
        }
    },
}
</script>

<style>
.statistics-page {
    width: 100%;
    margin-bottom: 130upx;
}
.statistics-page .search-header {
    display: flex;
    align-items: center;
    height: 65upx;
    margin-bottom: 8upx;
    background: #fff;
}
.search-header .date-select {
    width: 30%;
    text-align: center;
    font-size: 13px;
    color: #666666;
}
.search-header .search-input {
    display: flex;
    align-items: center;
    width: 70%;
    position: relative;
    font-size: 13px;
}
.search-input img{
    position: absolute;
    left: 20upx;
    width: 14px;
    height: 14px;
}
.search-input input{
    width: 70%;
    height: 40upx;
    line-height: 40upx;
    padding-left: 60upx;
    margin-right: 20upx;
    background:rgba(241,241,241,1);
    border-radius:6px;
}
.search-input .search-btn{
    width:70upx;
    height:40upx;
    line-height:40upx;
    text-align: center;
    font-size: 11px;
    color: #fff;
    background:rgba(255,204,0,1);
    border-radius:6upx;
}
.statistics-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 150upx;
    margin-left: 13upx;
    margin-right: 13upx;
    padding-top:10upx;
    background:rgba(255,255,255,1);
    border-radius:4px;
    margin-bottom: 8upx;
}
.statis-num {
    font-size: 14px;
    margin-left: 15upx;
    margin-bottom: 10upx;
}
.statistics-item .title-row{
    display: flex;
    align-items: center;
    font-size: 11px;
    text-align: center;
    color: #666666;
}
.statistics-item .info-row{
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    color: #000;
}
.statistics-item .code{
    font-size: 11px;
    color: #FFCC00;
    margin-left: 10upx;
    line-height: 40upx;
}
.title-row text,.info-row text {
    width: 33%;
}
.none-item {
    color: #888;
    line-height: 350px;
    text-align: center;
}
</style>