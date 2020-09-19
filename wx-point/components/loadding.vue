<template>
    <view class="loading-page" v-if="showLoading">
        <view class="mask"></view>
        <img src="/static/img/loading.svg">
    </view>
</template>

<script>
export default {
    name: 'loading',
    props: {
        showLoading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
.loading-page img{    
    display: block;
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    -webkit-animation: loadding .8s linear infinite;    
    z-index: 11
}
.mask {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background: #888;
    opacity: .5;
    z-index: 10
}
@-webkit-keyframes loadding{ 
		0%{-webkit-transform:rotate(0deg);}
 
		25%{-webkit-transform:rotate(90deg);}
 
		50%{-webkit-transform:rotate(180deg);}
 
		75%{-webkit-transform:rotate(270deg);}
 
		100%{-webkit-transform:rotate(360deg);}
 
}
</style>