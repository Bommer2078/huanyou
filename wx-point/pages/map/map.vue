<template>
    <view class="map-page">
        <map style="width: 100%; height: 100vh;" :latitude="lat" :longitude="lng" :markers="covers" @markertap="handleMarkertap"></map>
    </view>
</template>

<script>
export default {
    data() {
        return {
            lng: '',
            lat: '',
            name: ''
        }
    },
    computed: {
        covers() {
            return [{
                id:1,
                longitude: this.lng,
                latitude: this.lat,
                width: 50,
                height: 50,
                label: {
                    content: `${this.name} (点击图标导航)`,
                    borderColor: '#ff0',
                    bgColor: '#fff',
                    padding: '5px',
                    borderWidth: '2px'
                },
                iconPath: '../../static/img/homeHL.png'
            }]
        }
    },
    onLoad(option) {
       this.lng = option.lng
       this.lat = option.lat
       this.name = option.name
    },
    methods: {
        handleMarkertap () {
            uni.openLocation({
                longitude: Number(this.lng),
                latitude: Number(this.lat),
                name: this.name
            })
        }
    },
}
</script>

<style>
    .map-page {
        width: 100%;
    }
</style>

