<template>
    <view class="map-page">
        <map style="width: 100%; height: 100vh;" :latitude="coordinates[0].lat" :longitude="coordinates[0].lng" :markers="covers" @markertap="handleMarkertap"></map>
    </view>
</template>

<script>
export default {
    data() {
        return {
           coordinates: [],
           covers: []
        }
    },
    onLoad(option) {
        console.log(option.coordinates,1111)
       this.coordinates = JSON.parse(option.coordinates)
    },
    mounted() {
        this.processCovers()
    },
    methods: {
        handleMarkertap (val) {
            console.log(val)
            let obj = this.covers.find((item) => {return item.id === val.markerId})
            let lng = obj.longitude
            let lat = obj.latitude
            let name = obj.name
            uni.openLocation({
                longitude: Number(lng),
                latitude: Number(lat),
                name: name
            })
        },
        processCovers () {
            let temp = {
                width: 40,
                height: 40,
                iconPath: '../../static/img/homeHL.png'
            }
            this.coordinates.forEach((item,index) => {
                this.covers.push({
                    ...temp,
                    id: index + 1,
                    longitude: item.lng,
                    latitude: item.lat,
                    name: item.name,
                    label: {
                        borderColor: '#ff0',
                        bgColor: '#fff',
                        padding: '5px',
                        borderWidth: '2px',
                        content: `${item.name} (点击图标导航)`
                    }
                })
            });
        }
    },
}
</script>

<style>
    .map-page {
        width: 100%;
    }
</style>

