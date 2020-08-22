var Promise = require('../lib/promise-7.0.4.min.js');
var Excp = require('./excp.js');
var Session = require('./session.js');
import store from '../../../store'

function User(option) {
  option = option || {};

  this.ss = new Session(option);
  this.host = option['https'] || option['host'];
  this.prefix = option['table.prefix'] || '';
  this.table_name = option['user.table'] || 'user';
  this.hostdir = option['hostdir'];
  this.api = 'https://' + this.host + this.hostdir;

  // 用户退出
  this.logout = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      var reqData = {
        _sid: that.ss.id(),
        _table: that.table_name,
        _prefix: that.prefix
      };

      wx.request({
        url: that.api + '/logout',
        data: reqData, // 使用 Code 换取 Session ID
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success: function(res) {
          if (res.statusCode != 200) {
            reject(
              new Excp('用户退出失败 API错误', 500, {
                res: res
              })
            );
            return;
          }

          if (typeof res['data'] != 'object') {
            reject(
              new Excp('用户退出失败 API错误', 500, {
                res: res
              })
            );
            return;
          }

          if (res['data']['code'] != 0) {
            reject(
              new Excp('用户退出失败, Session 校验失败', 500, {
                res: res
              })
            );
            return;
          }
          that.ss.destory(); // 清空会话数据
          resolve(res['data']);
        },

        fail: function(res) {
          reject(
            new Excp('用户退出失败', 500, {
              res: res
            })
          );
        }
      });
    });
  };

  // 用户登录
  this.login = function() {
    // detail = detail || {};
    // var rawData = detail.rawData || null;
    // var signature = detail.signature || null;
    var that = this;
	
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(coderes) {
          var userinfo = store.state.userInfo;
          // if (that.ss.isVerified() && rawData == null) {
          //   userinfo = that.ss.get('_login_user') || {};  	// 向前兼容
          //   userinfo['_id'] = that.ss.get('_login_id') || null;
          //   userinfo['_user'] = that.ss.get('_login_user') || null;
          //   if (userinfo['_id'] != null || userinfo['_user'] != null) {
          //     resolve(userinfo);
          //     return;
          //   }
          // }
          var reqData = {
            _sid: that.ss.id(),
            js_code: coderes.code,
			token: userinfo['token'],
			user_id: userinfo.user_info['user_id'],
			// member_id: userinfo['member_id'],
            //rawData: res.rawData,
            //signature: res.signature,
            methodName: 'WxappGetOpenid',
            version: 1.0
          };

          wx.request({
            url: that.api,
            data: reqData, // 使用 Code 换取 Session ID
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function(res) {
              if (res.statusCode != 200) {
                reject(
                  new Excp('用户登录失败 API错误', 500, {
                    res: res
                  })
                );
                return;
              }

              if (typeof res['data'] != 'object') {
                reject(
                  new Excp('用户登录失败 API错误', 500, {
                    res: res
                  })
                );
                return;
              }
              userinfo = res.data;
              resolve(userinfo);
            },

            fail: function(res) {
              reject(
                new Excp('用户登录失败', 500, {
                  res: res
                })
              );
            }
          });
        },
        fail: function(res) {
          reject(
            new Excp('用户登录失败', 500, {
              res: res
            })
          );
        }
      });
    });
  };

  this.get = function() {
    //廢棄
  };
}

module.exports = User;
