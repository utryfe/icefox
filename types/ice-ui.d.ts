import Vue from 'vue'
import { IceComponent } from './component'

// exports
export interface InstallationOptions {}
export function install(vue: typeof Vue, options: InstallationOptions): void
export type Component = IceComponent

// components
export {
  IceBasicLayout as BasicLayout,
  IceLayout as Layout,
  IceLayoutAside as LayoutAside,
  IceLayoutContent as LayoutContent,
  IceLayoutHeader as LayoutHeader,
  IceLayoutFooter as LayoutFooter,
  IceAsideTrigger as AsideTrigger,
} from './components/layout'
export { IceScrollbar as Scrollbar } from './components/scrollbar'
export { IceSvgIcon as SvgIcon } from './components/svg-icon'
export { IceLogoPanel as LogoPanel } from './components/logo-panel'
export { IceSplitPanes as SplitPanes } from './components/split-panes'
export { IceAsideMenu as AsideMenu, IceMenu } from './components/menu'
export { IceRouterTabs as RouterTabs } from './components/router-tabs'
