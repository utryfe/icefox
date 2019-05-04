import Vue from 'vue'

/**
 * 安装Vue插件。
 * @param plugins 插件列表。
 */
export function install(plugins) {
  if (!Array.isArray(plugins)) {
    plugins = [plugins]
  }
  for (let plugin of plugins) {
    if (!plugin) {
      continue
    }
    let options
    if (Array.isArray(plugin)) {
      // 解析插件配置参数
      // 插件可以有多个配置参数
      ;[plugin, ...options] = plugin
    } else {
      options = []
    }
    if (typeof plugin.install === 'function' || typeof plugin === 'function') {
      // 满足插件格式，才应用该插件
      Vue.use(plugin, ...options)
    }
  }
}
