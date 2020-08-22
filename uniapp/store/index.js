import Vue from 'vue'
import Vuex from 'vuex'
import { home } from '../services/'
Vue.use(Vuex)

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', // 使用严格模式
    state: {
        isIos: false,
        hasLogin: false,
        //管登录的用户数据
        userInfo: {
            token: '',
        },
        openid: null,
    },
    mutations: {
        logout(state) {
            uni.removeStorageSync('identity')
            state.hasLogin = false
            state.userInfo = null
        },
        setOpenid(state, openid) {
            state.openid = openid
        },
        setLogin(state, data) {
            state.userInfo = data
            state.hasLogin = true
        },
		setPlatform(state, isIos) {
			state.isIos = isIos
		}
	},
    actions: {
		checkPlatform: function ({ commit }) {
            var isIos = false;
            if (uni.getSystemInfoSync().platform == "ios") {
                console.log("ios 平台")
                isIos = true
            }
            // #ifdef MP
            console.log("小程序")
            // #endif
            // #ifdef H5
            console.log("H5")
            isIos = false
            // #endif
            console.log("ios", isIos)
            commit("setPlatform", isIos)
        },
        checkLogin: function ({ commit }) {
            try {
                let userInfo = uni.getStorageSync('identity');
                if (userInfo && userInfo.token) {
                    commit('setLogin', userInfo)
                }
            } catch (e) {}
        },
        Login: function ({ commit }, userInfo) {
            uni.setStorageSync('identity', userInfo)
            commit('setLogin', userInfo)
        }
    }
})

export default store