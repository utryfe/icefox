import Vue from 'vue'
import { IceComponent } from './component'

// exports
export interface InstallationOptions {}
export function install(vue: typeof Vue, options: InstallationOptions): void
export type Component = IceComponent

// components
import {
  IceBasicLayout,
  IceLayout,
  IceLayoutAside,
  IceLayoutContent,
  IceLayoutHeader,
  IceLayoutFooter,
  IceAsideTrigger,
} from './components/layout'
import { IceScrollbar } from './components/scrollbar'
import { IceSvgIcon } from './components/svg-icon'
import { IceLogoPanel } from './components/logo-panel'
import { IceSplitPanes } from './components/split-panes'
import { IceAsideMenu } from './components/menu'
import { IceTabsView } from './components/tabs-view'

export { IceMenu } from './components/menu'
export class BasicLayout extends IceBasicLayout {}
export class Layout extends IceLayout {}
export class LayoutAside extends IceLayoutAside {}
export class LayoutContent extends IceLayoutContent {}
export class LayoutHeader extends IceLayoutHeader {}
export class LayoutFooter extends IceLayoutFooter {}
export class AsideTrigger extends IceAsideTrigger {}
export class Scrollbar extends IceScrollbar {}
export class SvgIcon extends IceSvgIcon {}
export class LogoPanel extends IceLogoPanel {}
export class SplitPanes extends IceSplitPanes {}
export class AsideMenu extends IceAsideMenu {}
export class RouterTabs extends IceTabsView {}
