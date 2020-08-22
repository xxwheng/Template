import wx from './jweixin.js'
import { home } from '../services/index.js'

const wxApi = {
    /**
     * [wxRegister 微信Api初始化]
     * @param  {Function} callback [ready回调函数]
     */
    wxRegister(option) {
        // 这边的接口请换成你们自己的
        home.WeixinShare({ 'refer_url': encodeURIComponent(location.href.split('#')[0] + '#' + location.href.split('#')[1]) }).then(function (res) {
            var data = res.data
            wx.config({
                debug: false, // 开启调试模式
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'checkJsApi', 'startRecord', 'stopRecord'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        })
        if (!option) {
            option = {
                title: '家家母婴欢迎你', // 分享标题, 请自行替换
                desc: "家家母婴欢迎你",
                link: window.location.href.split('#')[0], // 分享链接，根据自身项目决定是否需要split
                imgUrl: '~@/static/logo.png', // 分享图标, 请自行替换，需要绝对路径
                success: () => {},
                error: () => {}
            }
        }
        wx.ready(function () {
            // 如果需要定制ready回调方法
            wxApi.ShareTimeline(option)
            wxApi.ShareAppMessage(option)
        })
    },

    /**
     * [ShareTimeline 微信分享到朋友圈]
     * @param {[type]} option [分享信息]
     * @param {[type]} success [成功回调]
     * @param {[type]} error   [失败回调]
     */




    /**
     * [ShareTimeline 微信分享到朋友圈]
     * @param {[type]} option [分享信息]
     * @param {[type]} success [成功回调]
     * @param {[type]} error   [失败回调]
     */
    ShareTimeline(option) {
        wx.onMenuShareTimeline({
            title: option.title, // 分享标题
            link: option.link, // 分享链接
            imgUrl: option.imgUrl, // 分享图标
            success() {
                // 用户成功分享后执行的回调函数
                option.success()
            },
            cancel() {
                // 用户取消分享后执行的回调函数
                option.error()
            }
        })
    },
    /**
     * [ShareAppMessage 微信分享给朋友]
     * @param {[type]} option [分享信息]
     * @param {[type]} success [成功回调]
     * @param {[type]} error   [失败回调]
     */
    ShareAppMessage(option) {
        wx.onMenuShareAppMessage({
            title: option.title, // 分享标题
            desc: option.desc, // 分享描述
            link: option.link, // 分享链接
            imgUrl: option.imgUrl, // 分享图标
            success() {
                // 用户成功分享后执行的回调函数
                option.success()
            },
            cancel() {
                // 用户取消分享后执行的回调函数
                option.error()
            }
        })
    }
}
export default wxApi