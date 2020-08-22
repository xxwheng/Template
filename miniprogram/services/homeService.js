import { xhr } from './xhr/httpResouce';
// 请求类
class homeService {
  // 示例请求方法
  demoRequest(body = {}, method = 'hellowrold') {
    return xhr(method, body);
  }

}

module.exports = new homeService();