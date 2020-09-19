const val = process.env.API_ROOT
const api = {
	uploadImg   : `${val}/common/uploadPhoto`,
	register    : `${val}/user/register`,
	loginTo     : `${val}/user/login`,
	saveBusiness: `${val}/user/addBusiness`, // 创建商家
	editBusiness: `${val}/user/updateBusiness`, // 创建商家

	// 归属地
	saveLocation   : `${val}/place`,
	getLocationList: `${val}/place/list`,

	// 场馆
	getVenueList: `${val}/venue/list`,
	saveVenue   : `${val}/venue`,

	// 商品
	saveGoods   : `${val}/specialItem`,
	getGoodsList: `${val}/specialItem/list`,

	// 普通用户
	getUserList      : `${val}/user/listByParams`,
	getCommenUserList: `${val}/user/listUserAddTicketCount`,
	changeUserState  : `${val}/user/updateStatus`,
	getBusinessList  : `${val}/user/listByVenueId`,
	getwriteOffList  : `${val}/verify/listByVerifyUsername`,

	// 联票
	saveTicket        : `${val}/yearTicket`,
	getTicketList     : `${val}/yearTicket/list`,
	getTicketByUser   : `${val}/ticket/listTicketByUsername`, // 查找用户下的票
	getYearTickeList  : `${val}/ticket/listByYearTicketId`, // 分页下联票下票列表
	batchProductTicket: `${val}/ticket/batchProductTicket`, // 批量生产票
	excelExport       : `${val}/ticket/excelExport`, // 导出excel
	batchUpdateStatus : `${val}/ticket/batchUpdateStatus`, // 批量改状态
	writeOff          : `${val}/ticket/writeOffYearTicketForAdmin`, // 批量改状态

	// 字典
	saveDictionary    : `${val}/dictionary`,
	getDictionary     : `${val}/dictionary/list`,
	saveDictionaryItem: `${val}/dictionaryItem`,
	getDictionaryItem : `${val}/dictionaryItem/listByDictionaryId`,

	// 订单
	getOrderList   : `${val}/order/listForAdmin`,	// 根据条件分页查找订单
	deleRecode     : `${val}/verify`,	// 根据条件分页查找订单
	ship           : `${val}/order/ship`,
	notice         : `${val}/notice/list`,
	noticeDetail   : `${val}/notice`,
	bindTicket     : `${val}/ticket/bandingNameAndPhoto`,
	getBookList    : `${val}/booking/listByVenueId`,
	excelBookExport: `${val}/booking/excelExport`,
	cancelBooking  : `${val}/booking/cancelBooking`
}

export default api
