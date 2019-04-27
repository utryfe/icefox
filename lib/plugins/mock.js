import parseUrl from 'url-parse'

/**
 * 进行mock过滤，重写当前请求地址至本地mock应用服务器地址。
 */
export default {
  name: 'mock',
  // 非vue插件的内置插件使用apply函数来应用插件
  apply(config) {
    // 仅当非产品模式构建时，才进行mock拦截修改
    // 非产品模式构建时，该插件也不会被导入到代码中
    if (process.env.NODE_ENV !== 'production') {
      config = Object.assign({}, config)
      const { url, method } = config
      if (typeof url !== 'string') {
        return
      }

      // 解析url
      const parsed = parseUrl(url)
      // 实际访问的远程主机地址
      const remoteHost = `${parsed.hostname}:${parsed.port || 80}`

      // 这里协议变更为非安全协议，因为使用https协议需要证书的支持
      parsed.set('protocol', 'http:', false)
      parsed.set('host', window.location.host, false)

      // 设置请求头
      const headers = (config.headers = Object.assign({}, config.headers))
      headers[method] = Object.assign({}, headers[method])
      // 这里将原来的访问主机地址，设置到请求头里面
      // 进行远程代理需要这个主机地址信息
      Object.assign(headers[method], {
        'X-Proxy-Remote': remoteHost,
      })

      // 返回修改后的配置项
      return Object.assign(config, {
        // 新的mock服务器请求地址
        url: parsed.href,
        headers,
      })
    }
  },
}
