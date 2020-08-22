const stor = app.xpm.require('stor');
const { errorHandler } = require('errorHandler');

const Excp = require('../../libs/xpmjs/service/excp');

import xpm from '../../libs/xpmjs/xpm'
import config from '../../config';
const http = xpm.require('utils')

const xhr = (data, method, option) => {
  data = data || {};
  data['version'] = version;
  method = method || 'POST';
  option = option || {};

  return new Promise(function(resolve, reject) {
    http.request('POST', 'API', 'data').then(function(res) {
      resolve(res)
    }, errorHandler)
    if (data.isLogin == false) {
      utils.myRequest(method, host, data, option).then(function(res) {
        resolve(res);
      }, errorHandler);
    } else {
      stor.get('identity').then(
        function(res) {

          if ((!res.member_id || !res.token) && !res._odsn) {
            errorHandler(new Excp('请先登录', 401, res));
            return false;
          }

          utils.myRequest(method, host, data, option).then(function(res) {
            resolve(res);
          }, errorHandler);
        },
        function(err) {
          errorHandler(new Excp('请先登录', 401, err));
        }
      );
    }
  });
};

module.exports = {
  xhr: xhr
}