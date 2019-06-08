import Vue from 'vue'
import VueRouter from 'vue-router'
import { formatSetup, toObject } from '../utils/mixed'
import { ensureRouteComponentName } from './name'
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
  this.addRoutes(ensureRouteComponentName(routes))
}

/**
 * 创建路由实例。
 * @param base 基础路由配置。
 * @param global 全局路由配置。
 */
export default function createRouter(base, global) {
  const { routes = [], ...baseSetup } = toObject(base)
  const { created, ...globalSetup } = formatSetup(global)

  const options = {
    ...defaultSetup,
    ...toObject(baseSetup),
    ...toObject(globalSetup),
    // 基于keep-alive的页签路由需要依赖组件的名称
    // 这里避免未定义或重复定义的路由组件名，确保路由组件名称的唯一性
    routes: ensureRouteComponentName(routes),
  }

  const router = new VueRouter({ ...options })

  // 对动态添加路由记录函数进行代理处理
  router.addRoutes = addRoutes.bind(router)

  const stub = '$router'
  // 全局保存实例对象
  Object.defineProperty(Vue, stub, {
    value: router,
  })

  // 添加默认的全局导航守卫
  applyHooks(router, options)

  // 执行创建完成的回调
  if (typeof created === 'function') {
    created.call(router, router)
  }

  return router
}
