//https 请求驱动,
import errHandler from './errHandler';
import xpm from '../../libs/xpmjs/xpm';
import config from '../../config';
xpm.option({
    host: config.host,
    hostdir: config.hostdir,
    https: config.https,
    protocol: config.protocol,
    version: config.version,
    platform: config.platform,
})
var http = xpm.require('utils');
import store from '../../store'
/**
 *  command =  method
 *  body 发送数据对象
 *  auth 判断是否先验证授权
 *  receiver
 */
const xhr = (command, body, auth = false, receiver) => {
    var body = body;
    body['methodName'] = command;
    var userInfo = store.state.userInfo
	
	//
    /// 这里可以添加公共参数
	
    var api = config.protocol + config.host + config.hostdir;
    return new Promise(function (resolve, reject) {
        http.request(api, command, body, 'POST', receiver).then(function (res) {
            resolve(res);
        }, function (e) {
            errHandler(e)
            reject(e)
        });
    });
};
module.exports = xhr;