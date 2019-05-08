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
  const to = matched[0].components
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
 * 是否是相同的路由（只比较path）
 * @param x string or object
 * @param y string or object
 * @param caseSensitive
 * @returns {boolean}
 */
export function isSameRoute(x, y, caseSensitive) {
  if (typeof caseSensitive === 'undefined') {
    const $router = getRouter()
    if ($router && $router.options) {
      caseSensitive = !!$router.options.caseSensitive
    }
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
