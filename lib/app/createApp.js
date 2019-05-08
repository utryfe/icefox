import Vue from 'vue'
import { formatSetup, toObject } from '../utils/mixed'
import { getAvailableElement } from '../utils/dom'
import { install as installPlugins } from '../utils/plugins'
// 一些内置的实例增强模块
import '../filters/global'
import '../directives/global'
import '../mixins/global'

/**
 * 获取内建插件的配置项。
 * @param name 插件名称。
 * @param plugins 插件声明列表。
 * @returns {*}
 */
function getBuildInPluginOptions(name, plugins) {
  if (Array.isArray(plugins)) {
    for (const [index, plugin] of Object.entries(plugins)) {
      if (Array.isArray(plugin)) {
        const [pluginName, pluginOptions] = plugin
        if (pluginName === name) {
          // 从插件声明列表里删除内建插件配置
          plugins.splice(index, 1)
          return pluginOptions
        }
      }
    }
  }
}

/**
 * 获取已使用的插件列表。
 * 内建插件可以通过插件名来配置，比如：
 *
 * ['request', {
 *    params: {}
 * }]
 *
 * 非内建插件需要是一个函数或者包含install方法的对象，比如：
 *
 * [ElementUI, {
 *    zIndex: 1000
 * }]
 *
 * @param buildInPlugins 内建插件列表。
 * @param plugins 插件声明列表。
 * @returns {object[]}
 */
function getUsedPlugins(buildInPlugins, plugins) {
  // 取得插件项
  // 如果插件为一个数组，则数组的第一项为插件本身，后续项为插件的配置参数
  return buildInPlugins
    .map((plugin) => [
      plugin,
      getBuildInPluginOptions(plugin.name, plugins),
      // 内建插件配置列表的第二个参数设为内建插件列表，方便插件间相互调用
      buildInPlugins,
    ])
    .concat(plugins)
}

/**
 * 创建App实例。
 * @param base 基础配置对象。
 * @param global 外部配置对象。
 * @param buildInPlugins 使用的内建插件列表。
 */
export default function createApp(base, global, buildInPlugins) {
  const { store, router, ...baseSetup } = toObject(base)
  const { title, plugins, el, ...globalSetup } = formatSetup(global)

  if (typeof title === 'string') {
    document.title = title
    Object.defineProperty(Vue.prototype, '$appTitle', {
      value: title,
    })
  }

  // 安装使用的插件
  installPlugins(getUsedPlugins(buildInPlugins, plugins))

  const options = {
    el: getAvailableElement(el),
    template: '<no-app/>',
    ...toObject(baseSetup),
    ...toObject(globalSetup),
    store,
    router,
  }

  return new Vue(options)
}
