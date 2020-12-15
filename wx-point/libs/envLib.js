
// let currentE = 'lexinP' //乐行正式
let currentE = 'huanyouP' //欢游正式
// let currentE = 'lexinT' //乐行测试
// let currentE = 'huanyouT' //欢游测试
let baseUrl = ''
let upImgUrl = ''
let currentAppid = ''
let _shop_type = ''
let payKey = ''
switch (currentE) {
    case 'lexinP':
        baseUrl = 'https://www.gzlxtx.cn/api'
        upImgUrl = 'https://www.gzlxtx.cn/api/common/uploadPhoto'
        currentAppid = 'wxd56c7ad09b4f58c7'
        _shop_type = 'lx'
        payKey = '2A0D555A40FCF76A664C66CC424E22DC'
        break;
    case 'huanyouP':
        baseUrl = 'https://gzlxtx.cn:7777/api'
        upImgUrl = 'https://www.gzlxtx.cn:7777/common/uploadPhoto'
        currentAppid = 'wx0d1bb307c1a5cbe4'
        _shop_type = 'hy'
        payKey = '1517FF58903502E1471DFD510F06CB52'
        break;
    case 'lexinT':
        baseUrl = 'http://gzlxtx.cn:8887/api'
        upImgUrl = 'https://www.gzlxtx.cn:8080/common/uploadPhoto'
        currentAppid = 'wxd56c7ad09b4f58c7'
        _shop_type = 'lx'
        payKey = '2A0D555A40FCF76A664C66CC424E22DC'
        break;
    case 'huanyouT':
        baseUrl = 'http://gzlxtx.cn:7776/api'
        upImgUrl = 'https://www.gzlxtx.cn:7776/common/uploadPhoto'
        currentAppid = 'wx0d1bb307c1a5cbe4'
        _shop_type = 'hy'
        payKey = '1517FF58903502E1471DFD510F06CB52'
        break;
    default:
        baseUrl = 'https://www.gzlxtx.cn/api'
        upImgUrl = 'https://www.gzlxtx.cn/api/common/uploadPhoto'
        currentAppid = 'wxd56c7ad09b4f58c7'
        _shop_type = 'lx'
        payKey = '2A0D555A40FCF76A664C66CC424E22DC'
        break;
}
export {
    baseUrl, upImgUrl, currentAppid, _shop_type, payKey
}