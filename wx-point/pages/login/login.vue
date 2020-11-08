<template>
    <view class="login-page">
        <template  v-if="pageType === 'loginPage'">
            <view class="form-container">
                <view :class="{'input-item':true,'error-style': phoneErr}">
                    <view class="lable">
                        手机号码
                    </view>
                    <input type="text" placeholder="请输入手机号码" v-model.trim="phone" maxlength="11" @blur="checkPhone">
                </view>
                <view :class="{'input-item':true,'error-style': passwordErr}">
                    <view class="lable">
                        密码
                    </view>
                    <input type="password" placeholder="请输入密码" v-model.trim="password" maxlength="24" @blur="checkPassword"  v-if="inputType === 'password'">
                    <input type="text" placeholder="请输入密码" v-model.trim="password" maxlength="24" @blur="checkPassword" v-else>
                    <view class="eye" @click="changeEye">                    
                        <img src="/static/img/close-eye.svg" v-if="inputType === 'password'">
                        <img src="/static/img/eye.svg" v-else>
                    </view>
                </view>            
            </view>
            <view class="setting-row">
                <text @tap="gotoSignUp">我要注册</text>
                <text @tap="gotoForget">忘记密码</text>
            </view>
            <view class="sign-up-btn" @tap="login">
                登录
            </view>
            <view class="go-back-btn" @tap="gotoMain">
                返回主页
            </view>
        </template>
        <template v-else>            
            <view class="sign-up-btn login-out" @tap="loginOut">
                退出登录
            </view>
        </template>
    </view>
</template>

<script>
import md5 from '../../libs/md5.min.js'
export default {
    data() {
        return {            
            phone: '',
            password: '',
            phoneErr: '',
            passwordErr: '',
            pageType: 'loginPage',
            inputType: 'password'
        }
    },
    onLoad(option) {
        this.pageType = option.pageType === 'loginOut' ? 'loginOut':'loginPage'
    },
    methods: {  
        async login () {    
            if (!this.checkPostData()) {
                return
            }           
            let params = {
                username : String(this.phone),
                password : md5(this.password)
            }     
            const res = await this.$api.login(params)
            if (res.code === '0') {   
                this.$store.commit('SET_USER_INFO',res.data.user)             
                this.$store.commit('SET_ROLE_TYPE','user')             
                uni.setStorageSync('token',res.data.token)
                this.$tip.toast('登录成功','none')
                
                if (res.data.user.business) {
                    this.$store.commit('SET_ROLE_TYPE','business')                                   
                    uni.reLaunch({
                        url: '/pages/business/business'
                    });
                } else {                    
                    uni.switchTab({
                        url: '/pages/user/user'
                    });
                }
            } else if (res.code === '10003'){
                this.phoneErr = '用户不存在'
                this.$tip.toast(this.phoneErr,'none')
            } else if (res.code === '10001') {
                this.passwordErr = '密码错误'                  
                this.$tip.toast('密码错误','none')
            } else {                             
                this.$tip.toast(res.message,'none')
            }
        },  
        changeEye () {
            if (this.inputType === 'password') {
                this.inputType = 'text'
            } else {
                this.inputType = 'password'
            }
        },
        loginOut () {            
            this.$store.commit('SET_USER_INFO')             
            this.$store.commit('SET_ROLE_TYPE')
            uni.removeStorageSync('token')
            uni.reLaunch({
                url: '../login/login',
            });
        }, 
        checkPhone () {
            if(!(/^[123456789][123456789]\d{9}$/.test(this.phone))){ 
                this.phoneErr = '手机号格式错误'    
            }else{
                this.phoneErr = ''
            }
        },
        checkPassword () {            
            if(!this.password){ 
                this.passwordErr = '密码不能为空'   
            }else{
                this.passwordErr = ''
            }
        },
        checkPostData () {
            if (!this.phone) {
                this.phoneErr = '手机号不能为空'
                this.$tip.toast(this.phoneErr,'none')
                return false
            }
            if (this.phoneErr) {
                this.$tip.toast(this.phoneErr,'none')
                return false
            }
            if (!this.password) {
                this.passwordErr = '密码不能为空'
                this.$tip.toast(this.passwordErr,'none')
                return false
            }
            return true
        },
        gotoSignUp () {
            uni.navigateTo({                
                url: '../signUp/signUp?page=signUp'
            })
        },
        gotoForget () {
            uni.navigateTo({                
                url: '../signUp/signUp?page=forgetPassword'
            })
        },
        gotoMain () {
            uni.switchTab({
                url: '/pages/main/main'
            });
        }
    },
}
</script>

<style>
.login-page {
    width: 100%;
    height: 100vh;
    padding-top: 20upx;
    background: #F3F3F3;
}
.form-container {
    margin-bottom: 10px;
}
.input-item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 80upx;
    line-height: 80upx;
    font-size: 12px;
    padding-left: 13upx;
    padding-right: 13upx;
    background: #fff;
    border-bottom: 1px solid #eee;
}
.input-item .lable {
    width: 160upx;
    padding-left: 23upx;
    color: #000;
}
.sign-up-btn, .go-back-btn {
    width: 78.4%;
    height: 74upx;
    margin: 0 auto;
    font-size: 16px;
    line-height: 74upx;
    text-align: center;
    color: #fff;
    border-radius: 6px;
    background: linear-gradient(-53deg,rgba(255,144,14,1),rgba(255,204,0,1));;
}
.sign-up-btn {
    margin-bottom: 30upx;
}
.login-out {
    margin-top: 130upx;
}
.setting-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-left: 36upx;
    padding-right: 36upx;
    color: #FFCC00;
    margin-bottom: 108upx;
}
.error-style {
    border: 1px solid red;
}
.eye {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
}
.eye img{
    width: 70upx;
    height: 35upx;
}
</style>
