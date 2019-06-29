/**
 * 判断参数是否是一个请求服务配置
 * @param callee 要检测的配置参数
 * @returns {boolean}
 */
function isAPIService(callee) {
  return (
    typeof callee === 'string' ||
    (callee !== null && typeof callee === 'object' && typeof callee.url === 'string')
  )
}

/**
 * 递归将call注入actions的上下文中。
 * @param store 配置对象。
 * @param call 异步call函数。
 * @returns {*}
 */
function injectToStore(store, call) {
  const { actions, modules } = Object.assign({}, store)
  if (actions && typeof actions === 'object') {
    for (const [type, action] of Object.entries(actions)) {
      if (typeof action === 'function') {
        actions[type] = function(context, payload) {
          return action.call(this, { ...context, call }, payload)
        }
      }
    }
  }
  if (modules && typeof modules === 'object') {
    for (const [name, module] of Object.entries(modules)) {
      modules[name] = injectToStore(module, call)
    }
  }
  return store
}

/**
 * 获取异步调用器。
 * @param requestPlugin 用于发起请求插件。
 * @returns {call}
 */
function getAsyncCall(requestPlugin) {
  return function call(callee, ...args) {
    let res
    if (typeof callee instanceof Promise) {
      return callee
    } else if (typeof callee === 'function') {
      res = Promise.resolve(callee(...args))
    } else if (requestPlugin && isAPIService(callee)) {
      // 请求返回的本身就是promise，且添加了访问属性的
      // 不要使用Promise.resolve处理
      res = requestPlugin.request(callee, ...args)
    } else {
      res = Promise.resolve(callee)
    }
    // 返回一个Promise
    return res
  }
}

export default function inject(store, plugins) {
  // 内建的用于ajax请求的插件不一定被用户允许安装了
  // 这里查找下
  const requestPlugin = plugins.find(({ name }) => name === 'request')
  return injectToStore(store, getAsyncCall(requestPlugin))
}
