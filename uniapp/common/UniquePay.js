//use
// UniquePay.pay({
// 				"appId": "",
// 				"timeStamp": "",
// 				"nonceStr": "",
// 				"signType": "",
// 				"paySign": "",
// 				"package": ""
// 			}).then(res => console.log(res));
// ###小程序支付
//[https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html]
// ###微信公众号jssdk
//[https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html]
// ###微信支付文档
//[https://pay.weixin.qq.com/wiki/doc/api/index.html]
class UniquePay {
    constructor(useSdk) {
        this.channel_list = {
            'wx_pub': 'weixinPay',
            'wx_lite': 'weixinLitePay',
			'wx_wap' :'weixinWapPay'
        } //支付的类型
        // #ifdef H5
        if (typeof $globalConfig === 'undefined' || !$globalConfig.navigator) {
            window.$globalConfig = {
                navigator: {
                    isWechat: navigator.userAgent.match(/(MicroMessenger)\/([\d\.]+)/i) !== null,
                    isAlipay: navigator.userAgent.match(/(AlipayClient)\/([\d\.]+)/i) !== null
                }
            };
        }
        this._useSdk =
            useSdk === true ||
            document.currentScript.hasAttribute('usesdk') &&
            document.currentScript.getAttribute('usesdk') !== 'false';
        // #endif
        this.initSdk();
    }
    /**
     * 初始化SDK
     * @param {Object} signatureConfig 仅限使用 微信 jssdk[SDK模式]，签名配置信息，参考微信官方 jssdk 文档
     */
    initSdk(signatureConfig) {
        if (!this._useSdk) return;
        this._wxSignatureConfig = signatureConfig;
        // #ifdef H5
        if ($globalConfig.navigator.isWechat || $globalConfig.navigator.isAlipay) {
            let path = $globalConfig.navigator.isWechat ?
                '//res.wx.qq.com/open/js/jweixin-1.2.0.js' :
                '//a.alipayobjects.com/g/component/antbridge/1.1.4/antbridge.min.js';

            if (!path || path === '') {
                console.error('UniquePay init fail , path : null');
                return;
            }
            if (document.querySelector(`script[src$="${path}"]`) === null) {
                let a = document.createElement('script');
                a.src = location.protocol + path;
                a.onload = () => {
                    console.log('UniquePay init success !!! ');
                };
                a.onerror = () => {
                    console.error('UniquePay init fail , path : ', path);
                };
                let c = document.getElementsByTagName('script')[0];
                c.parentNode.insertBefore(a, c);
            }
        }
        // #endif
    }
    /**
     * 唤起支付
     * @param {Object} options 支付参数，参考各支付平台支付文档
     * @param {Object} signatureConfig 仅限使用 微信 jssdk[SDK模式]，签名配置信息，参考微信官方 jssdk 文档
     *
     * @returns {Promise}
     */
    pay(options, signatureConfig) {
        if (!options || options['channel'] == undefined) {
            console.log('支付渠道错误');
            return false;
        }
        var channel_list = this.channel_list;
        var $payChannel = channel_list[options['channel']]
        return this[$payChannel](options, signatureConfig)
    }

    /**
     * 调起微信支付
     * @param {Object} options 支付参数，微信官方支付文档 https://pay.weixin.qq.com/wiki/doc/api/index.html
     * @example
     * timestamp 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
     * nonceStr 支付签名随机串，不长于 32 位
     * package 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
     * signType 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
     * paySi gn 支付签名
     *
     * @param {Object} signatureConfig 签名配置信息，参微信官方 jssdk 文档
     * [https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html]
     *
     * @returns {Promise}
     */
    weixinPay(options, signatureConfig) {
        return new Promise((resolve, reject) => {
            if (
                !options ||
                Object.prototype.toString.call(options) !== '[object Object]'
            ) {
                reject({
                    message: '唤起微信支付参数错误，参数[options]：' + JSON.stringify(options)
                });
                return;
            }
			options['timestamp'] = options['timeStamp']
			delete options['timeStamp']
			delete options['channel']
			console.log(options,'weixinPay')
            //唤起支付
            let success = res => {
                    resolve({
                        code: (res.err_msg || '').split(':')[1] || 'ok',
                        message: res.errMsg || res.err_desc || '',
                        res: res
                    });
                },
                fail = res => {
                    reject({
                        code: (res.err_msg || '').split(':')[1] || 'fail',
                        message: res.errMsg || res.err_desc || '支付失败',
                        res: res
                    });
                };
            if (this._useSdk) {
                let _wixinPay = () => {
                    options.success = success;
                    options.cancel = res => {
                        reject({
                            code: (res.err_msg || '').split(':')[1] || 'cancel',
                            message: res.errMsg || res.err_desc || '支付取消'
                        });
                    };
                    options.fail = fail;
                    wx.chooseWXPay(options);
                };
                signatureConfig = signatureConfig || this._wxSignatureConfig;
                if (this.signature !== true && signatureConfig) {
                    //未注入签名数据
                    signatureConfig.debug =
                        signatureConfig.debug ||
                        (typeof process !== 'undefined' ?
                            (process.env || {}).NODE_ENV !== 'production' :
                            false);
                    signatureConfig.jsApiList = ['checkJsApi', 'chooseWXPay'];
                    wx.config(signatureConfig);
                    wx.ready(() => {
                        this.signature = true;
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        _wixinPay();
                    });
                    wx.error(res => {
                        this.signature = false;
                        reject({
                            code: 'fail',
                            message: res.errMsg || res.err_desc || 'jsapi配置失败'
                        });
                    });
                } else {
                    _wixinPay();
                }
            } else {
                document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', options, function (res) {
                        if (res.err_msg === 'get_brand_wcpay_request:ok') {
                            //支付成功
                            success(res);
                        } else {
                            fail(res);
                        }
                    });
                }, false);
            }
        });
    }
    /**
     * 调起支付宝支付
     * @param {Object} options 支付参数，微信小程序官方支付文档 https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
     * @example
     * timestamp 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
     * nonceStr 支付签名随机串，不长于 32 位
     * package 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
     * signType 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
     * paySi gn 支付签名
     *
     * @returns {Promise}
     */
    weixinLitePay(options) {
        return new Promise((resolve, reject) => {
            if (!options || Object.prototype.toString.call(options) !== '[object Object]') {
                reject({
                    message: '唤起微信支付参数错误，参数[options]：' + JSON.stringify(options)
                });
                return;
            }
            //唤起支付
            var success = res => {
                resolve({
                    code: 'ok',
                    message: res.errMsg || res.err_desc || '',
                    return_code: 'SUCCESS',
                    res: res
                });
            };
            options.success = success;
            var fail = res => {
                reject({
                    code: 'fail',
                    message: res.errMsg || res.err_desc || '支付失败',
                    res: res
                });
            };
            options.fail = fail;
            uni.requestPayment(options);
        })
    }
	
	weixinWapPay(options){
		window.location.href = options.mweb_url
	}

}

module.exports = new UniquePay()