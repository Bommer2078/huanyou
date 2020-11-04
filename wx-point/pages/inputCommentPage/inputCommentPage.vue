<template>
    <view class="input-comment-page">
        <view class="comment-cover">
            <textarea placeholder="输入您的评论" v-model.trim="content" maxlength="200"/>
            <view class="number-cover">
                <view class="input-number">
                    {{inputNumer}}
                </view>
                <view class="input-limite">/200</view>
            </view>
        </view>
        <view class="comment-btn" @click="submitComment">
            提交评论
        </view>
    </view>
</template>

<script>
export default {
    data () {
        return {
            content: '',
            venueId: ''
        }
    },
    computed: {
        inputNumer () {
            return this.content.length
        }
    },
    onLoad (option) {
        this.venueId = option.venueId
    },
    methods: {
        async submitComment () {    
            if (!String(this.content)) {                
                this.$tip.toast('请输入内容','none')
                return
            }        
            let params = {
                commentText: this.content,
                venueId: this.venueId
            }
            const res = await this.$api.submitComment(params)
            if (res.code === '0') {                     
                this.$tip.toast('评论成功，审核通过后可被展示','none')
                uni.navigateBack()
            } else {                 
                this.$tip.alertDialog(`${res.message}`)
            }
        }
    },
}
</script>

<style lang="scss">
    .input-comment-page {
        width: 100vw;
        height: 100vh;
        background:rgba(243, 243, 243, 1);
        .comment-cover {
            position: relative;
            height: 440upx;
            margin-bottom: 100upx;
            textarea {        
                font-size: 30upx;
                padding: 40upx;        
                width: 100vw;
                height: 440upx;
                background:#fff;
                word-break: break-all;
                box-sizing: border-box;
            }
        }
        .number-cover {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 20upx;
            right: 20upx;
        }
        .input-number {
            color: rgba(227, 0, 0, 1);
            font-size: 26upx;
        }
        .input-limite {
            color: rgba(160, 160, 160, 1);
            font-size: 26upx;
        }
        .comment-btn {
            width: 588upx;
            height: 74upx;
            line-height: 74upx;
            font-size: 32upx;
            color: #fff;
            text-align: center;
            margin: 0 auto;
            background: linear-gradient(-53deg, #FF900E, #FFCC00);
            border-radius: 14upx;
        }
    }
</style>