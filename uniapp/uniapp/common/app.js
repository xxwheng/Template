import store from '../store'

let app = {
    go: function (url, auth = false, type = 1, cb) {
        if (auth != store.state.hasLogin && auth == true) {
            app.showModal({
                content: '请先登录',
                confirm: function () {
                    app.navigateTo('/pages/login/index')
                }
            })
            return false;
        } else {
            app.navigateTo(url)
        }
    },

    hasLogin: function (auth) {
        if (auth != store.state.hasLogin && auth == true) {
            app.showModal({
                content: '请先登录',
                confirm: function () {
                    app.navigateTo('/pages/login/index')
                }
            })
            return false;
        }
        return true
    },

    // 有回调的
    showToastHandle: function (title, handle, duration = 1000) {
        app.showToast({
            title: title
        })
        setTimeout(handle, duration)
    },

    //微信提示 函数
    showToast: function (param) {
        uni.showToast({
            title: param.title,
            icon: param.icon ? param.icon : 'none',
            duration: param.duration || 1500,
            mask: true,
            success: function (res) {
                typeof param.success == 'function' && param.success(res);
            },
            fail: function (res) {
                typeof param.fail == 'function' && param.fail(res);
            },
            complete: function (res) {
                typeof param.complete == 'function' && param.complete(res);
            }
        });
    },
    showModal: function (param) {
        let that = this;
        uni.showModal({
            title: param.title || '提示',
            content: param.content,
            showCancel: param.showCancel || false,
            cancelText: param.cancelText || '取消',
            cancelColor: param.cancelColor || '#000000',
            confirmText: param.confirmText || '确定',
            confirmColor: param.confirmColor || '#FF8448',
            success: function (res) {
                if (res.confirm) {
                    typeof param.confirm == 'function' && param.confirm(res);
                    let pages = getCurrentPages();
                    if (param.url != '' && param.url != undefined) {
                        wx.switchTab({
                            url: param.url
                        });
                    } else if (param.code == -10) {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                } else {
                    typeof param.cancel == 'function' && param.cancel(res);
                }
            },
            fail: function (res) {
                typeof param.fail == 'function' && param.fail(res);
            },
            complete: function (res) {
                typeof param.complete == 'function' && param.complete(res);
            }
        });
    },
    lodingHandle: function (title, handler, duration = 1000) {
        uni.showLoading({
            title: title,
            mask: true
        })
        var time = setTimeout(function () {
            clearTimeout(time);
            uni.hideLoading()
            handler()
        }, duration)
    },
    /* 超时自动取消 */
    timeoutLoading: function (title) {
        if (title) {
            uni.showLoading({
                title: title,
                mask: true
            })
            setTimeout(function () {
                uni.hideLoading()
            }, 15000)
        } else {
            uni.hideLoading()
        }
    },
    showLoading: function (title, isLoading = true) {
        if (isLoading && title) {
            uni.showLoading({
                title: title,
                mask: true,
            })
        } else {
            uni.hideLoading()
        }
    },
    navigateTo: function (url, state) {
        if (!app.hasLogin(state)) { return; }
        uni.navigateTo({
            url: url
        });
    },
    redirectTo: function () {
        uni.redirectTo({
            url: url
        });
    },
    switchTab: function (url) {
        uni.switchTab({
            url: url
        })
    },
    // 拨打电话
    makePhoneCall: function (mobile) {
        if (mobile != "") {
            uni.makePhoneCall({
                phoneNumber: mobile,
            });
        } else {
            app.showToast({
                title: '暂无电话信息'
            });
        }
    }
}
module.exports = app