
<template>
    <view class="order-page">
        <template v-for="(item,index) in orderArr">
            <view :key="index">                
                <ticket-order :item="item" v-if="item.itemType === 1 || item.itemType === 2" @reflash="reflash"></ticket-order>
                <goods-order  :item="item" v-else></goods-order>
            </view>
        </template>
        <view class="nothing" v-if="orderArr && orderArr.length === 0">
            暂无订单
        </view>
    </view>
</template>

<script>
import ticketOrder from '../../components/ticket-order'
import goodsOrder from '../../components/goods-order'
export default {
    data() {
        return {
            orderArr: [],
            pageNum:1,
            pageSize:100
        }
    },
    components: {
        ticketOrder,
        goodsOrder
    },
    created() {
        this.getOrderList()
    },
    onPullDownRefresh() {        
        this.getOrderList()
        setTimeout(function () {
            uni.stopPullDownRefresh();
        }, 1000);
    },
    methods: {
        async getOrderList () {
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            let res = await this.$api.getOrderList(params)
            if (res.code === '0') {
                this.orderArr = res.data.list
            }
        },
        reflash () {
            setTimeout(() => {          
                this.getOrderList()
            }, 2000);
        }
    },
}
</script>

<style>
    .order-page {
        width: 100%;
        min-height: 100vh;
        padding-left: 18upx;
        padding-right: 18upx;
        padding-top: 18upx;
        background: #F3F3F3;
    }
    .ticket-order {margin-bottom: 20upx;}
    .nothing {
        text-align: center;
        margin-top: 50px;
    }
</style>