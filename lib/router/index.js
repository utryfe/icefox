import Vue from 'vue'
import VueRouter from 'vue-router'
import { formatSetup, toObject } from '../utils/mixed'
import { ensureRoutes } from './utils'
import applyHooks from './hooks'

Vue.use(VueRouter)

// 默认的路由配置
const defaultSetup = {
  base: '/',
  mode: 'hash',
  fallback: true,
  caseSensitive: false,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
}

/**
 * 动态添加路由记录
 * @param routes
 */
function addRoutes(routes) {
  this.addRoutes(ensureRoutes(routes))
}

/**
 * 创建路由实例。
 * @param base 基础路由配置。
 * @param global 全局路由配置。
 */
export default function createRouter(base, global) {
  const { routes: baseRoutes, ...baseSetup } = toObject(base)
  const { routes: globalRoutes, created, ...globalSetup } = formatSetup(global)

  let routes
  if (Array.isArray(globalRoutes) && globalRoutes.length) {
    // 如果在main.js里定义了路由配置，则不使用自动生成的配置
    routes = globalRoutes
    setTimeout(
      () =>
        (Vue.$debug || console)['warn'](
          'Using the routing configuration in the main.js file, ' +
            'the automatically generated routing configuration is ignored.'
        ),
      0
    )
  } else {
    routes = baseRoutes
  }

  const options = {
    ...defaultSetup,
    ...toObject(baseSetup),
    ...toObject(globalSetup),
    // 基于keep-alive的页签路由需要依赖组件的名称
    // 这里避免未定义或重复定义的路由组件名，确保路由组件名称的唯一性
    routes: ensureRoutes(routes),
  }

  const router = new VueRouter({ ...options })
  const stub = '$router'
  // 全局保存实例对象
  Object.defineProperty(Vue, stub, {
    value: router,
  })

  // 添加默认的全局导航守卫
  applyHooks(router, options)

  // 对动态添加路由记录函数进行代理处理
  router.addRoutes = addRoutes.bind(router)

  // 执行创建完成的回调
  if (typeof created === 'function') {
    created.call(router, router)
  }

  return router
}
