import store from '../../store'

const errHandler = e => {
  console.log('[ XHR:Failed ] 详情请看控制台');
  console.error(JSON.stringify(e));
  if (e.extra.res.data.code == 10001) {
    try {
      
    } catch (e) {
      // Do something when catch error
    }
  } else {
  }
  uni.showToast({
    title: e.extra.res.data.data.scalar || e.message,
    icon: 'none',
    duration: 1500
  });
  return false;
};

module.exports = errHandler;
