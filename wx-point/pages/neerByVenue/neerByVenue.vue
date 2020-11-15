<template>
    <view class="neer-venue-list">
        <view class="venue-item" v-for="item in venueList" :key="item.id" @click="intoVenue(item.id)">
            <view class="venue-info">
                <view class="venue-name">{{item.name}}</view>
                <view class="venue-distance">
                    <img src="/static/img/iconGroup/location.svg">
                    <text>{{item.distance}}Km</text>
                </view>
            </view>
            <view class="venue-img">
                <img :src="item.photo">
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            venueList: [],
            userlat: '',
            userlng: ''
        }
    },
    computed: {        
        ...mapState(['locationObj']),
    },
    created() {
        this.getUserLocation()
    },
    methods: {
        intoVenue (id) {
            uni.navigateTo({
                url: `/pages/venueDetail/venueDetail?id=${id}`
            })
        },
        getUserLocation() {
            wx.getLocation({
                success: (res) => {
                    console.log('res.latitude,res.longitude',res.latitude,res.longitude)
                    this.getNearbyVenue(res.latitude,res.longitude)
                },
                fail: () => {
                    this.$tip.toast('获取位置信息失败','none')
                }
            })
        },   
        async getNearbyVenue (lat, lng) {
            this.userlat = lat
            this.userlng = lng
            let params = {
                placeId : this.locationObj.id,
                userlat  : lat,
                userlng  : lng,
            }
            const res = await this.$api.getNearbyVenue(params)
            if (res.code === '0') {                
                this.processData(res.data)
            }
        },
        processData (arr) {
            arr.forEach(item => {
                let distance = this.getDistance(this.userlat,this.userlng,item.addressLat,item.addressLng)
                this.venueList.push({
                    ...item,
                    distance
                })
            })
        },
        getDistance( lat1,  lng1,  lat2,  lng2){
            var radLat1 = lat1*Math.PI / 180.0;
            var radLat2 = lat2*Math.PI / 180.0;
            var a = radLat1 - radLat2;
            var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
            Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
            s = s *6378.137 ;// EARTH_RADIUS;
            s = Math.round(s * 10000) / 10000;
            s = s.toFixed(2)
            return s;
        }
    }
}
</script>

<style lang="scss" scoped>
    .neer-venue-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        background: #f3f3f3;
        height: 100vh;
        overflow-y: auto;
        padding-top: 10upx;
        .venue-item {
            display: flex;
            justify-content: space-between;
            width: 714upx;
            height: 191upx;
            background: #fff;
            border-radius: 8upx;
            margin-bottom: 10upx;
            padding: 10upx;
            .venue-info {
                display: flex;
                height: 100%;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                .venue-name {
                    font-size: 36upx;
                    color: #000;
                }
                .venue-distance {
                    font-size: 22upx;
                    color: #ffcc00;
                    image {
                        width: 27upx;
                        height: 33upx;
                    }
                }
            }
            .venue-img {
                flex-shrink: 0;
                width: 220upx;
                height: 169upx;
                border-radius: 8upx;
                overflow: hidden;
                image {                    
                    width: 220upx;
                    height: 169upx;
                }
            }
        }
    }
</style>