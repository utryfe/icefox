import axios from 'axios'
import { merge } from 'axios/lib/utils'
import qs from 'qs'
import { debugToken } from '../utils/mixed'

// 相对url检测正则
const relativeUrlReg = /^(?!\/{2,}|[^/:?&=#.]+(?:(?:\.[^/:?&=#.]+)+|:\d+))(?:\/|(?!https?:\/*)).*/i

/**
 * 所有可以使用 axios 进行请求的请求方法列表。
 * @type {string[]}
 */
const methods = ['get', 'delete', 'head', 'options', 'post', 'put', 'patch']

/**
 * 默认的请求配置
 * @type {{headers: {'Cache-Control': string, Pragma: string}, timeout: number}}
 */
const defaultConfig = {
  timeout: 10000,
  headers: {
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
  },
}

/**
 * 使用的内建插件列表
 * @type {Array}
 */
let buildInPlugins = []

/**
 * 将url路径中的参数变量替换为对应的参数值。
 * @param path url路径。
 * @param params 查询参数配置对象。
 * @param baseParams 基础查询参数，用来过滤url，但不会加入到请求参数里面去。
 * @returns {string}
 */
function paramsFilter(path, params, baseParams) {
  if (typeof path !== 'string' || !(path = path.trim())) {
    return ''
  }

  if (params === null || typeof params !== 'object') {
    params = {}
  }
  if (baseParams === null || typeof baseParams !== 'object') {
    baseParams = {}
  }

  // 使用反斜杆可以对参数符号进行转义，比如：
  // {baseUrl}/user/\{profile}
  // 被转义的参数符号，则不会执行替换处理（视作普通字符值）
  return path
    .replace(/(.?){\s*(.*?)\s*(\\|)}/g, ($0, $1, $2, $3) => {
      if ($1 === '\\' || $3 === '\\') {
        return $1 === '\\' ? $0.substring(1) : $0
      }
      if (!$2) {
        return $1
      }

      let query
      if (params.hasOwnProperty($2)) {
        query = params[$2]
        // 从查询参数配置中清除已替换的参数项
        delete params[$2]
      } else if (baseParams.hasOwnProperty($2)) {
        // 基础参数只用于url替换，不会添加到请求参数里面去
        query = baseParams[$2]
      }

      // restful风格接口，如果参数值为undefined，则动态参数采用null（因为服务端的空为null）
      return `${$1}${typeof query !== 'undefined' ? query : null}`
    })
    .trim()
}

/**
 * 解析url路径，获取url路径和请求方法信息。
 * @param config 请求配置对象。
 * @param baseParams 基础请求参数。
 * @returns {{url: string, method?: string}}
 */
function urlFilter(config, baseParams) {
  const { url, params, baseURL } = config

  // 如果没有配置基路径，则以当前页面路径为基路径
  const baseUrl = typeof baseURL === 'string' ? baseURL : window.location.host

  // 因扩展了url配置字符串的内容格式，支持 GET xxx/{xxx}/xxx 等格式
  // 所以这里要对这些格式进行分割解析
  const splitUrlReg = new RegExp(`^\\s*(?:(${methods.join('|')})\\s+)?(.+)\\s*$`, 'i')
  const [, method, path] = splitUrlReg.exec(typeof url === 'string' ? url : '') || []

  // 参数填充仅针对url查询参数的情况
  // 所以，如果有模板参数，需要通过params来传递参数
  const filteredUrl = paramsFilter(path, params, baseParams)
    // 如果参数中包含查询参数，还需要对查询参数进行编码处理
    .replace(/\?(.+)$/, ($0, $1) => {
      return `?${qs.stringify(qs.parse($1))}`
    })

  let absoluteUrl

  // 检测是否是相对地址
  if (relativeUrlReg.test(filteredUrl)) {
    // 这是一个相对地址
    // 并且也指定了根地址
    absoluteUrl = filteredUrl
      ? `${baseUrl.replace(/\/+$/, '')}/${filteredUrl.replace(/^\/+/, '')}`
      : baseUrl
  } else {
    absoluteUrl = filteredUrl
  }

  absoluteUrl = absoluteUrl
    // 兼容没加协议的情况，如：10.0.2.222/abc/
    .replace(/^[^/:?&=#.]+(?:(?:\.[^/:?&=#.]+)+|:\d+)/, '//$&')
    // 清除hash
    .replace(/#.*$/, '')

  // 没有请求地址
  if (!absoluteUrl) {
    throw new Error('Request url cannot be empty.')
  }

  const setup = {
    url: absoluteUrl,
  }

  // url路径里的有效的请求方法将覆盖掉config里面的method定义
  const lowerCaseMethod = method ? method.trim().toLowerCase() : ''
  if (methods.includes(lowerCaseMethod)) {
    setup.method = lowerCaseMethod
  }

  // 修改配置对象
  return Object.assign(config, setup)
}

/**
 * 对promise实例进行装饰，使得当前promise及链式调用产生的promise能够被cancel。
 * @param promise 当前promise。
 * @param cancel cancel方法。
 * @returns {Promise}
 */
function makeCancelablePromise(promise, cancel) {
  const proto = Promise.prototype
  for (const method of ['cancel', 'then', 'catch', 'finally']) {
    if (!promise.hasOwnProperty(method)) {
      Object.defineProperty(promise, method, {
        value:
          method === 'cancel'
            ? cancel
            : (...args) =>
                makeCancelablePromise(proto[method].apply(promise, args), cancel),
      })
    }
  }
  return promise
}

/**
 * 将当次请求转换为可取消的请求。
 * 如果调用cancel方法时未传参数，则不会将异常抛出，否则传入的参数将作为异常对象的信息抛出。
 * 如：
 *
 *  const req = this.$http('/xxx/xxx')
 *
 *  req.cancel('请求被取消了！')
 * // req 的 catch 会执行，异常信息(err.message)为传入的参数内容，then 不会执行
 *
 *  req.cancel()
 * // 静默的取消，req 的 catch 不会执行，then 也不会执行
 *
 * @param req axios实例对象。
 * @param component 组件实例对象。
 * @returns {function(*=): Promise}
 */
function cancelable(req, component) {
  // 这里尝试获取与组件关联的debug插件实例
  // 如果debug插件没有被允许采用，则不会有debug的导入
  // 如果请求方法不是直接通过组件this调用的，也不会获取到调用组件的信息及绑定的debug对象
  let debug = component ? component.$debug : null
  if (!debug || debug.token !== debugToken) {
    debug = null
  }

  // 对本次请求进行包装，使其可以通过cancel方法取消
  return function request(config) {
    const source = axios.CancelToken.source()
    const promise = req
      .request(Object.assign(config, { cancelToken: source.token }))
      .catch((error) => {
        // 如果捕获到了异常，需要判断是不是被取消的异常
        if (!axios.isCancel(error)) {
          // 非取消异常，不需要在这里处理
          throw error
        }

        // 打印取消日志信息，如果存在与组件关联的debug对象，会优先使用该对象输出
        const { message } = error
        const print = (debug || console).warn
        print(typeof message === 'string' ? message : `Request canceled. ${config.url}`)

        // 取消时设置了消息内容，则reject掉
        if (typeof message !== 'undefined') {
          return Promise.reject(error)
        }

        // 这里返回一个永远不会resolve的promise，用于静默取消掉当次请求
        return new Promise(() => {})
      })

    // 创建可终止的promise
    return makeCancelablePromise(promise, (message) => source.cancel(message))
  }
}

/**
 * 为请求实例的promise添加访问器promise。因此能实现以下的效果：
 *
 * const data = await this.$http('/a/b/c').data
 * const status = await this.$http.get('/a/b/c').status
 * const data2 = await this.$http.request({url: '/a/b/c'}).data.catch(err => {})
 *
 * 可以访问的响应属性有：
 *
 * - data         服务器的响应数据
 * - status       服务器的响应状态码（200）
 * - statusText   服务器的响应状态消息（OK）
 * - headers      服务器的响应头对象，响应头名称都是小写格式的
 * - config       当次请求的配置对象
 * - request      当次请求的请求实例对象（XMLHttpRequest）
 * - message      与当次请求相关的消息内容，一般是异常时的消息
 *
 * @param request
 * @returns {function(*=): *}
 */
function accessorize(request) {
  // 返回一个处理中间件，可以做到层层嵌套的逻辑
  // 往后再添加其他装饰器也是可以的了
  return function accessor(config) {
    // 执行实际请求
    // 该request方法实际上是上一个中间件的方法
    const promise = request(config)
    // 根据不同的属性，解析相应的响应值
    const resolve = async (prop) => {
      let response
      let error
      try {
        response = Object.assign({}, await promise)
      } catch (e) {
        error = e || {}
      }
      const value = (response || error.response || { statusText: '', message: '' })[prop]
      // 正常响应
      if (!error) {
        return value
      }
      // 异常响应，以异常形式抛出
      throw value
    }
    // 绑定属性访问器
    // 这些都是只读的
    for (const prop of [
      'data',
      'status',
      'statusText',
      'headers',
      'config',
      'request',
      'message',
    ]) {
      // 通过getter函数，能够帮助我们注入异步逻辑
      Object.defineProperty(promise, prop, {
        get: resolve.bind(this, prop),
      })
    }
    // 这里要返回原始的promise，比如：
    // cancelable在请求的promise上添加了cancel方法，所以不能返回新的promise实例
    return promise
  }
}

/**
 * 用于获取发送多个并发请求的执行器。
 *
 *  $http.all(['GET xxx/xxx', {url: 'xxx/xxx'}, function(){}, promise, any])
 *
 * @param request 已装饰的请求实例对象。
 * @returns {all}
 */
function concurrent(request) {
  return function all(iterable) {
    if (!Array.isArray(iterable)) {
      return axios.all(iterable)
    }
    // 仅处理传入参数为数组的情况
    return axios.all(
      // 将迭代项处理为promise
      iterable.map((item) => {
        let promise
        if (typeof item instanceof Promise) {
          promise = item
        } else if (typeof item === 'function') {
          promise = Promise.resolve(item())
        } else if (typeof item === 'string') {
          promise = request({ url: item })
        } else if (
          item !== null &&
          typeof item === 'object' &&
          typeof item.url === 'string'
        ) {
          promise = request(item)
        } else {
          promise = Promise.resolve(item)
        }
        return promise
      })
    )
  }
}

/**
 * 对请求对象进行代理包装，以便应用更丰富的拦截逻辑。
 * @param req axios请求实例对象。
 * @returns {function(...[*]): *}
 */
function proxyRequest(req) {
  // 保存当前request调用上下文
  let context

  // 直接用于发起ajax请求
  function ajax(...args) {
    // 取得配置对象
    // 可以追加多个配置参数，后面的配置参数会覆盖前面的
    // 配置参数为字符串时，将作为url对待
    const config = args.reduce((config, arg) => {
      if (typeof arg === 'string') {
        Object.assign(config, { url: arg })
      } else if (arg !== null && typeof arg === 'object' && !Array.isArray(arg)) {
        config = merge(config, arg)
      }
      return config
    }, {})

    let { headers } = config
    for (const [prop, contentType] of Object.entries(config)) {
      if (/^\s*content-?type\s*$/i.test(prop) && typeof contentType === 'string') {
        delete config[prop]
        if (!headers || typeof headers !== 'object') {
          config.headers = headers = {}
        }
        headers['Content-Type'] = contentType
        break
      }
    }

    // 将此次请求对象进行代理包装
    // 通过 accessorize 进行取值器装饰，使得获取响应数据变得很便捷
    // 通过 cancelable 装饰，使得能通过 promise.cancel 来取消掉此次未完成的请求
    // 这在一些连续发多个请求，但只能最后一个请求返回的数据有效时，将会比较便利
    // 比如快速翻页加载数据时，通过取消前次请求，来达到"防抖"的目的
    return accessorize(cancelable(req, context))(config)
  }

  // 设置上下文取值函数，使得通过get、post等快捷方法调用时，也能获取到当前调用的组件实例名称
  Object.defineProperty(ajax, 'context', {
    get: () => context,
    set(ctx) {
      context = ctx
    },
  })
  // 返回代理函数
  return ajax
}

/**
 * 获取不同请求方法的别名请求函数的参数解析器。
 * 比如：get方法跟post方法的默认参数签名就不一样，通过此解析器进行一致化处理。
 * @param method 请求方法名。
 * @returns {function(*, ...[*]): any}
 */
function getMethodConfigParser(method) {
  return function configParser(url, ...rest) {
    let data, config
    // 仅post、put、patch请求能够设置内容数据
    // 即使用data参数传递请求的content body
    if (/^(?:post|put|patch)$/.test(method)) {
      // 这里应用了下数组的解构，来辅助进行变量的赋值
      ;[data, config] = rest
    } else {
      ;[config] = rest
    }
    // 配置参数一致化处理为配置对象形式
    return Object.assign({ url, method, data }, config)
  }
}

/**
 * 将axios实例对象进行代理包装，提供增强型的请求对象。
 * @param req axios请求实例对象。
 * @returns {function(...[*]): *}
 */
function createRequestInstance(req) {
  // 通过对axios请求实例对象进行代理，以注入我们自己的请求逻辑
  const instance = proxyRequest(req)

  // axios实例对象除能本身发起请求外，对每一个请求方法也都提供了别名函数
  // 这里也需对每一个别名函数进行重定义，并一致化配置参数处理过程
  for (const method of methods) {
    // 不同的别名方法根据请求类型不同，会有不同的参数签名，这里一致化一下
    const parse = getMethodConfigParser(method)

    // 别名方法同样声明为只读的
    Object.defineProperty(instance, method, {
      // 这里也关联了调用上下文
      value: (...args) => instance.call(instance.context, parse(...args)),
    })
  }

  // 默认的配置对象以及拦截器设置，以及一些静态方法，也要进行重定义处理
  const { defaults, interceptors } = req

  // 它们都是只读的，防止意外被修改而全局影响到请求实例对象的使用（因为根实例对象是挂在原型链上的）
  Object.defineProperties(instance, {
    defaults: { value: defaults },
    interceptors: { value: interceptors },
    // 并发的请求，也处理为增强版
    all: { value: concurrent(instance) },
    spread: { value: axios.spread },
    Cancel: { value: axios.Cancel },
    isCancel: { value: axios.isCancel },
    CancelToken: { value: axios.CancelToken },
    // 可以通过静态方法创建出另外一个实例对象，但它仍然是进行了拦截增强处理的
    // 只是新创建的请求实例对象，会有自身的命名空间
    create: { value: createHttpRequest },
    // 这个非默认请求方法的别名请求方法，也做同样处理
    // 但其方法签名只包含一个配置参数对象，所以不需要像其他别名方法样，进行配置参数一致化处理
    request: { value: instance },
    // 工具方法，可将参数转换为 url-form-encoded 格式
    stringify: { value: qs.stringify },
    // 工具属性，可获取当前页面的查询参数对象（非路由的查询参数）
    query: {
      get() {
        return qs.parse(window.location.search, {
          ignoreQueryPrefix: true,
        })
      },
    },
  })

  return instance
}

/**
 * 创建http请求实例
 * @param defaults 配置对象
 */
function createHttpRequest(defaults) {
  const { interceptors: interceptorsConfig, baseParams, ...config } = merge(
    defaultConfig,
    Object.assign({}, defaults)
  )

  // axios响应拦截器执行顺序与添加顺序相同，而请求拦截器的执行顺序则是与添加顺序相反
  const { request, response } = Object.assign({}, interceptorsConfig)

  // 创建一个请求实例对象，这里底层使用 axios 库
  const instance = createRequestInstance(axios.create(config))
  const { interceptors } = instance

  // 如果存在mock插件（开发模式下），则添加mock拦截处理
  // 在开启了mock时，将自动连接至mock服务器
  // mock拦截将重写请求url至本地mock应用服务器
  const mockPlugin = buildInPlugins.find((plugin) => plugin && plugin.name === 'mock')
  if (mockPlugin) {
    // axios请求拦截的执行顺序与拦截器添加顺序相反
    // 这里要在默认拦截器前声明mock拦截器，也即该拦截器会最后执行
    interceptors.request.use(mockPlugin.apply)
  }

  // 内置的请求拦截器
  interceptors.request.use(
    (config) => beforeRequestSend(config, baseParams),
    handleRequestError
  )

  // 用户设置的请求拦截器
  applyInterceptors(
    interceptors.request,
    // 这里反向数组元素，使得用户先声明的请求拦截器先执行
    (Array.isArray(request) ? request : [request]).reverse()
  )

  // 用户设置的响应拦截器
  applyInterceptors(interceptors.response, response)

  // 对返回的数据作一些处理
  interceptors.response.use(afterResponseData, handleResponseError)

  return instance
}

/**
 * 应用拦截器配置。
 * @param manager 拦截器管理器。
 * @param interceptors 拦截器配置。
 */
function applyInterceptors(manager, interceptors) {
  if (!Array.isArray(interceptors)) {
    interceptors = [interceptors]
  }
  for (const interceptor of interceptors) {
    let resolve, reject
    if (interceptor && typeof interceptor === 'object') {
      ;({ resolve, reject } = interceptor)
    } else {
      resolve = interceptor
    }
    if (typeof resolve !== 'function') {
      resolve = undefined
    }
    if (typeof reject !== 'function') {
      reject = undefined
    }
    if (resolve || reject) {
      manager.use(resolve, reject)
    }
  }
}

/**
 * 请求内容的内容类型别名转换。记不住长名称的，可以使用别名。
 * @param alias 别名。
 * @returns {string|*}
 */
function getContentTypeByAlias(alias) {
  if (/^\s*urlencoded\s*$/i.test(alias)) {
    return 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  if (/^\s*json\s*$/i.test(alias)) {
    return 'application/json;charset=UTF-8'
  }
  return alias.trim()
}

/**
 * 在请求被发送前进行拦截处理。
 * @param config 请求配置对象。
 * @param baseParams 基础请求参数。
 */
function beforeRequestSend(config, baseParams) {
  if (config && config.params) {
    // 参数需要拷贝一份
    // 进行url参数过滤时，会对已匹配的参数对象属性进行删除
    config.params = Object.assign({}, config.params)
  }
  // 拷贝一份主要配置
  config = Object.assign({}, config)
  // 先需要过滤url参数配置
  const { method, data } = urlFilter(config, baseParams)
  const headers = (config.headers = Object.assign({}, config.headers))
  headers[method] = Object.assign({}, headers[method])

  // 检查请求方法是否有效
  if (!methods.includes(method)) {
    throw new Error('Request method is invalid.')
  }

  // 符合ajax请求条件的请求方法，应当添加ajax请求头声明
  // express服务器或一些其他应用服务器会根据该请求头来判断当前请求是不是一个ajax请求
  if (!/^(?:head|options)$/i.test(method)) {
    headers[method] = Object.assign(
      // 添加默认的请求头，此值仍可以被用户改写
      { 'X-Requested-With': 'XMLHttpRequest' },
      headers[method],
      typeof headers['X-Requested-With'] === 'string'
        ? { 'X-Requested-With': headers['XMLHttpRequest'] }
        : null
    )
  }

  // 如果未指定 transformRequest ，axios根据默认配置会依据数据类型进行数据格式转换
  if (/^(?:post|put|patch)$/i.test(method)) {
    for (const [prop, contentType] of [
      ...Object.entries(headers),
      ...Object.entries(config),
    ]) {
      // 格式化
      if (/^\s*content-?type\s*$/i.test(prop)) {
        if (typeof contentType === 'string') {
          headers['Content-Type'] = getContentTypeByAlias(contentType)
        } else {
          delete headers[prop]
        }
        break
      }
    }
    // 仅在手动设定而非默认设定时，才应用此转换
    const contentType = headers['Content-Type']
    // 如果发送数据的内容类型是表单编码类型，则将对象数据进行encode
    if (
      contentType &&
      contentType.startsWith('application/x-www-form-urlencoded') &&
      data !== null &&
      typeof data === 'object'
    ) {
      config.data = qs.stringify(data)
    }
  }

  return config
}

/**
 * 在请求发生错误时进行拦截处理。
 * @param error 请求错误的异常对象。
 * @returns {Promise<never>}
 */
function handleRequestError(error) {
  return Promise.reject(error)
}

/**
 * 在请求得到响应时，进行拦截处理。
 * @param response 响应对象。
 * @returns {*}
 */
function afterResponseData(response) {
  return response
}

/**
 * 在请求响应发生错误时进行拦截处理。
 * @param error 请求响应的异常对象。
 * @returns {Promise<never>}
 */
function handleResponseError(error) {
  return Promise.reject(error)
}

/**
 * HTTP请求插件。
 */
const plugin = {
  // 插件名称，在关联插件配置参数时，将依赖此值
  name: 'request',
  // 插件安装方法
  install(Vue, defaults, plugins) {
    // 保存内建app插件列表
    if (Array.isArray(plugins)) {
      buildInPlugins = plugins
    }

    // 创建请求实例
    const request = createHttpRequest(defaults)

    // 注入到 store actions 中
    // 可以从 actions 的上下文中使用 call 调用请求服务
    Object.defineProperty(plugin, 'request', {
      get() {
        request.context = undefined
        return request
      },
    })

    const stub = '$http'
    // 添加为静态属性，方便全局访问
    Object.defineProperty(Vue, stub, {
      get() {
        request.context = undefined
        return request
      },
    })

    // 添加到 Vue 原型链上，以供所有组件实例访问
    // 这里也设置成了只读属性
    Object.defineProperty(Vue.prototype, stub, {
      get() {
        // 关联上下文
        request.context = this
        return request
      },
    })
  },
}

export default plugin
