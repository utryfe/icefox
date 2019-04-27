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
  const excludeInGlobal = ['state', 'mutations', 'actions', 'getters', 'modules']

  // 因为要保证模块化的正确性，这里不允许从main.js主入口配置中设置store状态相关的配置
  // 根store可以放置在页面（视图）根目录下（也即 '/' 路径下 ）
  checkGlobalSetup(globalSetup, excludeInGlobal)

  const options = {
    state: {},
    ...toObject(baseSetup),
    ...toObject(globalSetup, excludeInGlobal),
    modules,
  }

  const store = new Store(
    // store上下文中，我们注入call函数，可用进行promise化，或者根据服务发起请求
    injectActionCall(options, plugins)
  )

  // 如果有创建完成的回调函数，那就执行它
  if (typeof created === 'function') {
    created.call(store, store)
  }

  return store
}
