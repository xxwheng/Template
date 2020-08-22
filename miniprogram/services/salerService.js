import { saler_xhr } from './xhr/httpResouce';
class salerService {
  
  // 智能语音识别结果查询
  NlsFileResult(body = {}, method = 'NlsFileResult') {
    return saler_xhr(method, body);
  }

}

module.exports = new salerService();
