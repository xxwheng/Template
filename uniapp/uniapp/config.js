var protocol, host;
const version = '1.0.0';
const hostdir = ''
if (process.env.NODE_ENV === 'development') {
    // console.log('开发环境')
    protocol = "http://"
    host = '.t'
} else {
    // console.log('生产环境')
    protocol = 'https://';
    host = '.online'
    // #ifdef H5
    host = window.location.host;
    protocol = window.location.protocol + "//";
    // #endif
    // #ifdef MP-WEIXIN
    protocol = 'https://';
    host = 'online' //小程序接口地址
    // #endif
}

// 平台类型
var platform = "normal"
// #ifdef APP-PLUS
if (uni.getSystemInfoSync().platform == "ios") {
    platform = "ios"
} else if (uni.getSystemInfoSync().platform == "android") {
    platform = "android"
}
// #endif
// #ifdef H5
platform = "h5"
// #endif
// #ifdef MP
platform = "mp"
// #endif

module.exports = {
    version: version,
    platform: platform,
    host: host,
    hostdir: hostdir,
    protocol: protocol
}