<template>
    <view class="location-chose">
        <view class="location-list">
            <view 
                class="location-item" v-for="(item,index) in locationList" 
                :key="index" 
                :class="{'location-chosed':nowLocation.id === item.id}"
                @click.stop="choseLocation(item)">{{item.name}}</view>
        </view>
        <chose-ticket-list :ticket-list="ticketList" :showTicketList="showTicketList" @choseTicket="choseTicket"></chose-ticket-list>
        <loading :show-loading="showLoading"></loading> 
    </view>
</template>

<script>
import { mapState } from 'vuex'
import loading from '../../components/loadding'
import choseTicketList from '../../components/choseTicketList'
export default {
    data() {
        return {
            nowLocation: null,
            locationList: [],
            ticketList: [],
            showTicketList: false,
            showLoading: false
        }
    },
    components: {
        loading,
        choseTicketList
    },
    computed: {
        ...mapState(['locationObj'])
    },
    created() {
        this.nowLocation = JSON.parse(JSON.stringify(this.locationObj))
        this.getLocationArr()
    },
    methods: {
        async getLocationArr() { 
            this.showLoading = true           
            const res1 = await this.$api.getPlaceList()
            if (res1.code === '0') {
                this.locationList = res1.data
            }            
            this.showLoading = false
        },
        async getTicketList () {
            let params = {
                pageNum: 1,
                pageSize: 10,
                placeId: this.nowLocation.id
            }               
            const res2 = await this.$api.getTickeList(params)
            if (res2.code === '0') {
                this.ticketList = res2.data.list
                if (res2.data.list && res2.data.list.length === 1) {   
                    this.choseTicket(res2.data.list[0])
                } else if (res2.data.list && res2.data.list.length > 1) {
                    this.showTicketList = true
                }
            }  
        },
        choseLocation (locationObj) {
            if (!this.showTicketList) {     
                this.nowLocation = locationObj         
                this.getTicketList()
            }
        },
        choseTicket (tiketObj) {            
            this.$store.commit('SET_LOCATION_OBJ', this.nowLocation)
            this.$store.commit('SET_TICKET_OBJ', tiketObj)
            uni.navigateBack()
        }
    },
}
</script>

<style>
    .location-chose {
        width: 100%;
        background: #fff;
    }
    .location-list {
        display: flex;
        justify-content: space-around;
        flex-wrap:wrap;
        padding: 20upx;
    }
    .location-chosed {
        opacity: 1 !important;
    }
    .location-item {
        min-width: 30%;
        height: 80upx;
        line-height: 80upx;
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
        background: #ffcc00;
        border-radius: 6px;
         opacity: 0.6;
        box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
    }
     .location-item + .location-item {
        margin-bottom: 20upx;
    }
</style>