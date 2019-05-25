import ElementUI from 'element-ui'
import components from '../components'

// 安装组件
let installed = false
function install(Vue, opts) {
  if (installed) {
    return
  }

  const options = Object.assign({}, opts)

  // 安装element-ui
  Vue.use(ElementUI, options)

  // 保存全局配置
  Object.defineProperty(Vue.prototype, '$ICEFOX', {
    value: Object.freeze({ ...options }),
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

// 导出插件
export default {
  name: 'icefox',
  install,
}
