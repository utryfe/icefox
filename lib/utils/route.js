import Vue from 'vue'

/**
 * 获取路由器实例对象
 */
export function getRouter() {
  let $router
  try {
    $router = Vue.$router
  } catch (e) {
    try {
      $router = Vue.prototype.$router
    } catch (e) {
      //
    }
  }
  if (typeof $router !== 'object') {
    $router = null
  }
  return $router
}

/**
 * 获取路由记录上的默认路由组件
 * @param route
 * @returns {null|*}
 */
export function getDefaultRouteComponent(route) {
  if (route === null || (typeof route !== 'string' && typeof route !== 'object')) {
    return null
  }
  let { matched } = route
  if (!Array.isArray(matched)) {
    const $router = getRouter()
    if ($router) {
      route = $router.resolve(route).route
      if (route) {
        matched = route.matched
      }
    }
  }
  if (!Array.isArray(matched) || !matched.length) {
    return null
  }
  const to = matched[matched.length - 1].components
  if (to !== null && typeof to === 'object' && to.hasOwnProperty('default')) {
    return to['default']
  }
  return null
}

/**
 * 移除路径结尾的斜杆
 * @param path
 * @returns {string}
 */
export function trimPathTrailingSlash(path) {
  if (typeof path === 'string') {
    return path.trim().replace(/(?!^)\/?$/, '')
  }
  return ''
}

/**
 * 路由路径匹配是否大小写敏感
 * @returns {boolean}
 */
export function isRouteCaseSensitive() {
  const $router = getRouter()
  if ($router && $router.options) {
    return !!$router.options.caseSensitive
  }
  return false
}

/**
 * 是否是相同的路由（只比较path）
 * @param x string or object
 * @param y string or object
 * @param caseSensitive
 * @returns {boolean}
 */
export function isSameRoute(x, y, caseSensitive) {
  if (typeof caseSensitive === 'undefined') {
    caseSensitive = isRouteCaseSensitive()
  }
  if (typeof x === 'object') {
    x = x.path
  }
  if (typeof y === 'object') {
    y = y.path
  }
  if (typeof x === 'string') {
    x = trimPathTrailingSlash(x)
    if (!caseSensitive) {
      x = x.toLowerCase()
    }
  } else {
    x = {}
  }
  if (typeof y === 'string') {
    y = trimPathTrailingSlash(y)
    if (!caseSensitive) {
      y = y.toLowerCase()
    }
  } else {
    y = {}
  }
  return x === y
}

/**
 * 获取路由组件的标题
 * @param route 路由对象
 * @param prop 标题属性，默认为title
 * @returns {string}
 */
export function getRouteComponentTitle(route, prop = 'title') {
  const component = getDefaultRouteComponent(route)

  let title
  if (typeof prop === 'string') {
    title = route[prop]
  } else if (typeof prop === 'function') {
    title = prop(route, component)
  }

  if (component && typeof title !== 'string') {
    title = component[prop]
  }

  if (typeof title !== 'string') {
    title = ''
  }

  return title
}
