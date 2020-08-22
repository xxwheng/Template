// 项目配置
const debug = false
// 版本号
const version = '1.0.0'

const protocol = debug ? 'http://' : 'https://'
const host = debug ? 'www.baidu.com' : 'www.baidu.com.cn'

const platform = 'miniprogram'

module.exports = {
  debug: debug,
  version: version,
  protocol: protocol,
  host: host,
  platform: platform
}