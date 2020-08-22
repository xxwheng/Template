import { showToast } from '../../utils/util';

// 重新登录
function reloginFunc() {
  try {
    
  } catch (e) {
    // Do something when catch error
  }
};

const errorHandler = e => {
  console.log('[ XHR:Failed ] 详情请看控制台');
  console.error(JSON.stringify(e));

  if (e.code == 401) {
    reloginFunc();
  } else if (e.code == 404) {
    showToast('接口异常')
  } else {
    showToast('message');
  }
  return false;
};


module.exports = {
  errorHandler: errorHandler
} ;
