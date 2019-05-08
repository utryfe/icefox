import { IceComponent } from '../component'
import { VNode } from 'vue'

export interface BasicLayoutSlots {
  /**
   * logo 插槽
   */
  logo?: VNode[]

  /**
   * 系统名称 插槽
   */
  system?: VNode[]

  /**
   * 边栏内容 插槽
   */
  aside?: VNode[]

  /**
   * 顶部区域栏 插槽
   */
  header?: VNode[]

  [key: string]: VNode[]
}

export interface BasicLayoutListeners {
  /**
   * 折叠状态改变事件
   */
  'collapse-change'?: Function | Function[]
  /**
   * 边栏顶部被点击事件
   */
  'aside-header-click'?: Function | Function[]
  /**
   * 面板尺寸变更事件
   */
  resize?: Function | Function[]

  [key: string]: Function | Function[]
}

type AsideSize = {
  /**
   * 最小尺寸
   */
  min?: string | number

  /**
   * 最大尺寸
   */
  max?: string | number

  /**
   * 默认尺寸
   */
  default?: string | number

  /**
   * 折叠后的尺寸
   */
  collapsed?: string | number
}

export declare class IceBasicLayout extends IceComponent {
  $slots: BasicLayoutSlots

  $listeners: BasicLayoutListeners

  /**
   * 是否可以手动调节布局尺寸
   */
  resizable?: boolean

  /**
   * 是否可以折叠边栏
   */
  collapsible?: boolean

  /**
   * 当前是否已经折叠，支持 .sync 修饰符
   */
  collapsed?: boolean

  /**
   * 边栏尺寸
   */
  asideSize?: AsideSize | string | number

  /**
   * 是否强制同步设置面板内容尺寸
   */
  forceSizing?: boolean

  /**
   * 是否启用折叠动效
   */
  collapseTransition?: boolean

  /**
   * 是否显示边栏
   */
  showAside?: boolean

  /**
   * 是否显示边栏头部
   */
  showAsideHeader?: boolean

  /**
   * 是否显示页面头部
   */
  showMainHeader?: boolean
}
