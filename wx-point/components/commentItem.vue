<template>
    <view class="comment-item">
        <view class="comment-head">
            <view class="comment-info">
                <text class="comment-name">{{commentData.username | userText}}:</text>
                <text class="comment-time">{{commentData.creatTime}}</text>
            </view>
            <view class="comment-menu" @click="changeShowMenu" v-show="isSelf">
                <view class="comment-menu-dot"></view>
                <view class="comment-menu-dot"></view>
                <view class="comment-menu-dot"></view>
                <view class="comment-menu-select" v-show="showMenu">
                    <view class="menu-item" @click="deletComment">删除</view>
                </view>
            </view>
        </view>
        <view class="comment-content">
            {{commentData.commentText}}
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'commentItem',
    props: {
        commentData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    filters: {
        userText (val) {
            let temp1 = val.split('')
            let temp2 = val.split('')
            let val1 = temp1.splice(0, 3)
            let val2 = temp2.splice(7, 11)
            return `${val1.join('')}****${val2.join('')}`
        }
    },
    data () {
        return {
            showMenu: false
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isSelf() {
            if (!this.userInfo) return false
            this.commentData.username === this.userInfo && this.userInfo.username
        }
    },
    methods: {
        changeShowMenu () {
            this.showMenu = !this.showMenu
        },        
        async deletComment () {
            let params = {
                id: this.commentData.id
            }
            const res = await this.$api.deletComment(params)
            if (res.code === '0') {                
                this.$tip.toast('删除成功','none')
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.comment-item {
    width: calc(100% - 40upx);
    margin-left: 20upx;
    margin-right: 20upx;
    padding-top: 30upx;
    padding-bottom: 30upx;
    border-bottom: 4px solid #F6F6F6;
    .comment-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20upx;
        .comment-info {
            display: flex;
            flex-direction: column;
            .comment-name {
                font-size: 30upx;
                color: #4F4D4D;
            }
            .comment-time {
                font-size: 26upx;
                color: #ACACAC;
            }
        }
        .comment-menu {
            display: flex;
            align-items: center;
            justify-content: space-around;
            position: relative;
            width: 60upx;
            height: 30upx;
            .comment-menu-dot {
                width: 10upx;
                height: 10upx;
                border-radius: 50%;
                background: #E1E1E1;
            }
            .comment-menu-select {
                position: absolute;
                top: 32rpx;
                right: 0rpx;
                height: 60upx;
                background: #fff;
                border-radius: 7upx;
                border: 1px solid #E1E1E1;
                &::before {
                    content: '';
                    position: absolute;
                    top: -8upx;
                    right: 7upx;
                    width: 0;
                    height: 0;
                    border-width: 0 10upx 10upx;
                    border-style: solid;
                    border-color: transparent transparent #fff;
                    z-index: 2;
                }
                &::after {
                    content: '';
                    position: absolute;
                    top: -10upx;
                    right: 7upx;
                    width: 0;
                    height: 0;
                    border-width: 0 10upx 10upx;
                    border-style: solid;
                    border-color: transparent transparent #E1E1E1;
                    z-index: 1;
                }
                .menu-item {
                    height: 60upx;
                    width: 88upx;
                    line-height: 60upx;
                    text-align: center;
                    color: #7C7C7C;
                    font-size: 28upx;
                }
                .menu-item + .menu-item  {
                    color: #FFCC00;
                    border-top: 1px solid #E1E1E1;
                }
            }
        }
    }
    .comment-content {
        font-size: 32upx;
        color: #010101;
    }
}
</style>