<template>
    <view class="publish-page">        
        <rich-text :nodes="aboutInfo"></rich-text>
    </view>
</template>

<script>
export default {
    data () {
        return { 
            aboutInfo: '',
            version: ''
        }
    },
    onShow () {
        this.getAbout()
    },
    methods: {        
        async getAbout () {
            let res = await this.$api.getAboutList({type:'about'})
            if (res.code === '0') {
                let ele = await this.$api.getAbout(res.data[0].id)
                if (ele.code === '0') {
                    this.aboutInfo = ele.data.content
                    this.version = ele.data.version
                    let temp = uni.getStorageSync('about-version')
                    if (temp !== this.version) {
                        uni.setStorageSync('about-version',this.version)                            
                        this.showBox = true
                    }
                }
            }
            
        }
    },
}
</script>

<style>
.publish-page {
    padding: 40upx;
}
</style>
