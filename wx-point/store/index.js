import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: uni.getStorageSync('user_info'),
        roleType: uni.getStorageSync('role_type'),
        systemInfo: {},
        isIphoneX: false,
        locationObj: uni.getStorageSync('locationObj'),
        ticketBaseInfo: uni.getStorageSync('ticketBaseInfo'),
        venueTypeArr: uni.getStorageSync('venueTypeArr'),
    },
    mutations: {
        SET_USER_INFO(state, userInfo){
            state.userInfo = userInfo || null
            if (userInfo) {
                uni.setStorageSync('user_info', userInfo)
            } else {
                uni.removeStorageSync('user_info')
            }
        },
        SET_ROLE_TYPE(state, roleType){
            state.roleType = roleType || ''
            if (roleType) {
                uni.setStorageSync('role_type', roleType)
            } else {
                uni.removeStorageSync('role_type')
            }
        },
        SET_LOCATION_OBJ(state, locationObj){
            state.locationObj = locationObj || ''
            if (locationObj) {
                uni.setStorageSync('locationObj', locationObj)
            } else {
                uni.removeStorageSync('locationObj')
            }
        },
        SET_TICKET_OBJ(state, ticketBaseInfo){
            state.ticketBaseInfo = ticketBaseInfo || ''
            if (ticketBaseInfo) {
                uni.setStorageSync('ticketBaseInfo', ticketBaseInfo)
            } else {
                uni.removeStorageSync('ticketBaseInfo')
            }
        },
        SET_VENUE_TYPE_ARR(state, venueTypeArr){
            state.venueTypeArr = venueTypeArr || ''
            if (venueTypeArr) {
                uni.setStorageSync('venueTypeArr', venueTypeArr)
            } else {
                uni.removeStorageSync('venueTypeArr')
            }
        },
        SET_SYSTEM_INFO(state, systemInfo){
            state.systemInfo = systemInfo || {}
        },
        SET_IPHONEX(state, isIphoneX){
            state.isIphoneX = isIphoneX || false
        },
    }
})

export default store
