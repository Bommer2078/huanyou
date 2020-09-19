const sideClomunDate = {
	data () {
		return {
			clomunArr: [
				{
					label     : '普通用户',
					nodeKey   : 'userManage',
					routerLink: '/userManage/userList'
				},
				{
					label     : '所属地管理',
					nodeKey   : 'locationManage',
					routerLink: '/locationManage'
				},
				{
					label     : '联票管理',
					nodeKey   : 'ticketManage',
					routerLink: '/ticketManage'
				},
				{
					label     : '特惠商品管理',
					nodeKey   : 'goodsManage',
					routerLink: '/goodsManage/goodsList'
				},
				{
					label     : '场馆管理',
					nodeKey   : 'venueManage',
					routerLink: '/venueManage/venueList'
				},
				{
					label     : '订单管理',
					nodeKey   : 'orderManage',
					routerLink: '/orderManage'
				},
				{
					label     : '关于',
					nodeKey   : 'aboutManage',
					routerLink: '/aboutManage'
				},
				// {
				// 	label     : '公告',
				// 	nodeKey   : 'pulicManage',
				// 	routerLink: '/pulicManage'
				// },
				{
					label     : '字典',
					nodeKey   : 'dictionary',
					routerLink: '/dictionary'
				}
			],
			defaultProps: {
				children: 'children',
				label   : 'label'
			}
		}
	}
}

export default sideClomunDate
