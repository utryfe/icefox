import Vue from 'vue'
import NProgress from 'nprogress'
import '../theme/styles/nprogress.less'
import { kebabCase } from '../utils/mixed'
import { getComponentRoutePath } from './utils'
import {
  getDefaultRouteComponent,
  getMatchedRoutes,
  isKebabCasePath,
  isSameRoute,
  trimPathTrailingSlash,
} from '../utils/route'

/**
 * 判定参数是否为路由记录
 * @param obj
 * @returns {boolean}
 */
function isRoute(obj) {
  const type = typeof obj
  if (type === 'string' && obj.trim()) {
    return true
  }
  if (type === 'object' && obj !== null && obj.hasOwnProperty('path')) {
    const path = obj.path
    return !!(typeof path === 'string' && path.trim())
  }
  return false
}

/**
 * 获取路由状态码
 * @param statusRoute
 * @param to 路由记录
 * @returns {number} 若匹配则返回状态码，否则返回 0
 */
function getRoutingStatus(statusRoute, to) {
  const matched = getMatchedRoutes(to)
  if (matched && matched.length) {
    to = matched[matched.length - 1].path
    for (const [status, path] of Object.entries(statusRoute)) {
      if (/^\d+$/.test(status) && isSameRoute(path, to)) {
        return +status
      }
    }
  }
  return 0
}

/**
 * 拦截状态路由，比如404、500等
 * @param router
 * @param options
 */
function applyStatusRouting(router, options) {
  // 状态路由路径
  const statusRoute = Object.assign(
    {
      403: '/403',
      404: '/404',
      500: '/500',
    },
    options['statusRoute'],
    {
      // 根路由重定向路由
      301: '/301/:path*',
      // 子路由重定向路由
      302: '/302/:path*',
    }
  )

  const stub = 'getRoutingStatus'
  Object.defineProperty(router, stub, {
    value: getRoutingStatus.bind(null, statusRoute),
  })

  // 进行状态路由检查
  router.beforeResolve((to, from, next) => {
    if (!getRoutingStatus(statusRoute, to)) {
      // 路由组件检查
      if (!getDefaultRouteComponent(to)) {
        const path = statusRoute['404']
        if (isRoute(path)) {
          next(
            Object.assign({}, typeof path === 'string' ? { path } : path, {
              replace: true,
            })
          )
          return
        }
      }
    }

    // 正常路由
    next()
  })
}

/**
 * 添加路由组件重定向声明支持
 * @param router
 * @param options
 */
function applyRouteRedirect(router, options) {
  if (options['noRedirect']) {
    return
  }
  // 需要 2.5+ 版本的 vue-router
  router.beforeResolve(async (to, from, next) => {
    const component = getDefaultRouteComponent(to)
    if (component) {
      const redirect = component.redirect
      let route = typeof redirect === 'function' ? redirect(to, from) : redirect
      if (route instanceof Promise) {
        route = await route
      }

      if (isRoute(route)) {
        const routeRecord = typeof route === 'string' ? { path: route } : route
        const { path } = routeRecord
        // 检查是否为相对路由路径
        if (!path.startsWith('/')) {
          // 拼接绝对路径
          const absPath = getComponentRoutePath(component)
          if (absPath) {
            routeRecord.path = `${
              absPath === '/' ? '' : trimPathTrailingSlash(absPath)
            }/${path}`
          }
        }
        if (isKebabCasePath()) {
          // 转换为连字符格式
          routeRecord.path = kebabCase(routeRecord.path)
        }
        if (!isSameRoute(to, routeRecord)) {
          next(routeRecord)
          return
        }
      }
    }
    //
    next()
  })
}

/**
 * 添加路由切换进度条
 * @param router
 * @param options
 */
function applyProgressBar(router, options) {
  if (options['noProgress']) {
    return
  }
  NProgress.configure({ showSpinner: false })

  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      // 为异步组件且未加载时，才显示progress
      if (typeof getDefaultRouteComponent(to) === 'function') {
        NProgress.start()
      }
    }
    next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

/**
 * 根据导航的路由组件，自动设置文档的标题。
 * @param router 路由器。
 * @param options
 */
function applyDocumentTitle(router, options) {
  if (options['noDocumentTitle']) {
    return
  }
  router.afterEach((to) => {
    const component = getDefaultRouteComponent(to)
    const appTitle = Vue.prototype.$appTitle || ''
    if (component) {
      const { title } = component
      if (typeof title === 'string' && title) {
        document.title = `${title}${
          appTitle && appTitle !== title ? ` | ${appTitle}` : ''
        }`
        return
      }
    }
    if (appTitle) {
      document.title = appTitle
    }
  })
}

/**
 * 添加全局导航守卫
 * @param router
 * @param options
 */
export default function applyHooks(router, options) {
  applyDocumentTitle(router, options)
  applyProgressBar(router, options)
  applyRouteRedirect(router, options)
  applyStatusRouting(router, options)
}
