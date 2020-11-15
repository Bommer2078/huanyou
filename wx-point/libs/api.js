import http from './serve'
const getSms = (params) => http.get('/common/sendSms', params);//获取短信验证码
const registerUser = (params) => http.post('/user/register', params);//用户注册
const updatePassword = (params) => http.put(`/user/updatePassword`,params); //用户修改密码
const resetPassword = (params) => http.put(`/user/resetPassword`,params); //用户修改密码
const login = (params) => http.get('/user/login', params);//用户登录
const getPlaceList = () => http.get('/place/list');//归属地列表
const getTickeList = (params) => http.get('/yearTicket/list',params);//联票列表
const getVenueList = (params) => http.get('/venue/listByYearTicketId',params);//场馆列表
const getGoodsList = (params) => http.get('/specialItem/list',params);//商品列表
const getGoodsDetail = (params) => http.get(`/specialItem/${params}`);//商品列表
const getTicketDetail = (id) => http.get(`/yearTicket/${id}`,);//联票详情
const getVenueTypeList = () => http.get(`/dictionaryItem/listByDictionaryId?dictionaryId=10`);//取场馆分类列表
const creatOrder = (params) => http.post(`/order`,params);//新增订单
const bindTicket = (params) => http.put(`/ticket/bandingNameAndPhoto`,params);//票绑定
const getOrderList = (params) => http.get(`/order/listByUsername`,params); 
const payConfirm = (id) => http.put(`/order/paymentOrder/${id}`);
const bindTicketList = (params) => http.get(`/ticket/listTicketByUsername`,params); //用戶已綁定的联票
const getOrderDetail = (params) => http.get(`/order/orderDetail`,params); 
const writeOffYearTicket = (params) => http.post(`/ticket/writeOffYearTicket`,params); 
const writeOffSpecialTicket = (params) => http.post(`/ticket/writeOffSpecialTicket`,params); 
const getAllCount = (params) => http.get(`/verify/listCountByVerifyUsername`,params); 
const getStatisList = (params) => http.get(`/verify/listByVerifyUsername`,params); 
const getVenueDetail = (params) => http.get(`/venue/${params}`); 
const wxPay = (params) => http.get(`/wx/appletPay`,params); 
const getAboutList = (params) => http.get(`/notice/list`,params); 
const getAbout = (id) => http.get(`/notice/${id}`); 
const appointmentVenue = (params) => http.post(`/booking/bookingVenue`,params); 
const getBookingList = (params) => http.get(`/booking/listBookingByUsername`,params); 
const getFootprint = (params) => http.get(`/verify/listMyFootprint`,params); 
const cancelBind = (params) => http.put(`/ticket/cancelBanding`,params); 
const updateBindingPhoto = (params) => http.put(`/ticket/updateBindingPhoto`,params); 
const shareClicked = (params) => http.put(`/ticket/forwarded`,params); 
const submitComment = (params) => http.post(`/comment/insert`,params); 
const getCommentList = (params) => http.get(`/comment/listByVenueIdAndStatus`,params); 
const deletComment = (params) => http.delete(`/comment/delete`,params); 
const getNearbyVenue = (params) => http.get(`/venue/listNearbyVenue`,params); 
let api = {
    getSms: getSms,
    registerUser: registerUser,
    resetPassword: resetPassword,
    updatePassword: updatePassword,
    login: login,
    getPlaceList: getPlaceList,
    getTickeList: getTickeList,
    getVenueList: getVenueList,
    getGoodsList: getGoodsList,
    getTicketDetail: getTicketDetail,
    getVenueTypeList: getVenueTypeList,
    creatOrder: creatOrder,
    bindTicket: bindTicket,
    getOrderList: getOrderList,
    payConfirm: payConfirm,
    bindTicketList: bindTicketList,
    getOrderDetail: getOrderDetail,
    writeOffYearTicket: writeOffYearTicket,
    writeOffSpecialTicket: writeOffSpecialTicket,
    getAllCount: getAllCount,
    getStatisList: getStatisList,
    getVenueDetail: getVenueDetail,
    getGoodsDetail: getGoodsDetail,
    wxPay: wxPay,
    resetPassword: resetPassword,
    getAboutList: getAboutList,
    getAbout: getAbout,
    appointmentVenue: appointmentVenue,
    getBookingList: getBookingList,
    getFootprint: getFootprint,
    cancelBind: cancelBind,
    updateBindingPhoto: updateBindingPhoto,
    shareClicked: shareClicked,
    submitComment: submitComment,
    getCommentList: getCommentList,
    deletComment: deletComment,
    getNearbyVenue: getNearbyVenue
};
export default api;
