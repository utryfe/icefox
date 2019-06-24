import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { formatSetup, toObject } from '../utils/mixed'
import injectActionCall from './inject'
import { checkGlobalSetup } from './check'

Vue.use(Vuex)

/**
 * 创建一个Store实例。
 * @param base 基础配置。
 * @param global 全局配置。
 * @param plugins 启用的内建插件列表。
 * @returns {Store<any>}
 */
export default function createStore(base, global, plugins) {
  const { modules = {}, ...baseSetup } = toObject(base)
  const { created, ...globalSetup } = formatSetup(global)

  // 检查全局配置中的属性，并作出提示
  checkGlobalSetup(globalSetup)

  const options = {
    modules,
    state: {},
    ...toObject(baseSetup),
    ...toObject(globalSetup),
  }

  const store = new Store(
    // store上下文中，我们注入call函数，可用进行promise化，或者根据服务发起请求
    injectActionCall(options, plugins)
  )

  const stub = '$store'

  // 全局保存实例对象
  Object.defineProperty(Vue, stub, {
    value: store,
  })

  // 如果有创建完成的回调函数，那就执行它
  if (typeof created === 'function') {
    created.call(store, store)
  }

  return store
}
