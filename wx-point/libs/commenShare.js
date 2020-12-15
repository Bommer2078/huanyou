
import { _shop_type } from './envLib.js'
var commenShare = function (params) {
    var shareObj = {
　　　　title: _shop_type === 'lx' ? "乐行天下放肆游" : '欢游票务',        // 默认是小程序的名称(可以写slogan等)
　　　　path: '/pages/main/main',        // 默认是当前页面，必须是以‘/’开头的完整路径
　　　　imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
　　　　success: function(res){
　　　　　　// 转发成功之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:ok'){						
                console.log('转发成功');
　　　　　　}
　　　　},
　　　　fail: function(){
　　　　　　// 转发失败之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
　　　　　　　　// 用户取消转发
                console.log('取消转发');
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
　　　　　　　　// 转发失败，其中 detail message 为详细失败信息		
                console.log('转发失败');
　　　　　　}
　　　　},
　　　　complete: function(){
            console.log('完成');
　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
　　　　}
　　};
    return shareObj;
}


export default commenShare;