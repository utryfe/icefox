import Vue from 'vue'
import { IceComponent } from './component'

// components
import { IceBasicLayout } from './components/basic-layout'
import { IceSplitPanes } from './components/split-panes'
import { IceAsideMenu, IceMenu } from './components/aside-menu'

// exports
export interface InstallationOptions {}
export function install(vue: typeof Vue, options: InstallationOptions): void
export type Component = IceComponent

// export components
//
// basic-layout
export class BasicLayout extends IceBasicLayout {}

// split-panes
export class SplitPanes extends IceSplitPanes {}

// aside-menu
export class AsideMenu extends IceAsideMenu {}
export { IceMenu }
