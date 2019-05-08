import Vue from 'vue'
import { getDefaultRouteComponent, isSameRoute } from '../utils/route'

/**
 * 获取路由状态码
 * @param statusRoute
 * @param to 路由记录
 * @returns {number} 若匹配则返回状态码，否则返回 0
 */
function getRoutingStatus(statusRoute, to) {
  for (const [status, path] of Object.entries(statusRoute)) {
    if (/^\d+$/.test(status) && isSameRoute(path, to)) {
      return +status
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
    options['statusRoute']
  )

  const stub = 'getRoutingStatus'
  Object.defineProperty(router, stub, {
    value: getRoutingStatus.bind(null, statusRoute),
  })

  router.afterEach((to) => {
    if (getRoutingStatus(statusRoute, to)) {
      return
    }
    if (!getDefaultRouteComponent(to)) {
      const path = statusRoute['404']
      if (typeof path === 'string') {
        router.replace(path)
      }
    }
  })
}

/**
 * 根据导航的路由组件，自动设置文档的标题。
 * @param router 路由器。
 */
function applyDocumentTitle(router) {
  router.afterEach((to) => {
    const component = getDefaultRouteComponent(to)
    if (component) {
      const { title } = component
      if (typeof title === 'string') {
        document.title = title
        return
      }
    }
    document.title = Vue.prototype.$appTitle || ''
  })
}

/**
 * 添加后置导航守卫。
 * @param router
 * @param options
 */
export function afterEach(router, options) {
  applyStatusRouting(router, options)
  applyDocumentTitle(router)
}
