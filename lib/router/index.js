import Vue from 'vue'
import VueRouter from 'vue-router'
import { formatSetup, toObject } from '../utils/mixed'
import { afterEach } from './hooks'

Vue.use(VueRouter)

// 默认的路由配置
const defaultSetup = {
  base: '/',
  mode: 'hash',
  fallback: true,
  caseSensitive: false,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
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
    routes,
  }

  const router = new VueRouter(options)

  const stub = '$router'
  // 全局保存实例对象
  Object.defineProperty(Vue, stub, {
    value: router,
  })

  // 添加默认的全局导航守卫
  afterEach(router)

  if (typeof created === 'function') {
    created.call(router, router)
  }

  return router
}
