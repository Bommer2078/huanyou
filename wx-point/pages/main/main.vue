<template>
    <view class="content">
        <view class="ticket-banner" :class="{'header-layout-style' : userList.length > 0}">
            <img class="bg" src="/static/img/bannerBg.png">
            <view class="bg-color"></view>
            <view class="ticket-container">
                <view class="header">
                    <view @click="choseLocation">                        
                        <img src="/static/img/address.svg">
                        <text>{{locationObj.name}}</text>
                    </view>
                    <view @tap="callPhone">                        
                        <text>客服</text> 
                        <img src="/static/img/ask.svg">
                    </view>
                </view>
                <view class="search-container" @click="gotoSearchPage">
                    <view class="search-input">
                        <image src="../../static/img/search-black.svg" />
                        <text>快来输入点什么～</text>
                    </view>
                </view>
                <view class="user-select-group">
                    <template v-if="userList.length > 0">
                        <view class="user-select-tip">·点击用户头像可进行核销</view>
                        <view class="header-list-cover">                            
                            <view v-for="item in userList" :key="item.id" class="header-cover" @click="handleClickHead(item)">
                                <image src="../../static/img/userHead.svg"/>
                            </view>
                        </view>
                    </template>
                </view>
                <view class="banner" @click="intoTicket">
                    <img :src="ticketBaseInfo.photo">
                </view>
            </view>  
            <view class="option-btn">
                <image src="../../static/img/into.svg"  class="switch-btn" v-if="true"/>
                <image src="../../static/img/switch.svg"  class="into-detail-btn" v-else/>
            </view>          
        </view>
        <view class="mian-container">
            <view class="item-container" v-if="goodsArr.length > 0">
                <view class="tip">
                    <view class="title">
                        <text>特惠产品</text>
                    </view>
                </view>
                <view class="card" v-for="item in goodsArr" :key='item' @click="gotoGoods(item)">
                    <img :src="item.photo" >
                    <view class="tip goods-tip">{{item.name}}</view>
                </view>
            </view>
            <view class="item-container" v-if="venueArr.length > 0">
                <view class="tip"  @click="gotoMoreVenue">
                    <view class="title">
                        <image src="../../static/img/titleIcon.svg" />
                        <text>本期精选场馆</text>
                    </view>
                    <view class="more">
                        更多 >
                    </view>
                </view>
                <view class="card footer-style" v-for="item in venueArr" :key='item' @click="intoVenueDetail(item)">
                    <img :src="item.photo" >
                    <image src="../../static/img/foots.svg" class="footer-icon" />
                    <view class="book-tip" v-if="item.booking">本场馆需要提前预约</view>
                    <view class="tip">
                        <view class="mask">                          
                        </view>
                        <view style="z-index: 5;">{{item.name}}</view>
                        <view style="z-index: 5;">{{item | rulesText}}</view>
                    </view>
                </view>
            </view>
        </view>     
        <chose-ticket-list :ticket-list="ticketList" :showTicketList="showTicketList" @choseTicket="choseTicket"></chose-ticket-list>   
        <template v-if="showCheckinBox">
            <checkin-box @closeBox="closeBox"></checkin-box>   
        </template>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import choseTicketList from '../../components/choseTicketList'
import checkinBox from '../../components/checkinBox'
    export default {
        data() {
            return {
                venueArr: [],
                goodsArr: [],
                phoneCall :'4006099109',
                showTicketList: false,
                showCheckinBox: false,
                ticketList: [],
                versionToLow: true,
                userList: [{id:1}]
            }
        },
        components: {
            choseTicketList,
            checkinBox
        },
        computed: {
            ...mapState(['locationObj','ticketBaseInfo','venueTypeArr','roleType'])
        },
        created() {            
            // uni.setEnableDebug({            
            //     enableDebug: true            
            // })
            if (this.roleType === 'business') {
                uni.reLaunch({
                    url: '/pages/business/business'
                });
                return
            }
            this.getVenueTypeList()
        },
        onShow() {    
            uni.showShareMenu({})    
            this.getWxvison()    
        },
        onShareAppMessage: function( options ){
            return this.$commenShare()
        },
        methods: {
            getWxvison () {
                wx.getSystemInfo({
                    success: (res) => {
                        let version = res.version.split('.')
                        console.log(res)
                        this.versionToLow = version[0] < 7
                        console.log(version[0])
                        this.initGlobalData()
                    },
                    fail: (err) => {
                        console.log(err)
                        this.initGlobalData()
                    }
                })
            },
            choseLocation () {                
                uni.navigateTo({
                    url: '/pages/locationChose/locationChose'
                })
            },
            choseTicket (obj) {               
                this.$store.commit('SET_TICKET_OBJ',obj)    
                this.getGoodsData()
                this.getVenueData()
                this.showTicketList = false 
            },
            async initGlobalData () {
                // 判断本地是否有地址信息
                 if (!this.locationObj || !this.locationObj.id) {
                     const res1 = await this.$api.getPlaceList()
                    if (res1.code === '0') {
                        this.locationArr = res1.data
                        if (this.versionToLow) {
                            this.$tip.toast('微信版本过低，建议升级','none')
                            this.$store.commit('SET_LOCATION_OBJ', this.locationArr[0])
                            this.getTicketList()
                            return
                        }
                        wx.getLocation({
                            success: (res) => {
                                // 引入第三方地图获取地址名称
                                this.getLocal(res.latitude,res.longitude)
                                .then((userLocation) => {
                                        let tempLocation = this.locationArr.find((item) => {
                                            return item.name === userLocation
                                        })
                                        // 如果没有则获取用户的地址信息 --> 对比已有城市进行跳转，否则跳转默认城市
                                        this.$store.commit('SET_LOCATION_OBJ', tempLocation || this.locationArr[0])
                                        this.getTicketList()
                                    }
                                ).catch(() => {                                    
                                    this.$store.commit('SET_LOCATION_OBJ', this.locationArr[0])
                                    this.getTicketList()
                                })
                            },
                            fail: (err) => {
                                console.log(err)
                                this.$store.commit('SET_LOCATION_OBJ', this.locationArr[0])
                                this.getTicketList()
                            }
                        })
                    }                 
                } else if (!this.ticketBaseInfo || !this.ticketBaseInfo.id) {
                    this.getTicketList()
                } else {                     
                    this.getGoodsData()
                    this.getVenueData()
                }
            },
            getLocal (lat,lon) {                
                if (this.$qqmapsdk) {             
                    let val = new Promise(
                        (resolve, reject) => {                                  
                            this.$qqmapsdk.reverseGeocoder({
                                location: {
                                    latitude: lat,
                                    longitude: lon
                                },
                                success: (res) => {
                                    console.log(res)
                                    let city = res && res.result && res.result.address_component && res.result.address_component.city  
                                    if (city) {
                                        city = city.substring(0,city.length-1)         
                                        resolve(city)
                                    }                         
                                    resolve(city)
                                },
                                fail: (err) => {
                                    console.log(err)
                                    reject('')
                                }
                            })
                        }
                    ) 
                    return val
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
                    this.ticketList = res2.data.list
                    if (this.ticketList.length === 1) {                        
                        this.$store.commit('SET_TICKET_OBJ',this.ticketList[0])          
                        this.getGoodsData()
                        this.getVenueData()
                    } else if (this.ticketList.length > 1) {
                        this.showTicketList = true
                    }                  
                }  
            },                
            async getVenueData () {                       
                let params = {
                    yearTicketId: this.ticketBaseInfo.id,
                    pageNum: 1,
                    pageSize: 10,
                }                
                const res = await this.$api.getVenueList(params)
                if (res.code === '0') {
                    this.venueArr = res.data.list
                }
            },
            async getGoodsData () {                       
                let params = {
                    pageNum: 1,
                    pageSize: 10,
                    status: 1
                }                
                const res = await this.$api.getGoodsList(params)
                if (res.code === '0') {
                    this.goodsArr = res.data.list
                }
            },
            async getVenueTypeList() {
                const res = await this.$api.getVenueTypeList()
                if (res.code === '0') {
                    this.$store.commit('SET_VENUE_TYPE_ARR',res.data)
                }
            },
            gotoSearchPage () {
                uni.navigateTo({
                    url: '/pages/searchPage/searchPage'
                })
            },
            intoVenueDetail(item) {                
                let tempStr = this.$options.filters['rulesText'](item)
                uni.navigateTo({
                    url: `/pages/venueDetail/venueDetail?id=${item.id}&str=${tempStr}`
                })
            },
            intoAppoinment (id) {
                uni.navigateTo({
                    url: `/pages/appointmentPage/appointmentPage?id=${id}`
                })
            },
            intoTicket () {
                uni.switchTab({
                    url: `/pages/ticket/ticket`
                })
            },
            gotoGoods(item) {
                uni.navigateTo({
                    url: `/pages/goodsDetail/goodsDetail?id=${item.id}`
                })
            },
            gotoMoreVenue () {
                uni.navigateTo({                
                    url: '../venueList/venueList'
                })
            },
            callPhone () {
                let phoneCall = [this.phoneCall]
                uni.showActionSheet({
                    itemList: [phoneCall[0]],
                    success: function (res) {
                        console.log(res)
                        wx.makePhoneCall({
                            phoneNumber: phoneCall[res.tapIndex], 
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
            handleClickHead (obj) {
                this.showCheckinBox = true
            },
            closeBox (obj) {
                this.showCheckinBox = false
            }
        },
    }
</script>

<style>
.content {
    width: 100%;
    color: #353535;
}
.ticket-banner {
    position: relative;
    width: 100%;
    height: 454upx;
    margin-bottom: 80upx;
}
.ticket-banner .bg{
    position: absolute;
    bottom: -155upx;
    width: 100%;
    z-index: 2;
}
.ticket-banner .bg-color{
    position: absolute;
    top:0;
    width: 100%;
    height: 300upx;
    background: #FFCC00;
    z-index: 1;
}
.ticket-container {
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    z-index: 3;
}
.ticket-container .banner {
    width: 93%;
    height: 310upx;
    background: #F6F6F6;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 1px 5px 18px 0px rgba(0, 0, 0, 0.31);
}
.option-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 70upx;
    height: 70upx;    
    background: linear-gradient(-53deg, #FFA80F, #FFCC00);
    border-radius: 50%;
    bottom: -70upx;
    right: 120upx;
    z-index: 3;
}
.option-btn image{
    width: 50upx;
    height: 50upx;
}
.banner img{
    width: 100%;
    height: 310upx;
}
.ticket-container .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-left: 14upx;
    padding-right: 14upx;
    height: 66upx;
    font-size: 14px;
    font-weight: 400;
    background: #FFCC00;
}
.header img {
    width: 18px;
    height: 18px;
    margin-left: 5px;
    margin-right: 5px;
}
.header view {
    display: flex;
    align-items: center;
}
.ticket-container .search-container {
    width: 100%;
    padding-left: 14upx;
    padding-right: 14upx;
    padding-top: 10upx; 
    height: 65upx;
    margin-bottom: 27upx;    
    background: #FFCC00;
}
.ticket-container .search-container image{
    width: 30upx;
    height: 30upx;
    margin-right: 20upx;
}
.ticket-container .user-select-group {
    width: 100%;
    background: #FFCC00;
    min-height: 24upx;
    padding-left: 18upx;
    padding-right: 18upx;
}
.user-select-tip {
    font-size: 26upx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #38220C;
}
.ticket-container .header-list-cover{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 128upx;
}
.ticket-container .user-select-group .header-cover{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90upx;
    height: 90upx;
    border: 2px solid #fff;
    border-radius: 50%;
    overflow: hidden;
}
.ticket-container .user-select-group .header-cover image{
    width: 90upx;
    height: 90upx;
}
.header-cover + .header-cover {
    margin-left: 70upx;
}
.header-layout-style {
    height: 590upx;
}
.search-input {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 54upx;
    background: #FFE785;
    border-radius: 4px;
    color:#38210B;
    font-size: 12px;
    line-height: 54upx;
    padding-left: 10px;
}
.mian-container {    
    width: 100%;
    z-index: 1;
    position: absolute;
}
.item-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 14upx;
    padding-right: 14upx;
    border-bottom: 2px solid #F6F6F6;
}
.item-container .tip {   
    width: 100%; 
    display: flex;
    flex-direction: row;
    padding-top: 30upx;
    padding-bottom: 30upx;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10upx;
}
.item-container .appoinment-btn {
    position:absolute;
    top: 20upx;
    right: 20upx;
    width: 114upx !important;
    height: 116upx !important;
    z-index: 1;
}
.footer-style .book-tip{    
    text-align: left;
    left: 0;
    padding-left: 15px;
    padding-right: 0px;
    background: linear-gradient(90deg,  rgba(219, 179, 16, 1),rgba(255, 145, 15, 0));
}
.book-tip {
    height: 86upx;
    line-height: 86upx;
    width: 66vw;
    position: absolute;
    top: 40%;
    right: 0;
    color: #fff;
    font-size: 34upx;
    font-weight: 500;
    padding-right: 15px;
    text-align: right;
    background: linear-gradient(-90deg, rgba(255, 145, 15, 1), rgba(255, 204, 0, 0));
}
.tip .title {
    width: 120px;
    height: 16px;
    position: relative;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
}
.tip .title image {
    width: 26upx;
    height: 26upx;
    margin-right: 10upx;
}
.tip .title text {
    position: absolute;
    z-index: 3;
}
.tip .more {
    font-size: 12px;
    color: #B0B0B0;
}
.item-container .card {
    position: relative;
    width: 100%;
    height: 350upx;
    background: #F6F6F6;
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
}
.item-container .footer-style {
    background: rgba(0, 0, 0, 0.66);
}
.item-container .footer-style .footer-icon{
    position: absolute;
    width: 100upx;
    height: 100upx;
    right: 0;
    top: 10upx;
    z-index: 5;
}
.item-container .goods-tip {
    color: #ffcc00;
}
.item-container .card img{
    width: 100%;
    height: 350upx;
}
.item-container .card .tip .mask{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 1px;
    background: #000;
    opacity: .5;
    background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    z-index: 1;
}
.item-container .card .tip{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    bottom: 0;
    padding: 0;
    padding-left: 30upx;
    padding-bottom: 10upx;
    margin: 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    color: #fff;
    z-index: 1;
}
</style>
