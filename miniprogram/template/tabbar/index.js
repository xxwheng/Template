// template/tabbar/index.js
import config from '../../config';
var img_site_host = config.img_site_host;

//初始化数据
function tabbarinit() {
  return [
    {
      current: 0,
      pagePath: '/pages/index/index',
      iconPath: '',
      selectedIconPath: '',
      text: '首页'
    },
    {
      current: 0,
      pagePath: '/pages/logs/logs',
      iconPath: '',
      selectedIconPath: '',
      text: '日志'
    }
  ];
}

//tabbar 主入口
function tabbarmain(bindName = 'tabdata', id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']; //换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar;
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
};
