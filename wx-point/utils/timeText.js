
const timeText = function (val) {    
    let platform  = ''
    uni.getSystemInfo({
        success:function(res){
            platform = res.platform 
        }
    })
    let temp = val.replace(/-/g, '/').replace('T', ' ').replace('.000+0000', '')
    let time = platform == 'ios' ? temp : val
    let date = new Date(time).getTime()
    date = platform == 'ios' ? date + 8*60*60*1000 : date
    let date2 = new Date(date)
    let year = date2.getFullYear()
    let month = date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1
    let day = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
    let hour = date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()
    let minute = date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes()
    let second = date2.getSeconds() < 10 ? '0' + date2.getSeconds() : date2.getSeconds()

    return  `${year}/${month}/${day}  ${hour}:${minute}:${second}`
}
export default timeText
