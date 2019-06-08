import 'animate.css'
import 'element-ui/lib/theme-chalk/index.css'

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
import RouterView from './RouterView'
import BreadcrumbView from './BreadcrumbView'
import TabsView from './TabsView'

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
  RouterView,
  BreadcrumbView,
  TabsView,
}

// 导出可单独安装使用的组件列表
// 供插件安装时使用
export default [
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
  RouterView,
  BreadcrumbView,
  TabsView,
]
