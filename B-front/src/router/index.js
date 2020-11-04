import Vue from 'vue'
import Router from 'vue-router'
import loginPage from '@/pages/login_page.vue'
import mainPage from '@/pages/main_page.vue'
import ticketManage from '@/pages/ticket_manage/ticket_manage.vue'
import editTicket from '@/pages/ticket_manage/edit_ticket.vue'
import productTicket from '@/pages/ticket_manage/product_ticket/product_ticket.vue'
import userList from '@/pages/user_manage/user_list/user_list.vue'
import ticketList from '@/pages/user_manage/ticket_list/ticket_list.vue'
import locationManage from '@/pages/location_manage/location_manage.vue'
import goodsManage from '@/pages/goods_manage/goods_manage.vue'
import editGoods from '@/pages/goods_manage/edit_goods.vue'
import orderManage from '@/pages/order_manage/order_manage.vue'
import venueList from '@/pages/venue_manage/venue_manage.vue'
import editVenue from '@/pages/venue_manage/edit_venue.vue'
import dictionary from '@/pages/dictionary/dictionary.vue'
import aboutManage from '@/pages/aboutManage/aboutManage.vue'
import businessManage from '@/pages/venue_manage/business_manage/business_manage.vue'
import appointmentManage from '@/pages/venue_manage/appointment_manage/appointment_manage.vue'
import commentList from '@/pages/venue_manage/comment_list/comment_list.vue'
Vue.use(Router)
export default new Router({
	routes: [
		{
			path     : '/',
			name     : 'mainPage',
			component: mainPage,
			children : [ {
				path     : '/ticketManage',
				name     : 'ticketManage',
				component: ticketManage
			}, {
				path     : '/ticketManage/editTicket',
				name     : 'editTicket',
				component: editTicket
			}, {
				path     : '/ticketManage/productTicket',
				name     : 'productTicket',
				component: productTicket
			}, {
				path     : '/userManage/ticketList',
				name     : 'ticketList',
				component: ticketList
			}, {
				path     : '/userManage/userList',
				name     : 'userList',
				component: userList
			}, {
				path     : '/goodsManage/goodsList',
				name     : 'goodsManage',
				component: goodsManage
			}, {
				path     : '/goodsManage/editGoods',
				name     : 'editGoods',
				component: editGoods
			}, {
				path     : '/orderManage',
				name     : 'orderManage',
				component: orderManage
			}, {
				path     : '/venueManage/venueList',
				name     : 'venueList',
				component: venueList
			}, {
				path     : '/venueManage/editVenue',
				name     : 'editVenue',
				component: editVenue
			}, {
				path     : '/venueManage/businessManage',
				name     : 'businessManage',
				component: businessManage
			}, {
				path     : '/venueManage/appointmentManage',
				name     : 'appointmentManage',
				component: appointmentManage
			}, {
				path     : '/venueManage/commentList',
				name     : 'commentList',
				component: commentList
			}, {
				path     : '/dictionary',
				name     : 'dictionary',
				component: dictionary
			}, {
				path     : '/aboutManage',
				name     : 'aboutManage',
				component: aboutManage
			}, {
				path     : '/locationManage',
				name     : 'locationManage',
				component: locationManage
			} ]
		},
		{
			path     : '/login',
			name     : 'loginPage',
			component: loginPage
		}
	]
})
