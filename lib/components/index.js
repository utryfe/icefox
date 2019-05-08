import ElementUI from 'element-ui'
import {
  BasicLayout,
  Layout,
  LayoutAside,
  LayoutContent,
  LayoutHeader,
  LayoutFooter,
} from './Layout'
import AsideTrigger from './AsideTrigger'
import SplitPanes from './SplitPanes'
import Menu from './Menu'
import Scrollbar from './Scrollbar'
import AsideMenu from './AsideMenu'
import LogoPanel from './LogoPanel'
import SvgIcon from './SvgIcon'
import RouterTabs from './RouterTabs'

// 添加可单独安装使用的组件
const components = [
  BasicLayout,
  Layout,
  LayoutAside,
  LayoutContent,
  LayoutHeader,
  LayoutFooter,
  AsideTrigger,
  SplitPanes,
  Menu,
  Scrollbar,
  AsideMenu,
  LogoPanel,
  SvgIcon,
  RouterTabs,
]

// 导出组件
export {
  BasicLayout,
  Layout,
  LayoutAside,
  LayoutContent,
  LayoutHeader,
  LayoutFooter,
  AsideTrigger,
  SplitPanes,
  Menu,
  Scrollbar,
  AsideMenu,
  LogoPanel,
  SvgIcon,
  RouterTabs,
}

//
// 安装组件
let installed = false
function install(Vue, opts) {
  if (installed) {
    return
  }
  opts = Object.assign({}, opts)
  // 安装element-ui
  Vue.use(ElementUI, opts)
  // 保存全局配置
  Object.defineProperty(Vue.prototype, '$ICEFOX', {
    value: Object.freeze({ ...opts }),
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
