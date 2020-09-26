<template>
    <view class="appointment-list">
        <view class="table-title">
            <view class="th">姓名</view>
            <view class="th">联票名称</view>
            <view class="th">预约到访日</view>
            <view class="th">场馆名称</view>
        </view>
        <template v-if="appointmentList.length > 0">            
            <view v-for="(item,index) in appointmentList" :key="index"  class="appointment-item-cover">
                <view class="appointment-item" :class="{'bad-appointment' : item.status === 2}">                    
                    <view class="td">{{item.booker}}</view>
                    <view class="td">{{item.itemName}}</view>
                    <view class="td" v-if="item.status === 1">{{item.createTime | dateText}}</view>
                    <view class="td" v-else>已撤销</view>
                    <view class="td">{{item.venueName}}</view>
                </view>
                <view class="appointment-btn-group" v-show="true">
                    <view class="show-qr-btn">出 示</view>
                    <view class="cancel-btn">取 消</view>
                </view>
            </view>    
        </template>    
        <template v-else>
            <view class="no-data">
                暂无记录
            </view>
        </template>
        <template v-if="showBox">            
            <view class="mask"></view>
            <view class="box">
                <view class="title">
                    预约须知
                </view>
                <view class="box-name">
                    您当前预约使用的手机号为{{userInfo.username}}
                </view>
                <view class="confirm-btn" @click="closeBox">我知道了</view>
            </view>  
        </template>  
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'appointmentList',
    data() {
        return {
            appointmentList: [],
            pageNo: 1,
            pageSize: 10,
            total: 0,
            forbidLoading: false,
            showBox: false
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    created() {
        this.showBox = true
        this.getAppointmentList()
    },    
    filters: {
        dateText (val) {
            let platform  = ''
            uni.getSystemInfo({
                success:function(res){
                    platform = res.platform 
                }
            })
            let temp = val.replace(/-/g, '/').replace('T', ' ').replace('.000+0000', '')
            let time = platform == 'ios' ? temp : val
            let date = new Date(time).getTime()
            date = platform == 'ios' ? date + 8*60*60*1000 : date
            let date2 = new Date(date)
			let year = date2.getFullYear()
			let month = date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1
            let day = date2.getDate() + 1 < 10 ? '0' + (date2.getDate() + 1) : date2.getDate() + 1
            
			return `${year}/${month}/${day}`
		},
    },
    onReachBottom() {
        if (!this.forbidLoading) {
            this.getAppointmentList()
        }
    },
    methods: {
        async getAppointmentList() {
            if (this.forbidLoading) return
            this.forbidLoading = true
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            let res = await this.$api.getBookingList(params)
            if (res.code === '0') {
                this.pageNo++
                this.appointmentList = this.appointmentList.concat(res.data.list)
                this.total = res.data.total
            }
            this.forbidLoading = false
        },
        closeBox () {
            this.showBox = false
        }
    },
}
</script>

<style>
    .appointment-list {
        width: 100%;
        padding-left: 14upx;
        padding-right: 14upx;
        background: #F3F3F3;
    }
    .table-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 73upx;
        padding-left: 20upx;
        padding-right: 20upx;
        font-size: 16px;
        color: #666;
    }
    .th,.td {
        text-align: center;
    }
    .th:nth-child(1), 
    .td:nth-child(1) {
        width: 18%;
    }
    .td:nth-child(1) {
        line-height: 92upx;
    }
    .th:nth-child(2), 
    .td:nth-child(2) {
        width: 25%;
    }
    .td:nth-child(2) {
        color: #ffcc00;
        font-weight: 400;
    }
    .th:nth-child(3), 
    .td:nth-child(3) {
        width: 35%;
    }
    .td:nth-child(3) {
        font-size: 12px;
    }
    .th:nth-child(4), 
    .td:nth-child(4) {
        width: 32%;
    }
    .bad-appointment {
        opacity: .5;
        background: #eee;
    }    
    .appointment-item-cover {
        background: #fff;
        border-radius: 8px;
        margin-bottom: 14upx;
    }
    .appointment-item {
        display: flex;
        flex-direction: row;       
        align-items: center; 
        justify-content: space-between;
        width: 100%;
        background: #fff;
        min-height: 150upx;
        padding-left: 20upx;
        padding-right: 20upx;
    }
    .appointment-btn-group {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        height: 70upx;
    }
    .appointment-btn-group .show-qr-btn,
    .appointment-btn-group .cancel-btn {
        width: 142upx;
        height: 47upx;
        font-size: 30upx;
        line-height: 47upx;
        border-radius: 10upx;
        text-align: center;
    }
    .appointment-btn-group .show-qr-btn {
        color: #fff;
        background: linear-gradient(-53deg, #FF900E, #FFCC00);
    }
    .appointment-btn-group .cancel-btn {
        color:#FFCC00;        
        border: 1px solid#FFCC00;
    }
    .td {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        color: #000;
        font-weight: 700;
        text-align: center;
        height: 92upx;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
    }
    .td + .td {
        border-left: 1px dashed #E3E3E3;
    }
    .box {
        position: fixed;
        top: -50upx;
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
        overflow: hidden;
        z-index: 4;
    }
    .box .title {
        width: 100%;
        height: 60upx;
        text-align: center;
        margin-bottom: 10upx;
        background: #ffcc00;
    }
    .box .box-name {
        width: 100%;
        text-align: left;
        font-size: 13px;
        padding: 20upx;
    }
    .confirm-btn {
        position: absolute;
        bottom: 20px;
        width: 78.4%;
        height: 74upx;
        margin: 0 auto;
        font-size: 16px;
        line-height: 74upx;
        text-align: center;
        color: #fff;
        border-radius: 6px;
        background: linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));;
    }
    .no-data {
        text-align: center;
        margin-top: 60px;
    }
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #888;
        opacity: .5;
        z-index: 3;
    }
</style>