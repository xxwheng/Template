import xhr from './xhr/index';

class home {
	// 示例
	helloworld(body = {}, method = '') {
		return xhr(method, body)
	}
}

module.exports = new home();