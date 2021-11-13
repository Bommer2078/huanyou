<template>
    <view class="sign-up">
        <view class="form-container">
            <template v-if="pageType === 'signUp' || pageType === 'forgetPassword'">
                 <view :class="{'input-item':true,'error-style': phoneErr}" >
                    <view class="lable" >
                        手机号码
                    </view>
                    <input type="text" placeholder="请输入手机号码" v-model.trim="phone" maxlength="11" @blur="checkPhone">
                </view>
                <view :class="{'input-item':true,'mg-20':true, 'error-style': codeErr}" @click="sendSms">
                    <view class="lable">
                        验证码
                    </view>
                    <input type="text" placeholder="请输入验证码" v-model.trim="smsCode" @blur="checkCode">
                    <view class="get-code" >{{ startCount ? countNum : '发送验证码'}}</view>
                </view>
            </template>
            <template v-else>
                <view :class="{'input-item':true,'error-style': oldPasswordErr}" >
                    <view class="lable" >
                        旧密码
                    </view>
                    <input type="text" placeholder="请输入原始密码" v-model.trim="oldPassword" maxlength="24">
                </view>
            </template>           
            <view :class="{'input-item':true,'error-style': passwordErr}" >
                <view class="lable">
                    输入密码
                </view>
                <input v-if="inputType === 'password'" type="password" placeholder="请输入密码" v-model.trim="password" @blur="checkPassword" >
                <input v-else type="text" placeholder="请输入密码" v-model.trim="password" @blur="checkPassword" >
                <view class="eye" @click="changeEye">                    
                    <img src="/static/img/close-eye.svg" v-if="inputType === 'password'">
                    <img src="/static/img/eye.svg" v-else>
                </view>
            </view>
            <view :class="{'input-item':true,'error-style': passwordErr}" >
                <view class="lable">
                    确认密码
                </view>
                <input v-if="inputType === 'password'" type="password" placeholder="再次输入密码" v-model.trim="confirmPassword"  @blur="checkPassword('confirm')">
                <input v-else type="text" placeholder="再次输入密码" v-model.trim="confirmPassword"  @blur="checkPassword('confirm')">
            </view>       
            <view class="password-tip">* 密码至少8个字符以上</view>     
        </view>
        <view class="sign-up-btn" @click="registerUser" v-if="pageType === 'signUp'">
            确定注册
        </view>
        <view class="sign-up-btn" @click="registerUser" v-else-if="pageType === 'forgetPassword'">
            确定修改
        </view>
        <view class="sign-up-btn" @click="confirmChange" v-else>
            确定修改
        </view>
        <view class="sign-up-btn" @click="gobackLogin">
            已有账号，请登录
        </view>
    </view>
</template>

<script>
import md5 from '../../libs/md5.min.js'
export default {
    data () {
        return {
            phone: '',
            smsCode: '',
            password: '',
            confirmPassword: '',
            phoneErr: '',
            codeErr: '',
            oldPasswordErr: '',
            passwordErr: '',
            countNum: 60,
            startCount: false,
            timeObj: null,
            pageType: 'signUp',
            pageFrom: '',
            oldPassword: '',
            inputType: 'password',
            debonce: false
        }
    },
    watch: {
        countNum(newVal) {
            if (newVal <= 0) {
                this.startCount = false
                this.debonce = false  
                clearTimeout(this.timeObj)
                setTimeout(() => {
                    this.countNum = 60
                }, 1000);
            }
        }
    },
    onLoad (option) {
        this.pageType = option.page         
        this.pageFrom = option.from         
        if (this.pageType === 'signUp') {
            uni.setNavigationBarTitle({
                title: '注册'
            })
        } else if (this.pageType === 'forgetPassword') {
            uni.setNavigationBarTitle({
                title: '忘记密码'
            })
        } else {
            uni.setNavigationBarTitle({
                title: '修改密码'
            })
        }
        
    },
    created() {
        this.initCountNum()
    },
    methods: {        
        async sendSms() {
            if (this.debonce) return
            if (this.startCount) {
                return
            }
            if (!this.phone) {                
                this.phoneErr = '手机号为空'
                return
            }
            if (this.phoneErr) {
                return
            }
            
            this.debonce = true
            this.$tip.toast('请稍后', 'none')
            let countTime = new Date().getTime()
            uni.setStorageSync('countTime',countTime)
            let params = {
                phone: this.phone,
                type : this.pageType === 'signUp' ? 'register' : 'resetPassword'
            }
            let res = await this.$api.getSms(params)
            
            if (res.code === '0') {
                this.countStart()
                this.$tip.toast('短信发送成功', 'none')
            } else {            
                setTimeout(() => {                    
                    this.debonce = false    
                }, 3000)
                this.$tip.toast(`${res.message}`, 'none')
            }
        },
        async registerUser () {
            if (!this.checkPostData()) {
                return
            }
            let apiUrl = this.pageType === 'signUp' ? 'registerUser' : 'resetPassword'
            let params = {
                babyBirthday: '123456',
                phone : String(this.phone),
                password : md5(this.password),
                verifyCode  : this.smsCode
            }
            const cPhone = String(this.phone)
            const cPassword = md5(this.password)
            const res = await this.$api[apiUrl](params)
            if (res.code === '0') {
                this.$tip.toast(`${this.pageType === 'signUp' ? '注册成功，请稍侯': '密码修改成功'}`,'none')
                setTimeout(() => {
                    this.autoLogin(cPhone, cPassword)
                }, 500);
            } else if (res.code === '4') {    
                this.codeErr = '验证码错误'
                this.$tip.toast(this.codeErr,'none')
            } else {
                this.$tip.toast(res.message,'none')
            }
        },
        gobackLogin () {
            let url = this.pageFrom === 'bindPage' ? '../login/login?from=bindPage' : '../login/login'
            uni.reLaunch({
                url: url,
            });
        },
        async confirmChange () {
            if (!this.checkChangeData()) {
                return
            }
            let apiUrl = 'updatePassword'
            let params = {
                oldPassword  : md5(this.oldPassword),
                password : md5(this.password)
            }
            const res = await this.$api[apiUrl](params)
            if (res.code === '0') {
                this.$tip.toast('修改成功','none')
                uni.navigateBack()
            } else if (res.code === '10004') {    
                this.oldPasswordErr = '旧密码错误'
                this.$tip.toast(this.oldPasswordErr,'none')
            } else {
                this.oldPasswordErr = res.message
                this.$tip.toast(res.message,'none')
            }
        },
        // 注册成功之后自动登录
        async autoLogin (username,password) {   
            let params = {
                username : username,
                password : password
            }     
            const res = await this.$api.login(params)
            if (res.code === '0') {   
                this.$store.commit('SET_USER_INFO',res.data.user)             
                this.$store.commit('SET_ROLE_TYPE','user')             
                uni.setStorageSync('token',res.data.token)
                
                if (this.pageFrom === 'bindpage') {                                 
                    uni.reLaunch({
                        url: '/pages/bindTicket/bindTicket?from=in'
                    });
                } else {                    
                    uni.switchTab({
                        url: '/pages/user/user'
                    });
                }
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
        countStart () {
            if (this.startCount) return
            this.timeObj = setInterval(() => {
                this.startCount = true
                this.countNum--
            }, 1000);
        },
        initCountNum () {            
            let temp = uni.getStorageSync('countTime')/1000
            let now = new Date().getTime()/1000
            if (now - temp < 60) {
                this.countNum = parseInt(60 - now + temp)
                this.countStart()
            }
        },
        checkPhone () {            
            if(!(/^1[123456789]\d{9}$/.test(this.phone))){ 
                this.phoneErr = '手机号格式错误'    
            }else{
                this.phoneErr = ''
            }
        },
        checkCode () {
            if (!this.smsCode) {                
                this.codeErr = '验证码不能为空'
            } else {
                this.codeErr = ''
            }
        },
        checkPassword (type) {
            let check = () => {                
                if (this.password !== this.confirmPassword) {
                    this.passwordErr = '两次输入得密码不一致'
                } else if (this.password.length < 8) {              
                    this.passwordErr = '密码字符至少为8位'
                } else {
                    this.passwordErr = ''
                }
            }
            if (type === 'confirm') {
                check()
            } else {
                if (!this.password) {
                    this.passwordErr = '密码不能为空'
                } else if (this.password.length < 8) {               
                    this.passwordErr = '密码字符至少为8位'
                } else if (this.confirmPassword) {
                    check()
                } else {
                    this.passwordErr = ''
                }
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
            if (!this.smsCode) {
                this.codeErr = '验证码不能为空'
                this.$tip.toast(this.codeErr,'none')
                return false
            }
            if (!this.password) {
                this.passwordErr = '密码不能为空'
                this.$tip.toast(this.passwordErr,'none')
                return false
            } else if (this.passwordErr) {
                this.$tip.toast(this.passwordErr,'none')
                return false
            }
            return true
        },
        checkChangeData () {
            if (!this.oldPassword) {
                this.oldPasswordErr = '旧密码不能为空'
                this.$tip.toast(this.oldPasswordErr,'none')
                return false
            }
            if (!this.password) {
                this.passwordErr = '密码不能为空'
                this.$tip.toast(this.passwordErr,'none')
                return false
            } else if (this.passwordErr) {
                this.$tip.toast(this.passwordErr,'none')
                return false
            }
            return true
        }
    },
}
</script>

<style>
.sign-up {
    width: 100%;
    height: 100vh;
    padding-top: 20upx;
    background: #F3F3F3;
}
.form-container {
    margin-bottom: 108upx;
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
.sign-up-btn + .sign-up-btn {
    margin-top: 80upx;
}
.sign-up-btn {
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
.get-code {
    position: absolute;
    right: 14upx;
    display: inline;
    color: #FFE117;
    line-height: 16px;
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid #FFE117;
    border-radius: 4px;
}
.password-tip {
    font-size: 14px;
    color: #888;
    margin-top: 10px;
    margin-left: 10px;
}
.error-style {
    border: 1px solid red;
}
</style>