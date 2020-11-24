<template>
    <view class="appointment-page">
        <view class="venue-tab" @click="intoVenueDetail">
            <text class="venue-name">{{venueData.name}}</text>
            <text class="arrow"></text>
        </view>
        <template v-if="ticketList.length === 0">
            <view class="no-ticket">
                <text>
                    暂无可用来预约的联票，请先去绑定联票
                </text>
                <view class="btn" @click="goTobind">绑定联票</view>
            </view>
        </template>
        <template v-else>
            <view class="list-cover">                
                <view v-for="(item,index) in ticketList" :key="index" class="chose-item" @click="changeCheckedState(index)">
                    <checkbox :checked="!!item.checked"></checkbox>
                    <view class="ticket-info"> 
                        <view class="ticket-info-warp">                         
                            <view class="info-item">                        
                                <view class="bind-label">姓名: </view>
                                <view> {{item.bindingName}}</view>
                            </view>
                            <view class="info-item">                        
                                <view >所属联票 </view>
                                <view class="bind-name"> {{item.itemName}}</view>
                                <view >编号 </view>
                                <view class="bind-name"> {{item.childCode}}</view>
                            </view>
                        </view> 
                    </view>
                </view>
            </view>
            <view class="btn" @click="startAppoinment">开始预约</view>
        </template>
        <template v-if="showBox">            
            <view class="mask"></view>
            <view class="box">
                <view class="title">
                    预约须知
                </view>
                <view class="box-name">
                    {{bookingData.needOrderInfo}}
                </view>
                <view class="confirm-btn" @click="closeBox">我知道了</view>
            </view>  
        </template>  
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'appointmentPage',
    data() {
        return {
            showBox: false,
            ticketList: [],
            venueId: '',
            venueData: null,
            bookingData: null,
            forbidClick: false
        }
    },
    computed: {        
        ...mapState(['userInfo']),  
    },
    created() {
        this.hasLogin()
        this.$nextTick(() => {
            this.getVenueDetail()
        })
    },
    onLoad(option) {
        this.venueId = option.id
    },
    methods: {        
        hasLogin () {
            let hasLogin = !!this.userInfo
            if (!hasLogin) {  
                this.$tip.toast('请先登陆','none')              
                uni.reLaunch({
                    url: '../login/login',
                });
            } else {                    
                this.showBox = true
                this.getTicketList()
            }
        },
        async getVenueDetail () {
            const res = await this.$api.getVenueDetail(this.venueId)
            if (res.code === '0') {
                this.venueData = res.data
                this.bookingData = {
                    booking: res.data.booking,
                    bookingMax: res.data.bookingMax,
                    ...JSON.parse(res.data.bookingRedundancy)
                }
            }
        },
        changeCheckedState (index) {
            this.ticketList[index].checked = !this.ticketList[index].checked
        },
        async getTicketList() {
                let params = {
                    pageNum: 1,
                    pageSize: 100,
                    username: this.userInfo.username
                }
                const res = await this.$api.bindTicketList(params)
                if (res.code === '0') {
                    if (res.data.list.length > 0) {
                        res.data.list.forEach(item => {
                            this.ticketList.push({
                                ...item,
                                checked:false
                            })
                        });
                    } else {
                        this.$tip.toast('还未绑定联票,请先去绑定','none')
                        uni.redirectTo({
                            url: '/pages/bindTicket/bindTicket'
                        })
                    }
                }
            },  
        async  startAppoinment() {
            if (this.forbidClick) {
                return
            }
            if (!this.countTime()) {
                this.$tip.alertDialog(`当前时间段不可预约，请在${this.bookingData.startTime}~${this.bookingData.endTime}内预约`)
                return
            }
            let tempArr = this.processData()
            if (tempArr.length === 0) {
                this.$tip.toast('请至少选择一张票','none')
                return
            }
            this.forbidClick = true
            // 获取第二日凌晨时间
            let curDate = new Date();
            // let now = new Date(new Date(curDate.getTime() + 24*60*60*1000).setHours(23, 59, 59, 59))
            let now = new Date(new Date().setHours(23, 59, 59, 59))
            console.log('now',now)
            let params = {
                bookingTime: now,
                ticketDOList: tempArr,
                venueId: this.venueId
            }
            let res = await this.$api.appointmentVenue(params)
            if (res.code === '0') {
                this.$tip.toast('预约成功','none')
                uni.redirectTo({                
                    url: '../appointmentList/appointmentList'
                })
            } else {                
                this.$tip.toast(`${res.code}预约失败,${res.message}`,'none')
                this.forbidClick = false
            }
        },
        countTime () {
            let now = new Date().getHours()
            let start = this.bookingData.startTime.split(':')[0]
            let end = this.bookingData.endTime.split(':')[0]
            console.log(now,start,end,now >= start,now < end)
            return now >= start && now < end
        },
        processData () {
            let tempArr = this.ticketList.filter((ele) => {
                return ele.checked
            })
            let tempArr2 = tempArr.map((item) => {
                return {
                    childCode: item.childCode,
                    itemType: 1,
                    password: item.password
                }
            })
            return tempArr2
        },
        closeBox() {
            this.showBox = false
        },        
        intoVenueDetail () {
            uni.navigateTo({
                url: `/pages/venueDetail/venueDetail?id=${this.venueId}`
            })
        },
        goTobind () {
            uni.redirectTo({
                url: '/pages/bindTicket/bindTicket'
            })
        }
    },
}
</script>

<style>  
.appointment-page {
    width: 100vw;
    min-height: 100vh;
    padding: 10px;
    background: #f3f3f3;
}  
.venue-tab {    
    display: flex;
    align-items: center;
    justify-content: space-between;    
    width: 100%;
    height: 30px;
    font-size: 14px;
    background: #fff;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}
.chose-item {     
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 120upx;
    padding-left: 5px;
    padding-right: 5px;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
}
.list-cover .chose-item:last-of-type {
    margin-bottom: 120upx;
}
.ticket-info {
    display: flex;
    margin-left: 10upx;
    flex-direction: column;
    align-items: center;
}
.info-item {
    font-size: 14px;
    display: flex;
    align-items: flex-end;
    flex-direction: row;
}
.bind-label {
    margin-right: 5px;
    font-weight: 700;
}
.bind-name {
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 400;
    font-size: 12px;    
    color: #888;
}
.arrow {        
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 5px;
    border: 1px solid #38210B;
    transform: rotate(45deg);
    border-left: transparent;
    border-bottom: transparent;
}
.no-ticket {
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.no-ticket text{
    font-size: 14px;
    color: #353535;
    margin-bottom: 20px;
}
.appointment-page .btn{
    position: fixed;
    bottom: 20upx;
    width: 78.4%;
    height: 74upx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    line-height: 74upx;
    text-align: center;
    color: #fff;
    border-radius: 6px;
    background: linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));;
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