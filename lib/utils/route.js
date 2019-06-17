import Vue from 'vue'
import { getComponentRoutePath } from '../router/utils'

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
 * 获取匹配到的路由记录
 * @param route 路由
 * @returns {Array}
 */
export function getMatchedRoutes(route) {
  if (route === null || (typeof route !== 'string' && typeof route !== 'object')) {
    return []
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
  return Array.isArray(matched) ? matched : []
}

/**
 * 获取路由记录上的默认路由组件
 * @param route
 * @returns {null|*}
 */
export function getDefaultRouteComponent(route) {
  const matched = getMatchedRoutes(route)
  if (!matched.length) {
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
 * 路由路径是否为连字符格式
 * @returns {boolean}
 */
export function isKebabCasePath() {
  const $router = getRouter()
  if ($router && $router.options) {
    return !!$router.options['kebabCasePath']
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
    if (x === '') {
      x = '/'
    } else if (!caseSensitive) {
      x = x.toLowerCase()
    }
  } else {
    x = {}
  }
  if (typeof y === 'string') {
    y = trimPathTrailingSlash(y)
    if (y === '') {
      y = '/'
    } else if (!caseSensitive) {
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

/**
 * 获取路由视图的路由路径地址
 * @param view 路由视图组件实例对象
 * @param root
 * @returns {string}
 */
export function getRouterViewPath(view, root) {
  // 可以通过root指定视图根路由path
  let rootPath = typeof root === 'string' ? root.trim() : ''
  if (!rootPath.startsWith('/')) {
    // 获取父路由组件的路由路径
    // 如果相同的路由组件拥有不同的路由路径，将会不能正确获取对应路径
    // 通过root属性可手动配置父路由路径
    let parent = view
    while ((parent = parent.$parent)) {
      if ((rootPath = getComponentRoutePath(parent))) {
        break
      }
    }
  }
  return typeof rootPath === 'string' ? rootPath : ''
}

/**
 * 根据当前的路由记录，获取从当前路由视图出口开始的路由记录列表
 * @param view 路由组件
 * @param root 路由组件的路由路径
 * @param special 是否包含特殊路由
 * @returns {Array}
 */
export function getMatchedRoutesByView(view, root, special) {
  const { $router, $route } = view
  if (
    !$router ||
    !$route ||
    // 特殊路由
    (!special &&
      typeof $router.getRoutingStatus === 'function' &&
      $router.getRoutingStatus($route))
  ) {
    return []
  }
  const rootPath = getRouterViewPath(view, root)
  const matched = getMatchedRoutes($route)
  if (!rootPath) {
    return matched.length ? [matched[0]] : []
  }
  const parentRouteIndex = matched.findIndex((route) => isSameRoute(route, rootPath))
  // 返回当前视图所在路由出口开始的路由记录列表
  return parentRouteIndex !== -1 ? matched.slice(parentRouteIndex + 1) : []
}
