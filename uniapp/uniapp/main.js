import Vue from 'vue'
import App from './App'
import store from './store'
import config from './config'


import whTabBar from "./components/TabBar/TabBar"
Vue.component('wh-tab-bar', whTabBar)

// #ifdef H5
// import VConsole from './libs/vconsole.min'
// var vConsole = new VConsole();
// #endif
//vue调试模式 //开发模式才开启，发布不开启调试模式
Vue.config.debug = process.env.NODE_ENV === 'development' ? true : false;
Vue.config.devtools = process.env.NODE_ENV === 'development' ? true : false;
Vue.config.productionTip = false

Vue.prototype.config = config
Vue.prototype.$store = store
Vue.prototype.$eventListener = new Vue();

//实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

//处理刷新的时候vuex被清空但是用户已经登录的情况
try {
    store.dispatch("checkPlatform")
    wx.removeStorageSync('wxappreload')
    const identity = uni.getStorageSync('identity')
    if (identity) {
        store.dispatch('Login', identity);
        store.dispatch('getConfigCategoryList')
    }
} catch (e) {
    // error
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
