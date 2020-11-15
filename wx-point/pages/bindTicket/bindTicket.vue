<template>
    <view class="bind-ticket">
        <view class="ticket-header">
            {{ticketName}}
        </view>        
        <view class="ticket-body">
            <view class="item">
                <text class="lable">姓名</text>
                <input type="text" placeholder="请输入姓名" v-model.trim="name">
            </view>
            <view class="item" @click="showWarning">
                <text class="lable">头像上传</text>
                <view class="loading" v-if="imgUploading">上传中。。。</view>
                <img :src="headerImg" class="header-img" v-else-if="headerImg">
                <view class="icon-arrow">上传</view>
            </view>
        </view>
        <view class="ticket-info">
            <view class="item">
                <text class="lable">手机号码</text>
                <text class="value">{{userInfo.phone | phoneText}}</text>
            </view>
            <view class="item">
                <text class="lable">联票编码</text>                
                <input type="text" placeholder="请输入联票编码" v-model.trim="ticketCode" @blur="handlerCodeBlur($event)">
            </view>
            <view class="item">
                <text class="lable">密码</text>
                <input type="text" placeholder="请输入联票密码" v-model.trim="ticketPassword" @blur="handlerPassword($event)">
            </view>
        </view>
        <view class="confirm-btn-group">
            <view class="confirm-btn"  @click="bindTicket">
                确认绑定            
            </view>
            <view class="scan-btn" @click="scanBind">
                扫码绑定
            </view>
            <view class="tip">
                * 联票一经绑定，绑定信息将不能被更改
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex' 
export default {
    data() {
        return {
            ticketCode: '',
            ticketPassword: '',
            imgUploading: false,
            headerImg: '',
            forbidClick: false,
            name: '',
            ticketName: ''
        }
    },
    filters: {
        phoneText(val) {
            let arr = val.split('')
            return `${arr.splice(0,3).join('')}****${arr.splice(4,4).join('')}`
        }
    },
    onLoad(option) {
        console.log(option)
        this.ticketCode = option.code || ''
        this.ticketPassword = option.password || ''
        this.ticketName = option.name || ''
    },
    computed: {        
        ...mapState(['ticketBaseInfo','userInfo']),
    },
    methods: {
        handlerCodeBlur (e) {
            this.ticketCode = e.target.value
        },
        handlerPassword (e) {
            this.ticketPassword = e.target.value
        },
        bindTicket() {
            if (this.forbidClick) return
            if (!this.checkForm()) return
            this.forbidClick = true
            setTimeout(() => {
                this.sendData()
            },200)            
        },
        scanBind () {            
            uni.scanCode({
                onlyFromCamera: true,
                scanType: 'QR_CODE',
                success (res) {
                    that.postScanData(res.result)
                },
                fail () {
                    that.$tip.toast('扫描失败,请重试','none')
                }
            })
        },
        postScanData () {

        },
        async sendData () {
            let params = {
                bindingName: this.name,
                bingingPhoto: this.headerImg,
                childCode : this.ticketCode,
                password : this.ticketPassword,
                username: this.userInfo.username
            }
            const res = await this.$api.bindTicket(params)
            if (res.code === '0') {
                this.$tip.toast('绑定成功','none')
                uni.switchTab({
                    url: '/pages/user/user'
                })
            } else {
                this.forbidClick = false
                this.$tip.toast(res.message,'none')
            }
        },
        checkForm () {
            if (this.name === '') {
                this.$tip.toast('请输入使用者名称','none')
                return false
            }
            if (this.headerImg === '') {
                this.$tip.toast('请上传头像','none')
                return false
            }
            if (this.ticketCode === '') {
                this.$tip.toast('请输入联票编号','none')
                return false
            }
            if (this.ticketPassword === '') {
                this.$tip.toast('请输入联票密码','none')
                return false
            }
            if (this.imgUploading) {
                this.$tip.toast('请等待头像上传完成','none')
                return false
            }
            return true
        },
        showWarning () {
            this.$tip.confirm('上传单人大头照，仅限照片本人使用，合照不可使用')
            .then((res) => {
                this.uploadImg()
            })
            .catch(() => {
                return
            })
        },
        uploadImg () {
            let that = this
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album','camera'],
                success (res) {
                    const tempFilePaths = res.tempFilePaths
                    that.imgUploading = true
                    console.log(res)
                    wx.uploadFile({
                        // url: 'https://www.gzlxtx.cn:8080/common/uploadPhoto', //测试环境上传图片地址
                        url: 'https://www.gzlxtx.cn/api/common/uploadPhoto', //正式环境上传图片地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        success (res1) {
                            let temp = JSON.parse(res1.data)
                            if (temp.code === '0') {  
                                that.headerImg = temp.data
                                that.$tip.toast('头像上传成功','none')
                            } else {
                                that.$tip.toast(temp.message,'none')
                            }
                        },
                        complete () {
                            setTimeout(() => {                                        
                                that.imgUploading = false
                            }, 1000);                    
                        }
                    })
                }
            })
        }
    }
}
</script>

<style>
.bind-ticket {
    width: 100%;
    height: 100vh;
    background: #F3F3F3;
}
.ticket-header {
    text-align: center;
    height: 50upx;
    line-height: 50upx;
    font-size: 13px;
    color: #000000;
}
.ticket-body,.ticket-info {
    font-size: 28upx;
    background: #fff;
    padding-left: 14upx;
    padding-right: 14upx;
    margin-bottom: 20upx;
}
.ticket-body {
    color: #000;
}
.ticket-info {
    color: #9A9A9A;
    margin-bottom: 76upx;
}
.item + .item {
    border-top: 1px solid #eee;
}
.ticket-info .item,
.ticket-body .item {    
    width: 100%;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    align-items: center;
    height: 90upx;
}
.item .lable {
    width: 159upx;
}
.item .value,
.item .icon-arrow {
    margin-left: auto;
}
.confirm-btn-group {
    position: relative;
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 74upx;
}
.confirm-btn,.scan-btn {    
    width: 305upx;
    font-size: 16px;
    line-height: 74upx;
    text-align: center;
    color: #fff;
    border-radius: 6px;
    background: linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));;
}
.icon-arrow {    
    color: #9A9A9A;
}
.icon-arrow::after {
    content: '';    
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-left: 6px;
    border: 1px solid #888;
    transform: rotate(45deg);
    border-left: transparent;
    border-bottom: transparent;
}
.confirm-btn-group .tip {
    position: absolute;
    bottom: -35px;
    font-size: 12px;
    color: #888;
    text-align: center;
}
.header-img {
    width: 60upx;
    height: 60upx;
}
</style>