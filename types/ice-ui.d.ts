import Vue from 'vue'
import { IceComponent } from './component'

// components
import { IceBasicLayout } from './components/basic-layout'
import { IceSplitPanes } from './components/split-panes'

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
