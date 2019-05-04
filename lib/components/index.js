import BasicLayout from './BasicLayout'
import SplitPanes from './SplitPanes'

const components = [BasicLayout, SplitPanes]

// 安装组件
let installed = false
function install(Vue, opts) {
  if (installed) {
    return
  }
  // 全局配置
  Object.defineProperty(Vue.prototype, '$ICEFOX', {
    value: Object.freeze(Object.assign({}, opts)),
  })
  // 安装所有组件
  components.forEach((component) => {
    if (typeof component.install === 'function') {
      component.install(Vue)
    }
  })
  // 标记为已安装
  installed = true
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 组件插件安装器
const plugin = {
  name: 'icefox',
  install,
}
// 导出默认插件
export default plugin

// 导出组件
export { BasicLayout, SplitPanes }
