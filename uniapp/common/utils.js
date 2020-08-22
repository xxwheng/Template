import stor from '../libs/xpmjs/service/stor'
import moment from '../libs/moment.min'; //导入模块

moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 

function format(data) {
    let time = moment(data).valueOf()
    return Math.floor(time / 1000)
}

function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([hour, minute, second]).map(function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }).join(':')
}

// 时间戳转日期
const timeStampToDate = function (timeStamp, f, flag = false) {
    var md = new Date(1e3 * parseInt(timeStamp)),
        year = md.getFullYear(),
		yy = year.toString().substr(2, 2),
        month = formatNumber(md.getMonth() + 1),
        date = formatNumber(md.getDate()),
        hour = formatNumber(md.getHours()),
        minutes = formatNumber(md.getMinutes());
		year = flag == true ? yy : year
    if (f == 'day') {
        return year + '年' + month + '月' + date + '日';
    } else if (f == 1) {
        return month + '-' + date;
    } else if (f == 2) {
        return year + '-' + month + '-' + date;
    } else if (f == 3) {
        return year + '-' + month;
    } else if (f == 4) {
        return hour + ':' + minutes;
    } else if (f == 5) {
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
    } else if (f == 6) {
		return {
			month: month, day: date,
		}
	}else {
        return year + '/' + month + '/' + date + ' ' + hour + ':' + minutes;
    }
};

// 日期转时间戳
const dateToTimeStamp = function (stringTime) {
    // 转为时间戳,秒
    // 正确 var stringTime = '2013/07/10';
    // 不允许 var stringTime = '2013/9/7';
    // var stringTime = '2013/07/10 10:01:01';
    if (typeof stringTime == "string") {
        stringTime = stringTime.replace(/-/g, "/");
        var date = stringTime.split("/");
        if (date[1] && date[1] < 10) {
            date[1] = "0" + date[1]
        }
        if (date[2] && date[2] < 10) {
            date[2] = "0" + date[2]
        }
        stringTime = date.join("/"); //兼容ios
    }
    var timestamp
    if (stringTime) {
        var newDate = new Date(stringTime);
        if (typeof stringTime == "string")
            if (stringTime.indexOf(":") < 0) newDate.setHours(0);
        var timestampNs = Date.parse(newDate);
        timestamp = timestampNs / 1000;
    } else {
        timestamp = 0;
    }
    return timestamp;
}

// 位数不足补零
const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
};

function isMobile(phone) {
    // 手机号正则
    var reg = /^1[3-9][0-9]\d{8}$/;
    if (reg.test(phone)) {
        return true;
    }
    return false;
};


/**
 * @param {Function} func 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
 */
function promiseHandle(func, options) {
    options = options || {};
    return function (options) {
        return new Promise((resolve, reject) => {
            if (typeof func !== 'function')
                reject();
            options.success = resolve;
            options.fail = reject;
            func(options);
        });
    }
}

//生成随机数
function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/**
 * [_stor 设置localstorage缓存]
 * snyc 保留
 * obj  object / string
 * @param {key 键值， obj：数据 ，sync 是否采用同步}  
 * return data
 */
const _stor = function (key, obj, sync = false) {
    if (typeof obj == 'string' || typeof obj == 'object' || typeof obj == 'boolean' || typeof obj == 'number') {
        return stor.set(key, obj).then(function (resp) {}, function (e) {
            if (e.code == 500) {
                uni.showToast({ 'title': e.message, icon: 'none' });
                return;
            }
        })
    } else {
        return stor.get(key).then(function (resp) {
            return resp
        }, function (e) {
            return false;
        })
    }
}

// obj转url
const obj2uri = obj => {
    return Object.keys(obj).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
}

function isWeiXin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//计算年龄
function getAge(birthday) {
    if (birthday <= 0) { return 0 }
    var birthDate = new Date(1e3 * parseInt(birthday));
    var birthY = birthDate.getFullYear(),
        birthM = birthDate.getMonth() + 1,
        birthD = birthDate.getDate();

    var nowTime = new Date();
    var nowY = nowTime.getFullYear(),
        nowM = nowTime.getMonth() + 1,
        nowD = nowTime.getDate();

    var year = nowY - birthY
    if (birthM > nowM) {
        year--
    } else if (birthM == nowM && birthD > nowD) {
        year--
    }
    return year < 0 ? 0 : year
}

/* 字符串转时间戳 */
function timeStrToStamp(str) {
    str = str.replace(/-/g, '/');
    return new Date(str).getTime() / 1000;
}

function jsonDeepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function replaceHttpToHttps(url) {
    var reg = /^http:\/\/*?/;
    if (reg.test(url)) url = url.replace('http', 'https');
    return url;
};

// 时间戳的只转为时分秒
function formatDuring(ms) {
    var ms = ms * 1000;
    var hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
    hours = hours < 10 ? ('0' + hours) : hours;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    return hours + ":" + minutes;
}

function isEmpty(v) {
    switch (typeof v) {
    case 'undefined':
        return true;
    case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
        break;
    case 'boolean':
        if (!v) return true;
        break;
    case 'number':
        if (0 === v || isNaN(v)) return true;
        break;
    case 'object':
        if (null === v || v.length === 0) return true;
        for (var i in v) {
            return false;
        }
        return true;
    }
    return false;
}



/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
function formatCurrency(num) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) {
    num = '0';
  }
  var sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  var cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = '0' + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      ',' +
      num.substring(num.length - (4 * i + 3));

  return (sign ? '' : '-') + num + '.' + cents;
}

module.exports = {
    isMobile,
    promiseHandle,
    random_string,
    _stor,
    obj2uri,
    isWeiXin,
    getAge,
	formatNumber,
    formatTime,
	timeStrToStamp,
    timeStampToDate,
    jsonDeepCopy,
    dateToTimeStamp,
    format,
    replaceHttpToHttps,
    formatDuring,
    isEmpty,
	getSkuName,
	getSkuId,
	timediff,
	formatCurrency
}