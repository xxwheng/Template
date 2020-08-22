//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    app.globalData.tabbarTpl.tabbar('tabBar', 1, this); //0表示第一个tabbar
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
