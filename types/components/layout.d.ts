import { VNode } from 'vue'
import { IceComponent } from '../component'
import { IceSplitPanes } from './split-panes'

declare class BasicLayout {
  /**
   * 显示边栏
   */
  readonly showAside: () => void

  /**
   * 隐藏边栏
   */
  readonly hideAside: () => void

  /**
   * 折叠边栏
   */
  readonly collapseAside: () => void

  /**
   * 展开边栏
   */
  readonly expandAside: () => void

  /**
   * 显示页面顶栏
   */
  readonly showHeader: () => void

  /**
   * 隐藏页面顶栏
   */
  readonly hideHeader: () => void

  /**
   * 全屏
   */
  readonly requestFullScreen: () => void

  /**
   * 退出全屏
   */
  readonly exitFullscreen: () => void
}

export interface BasicLayoutListeners {
  /**
   * 边栏状态改变事件
   */
  'aside-state-change'?: Function | Function[]

  /**
   * 边栏尺寸改变事件
   */
  'aside-size-change'?: Function | Function[]

  /**
   * 页面顶栏状态改变事件
   */
  'header-state-change'?: Function | Function[]

  [key: string]: Function | Function[]
}

export declare class IceLayout extends IceSplitPanes {
  /**
   * 使用水平方向的布局
   */
  horizontal?: boolean

  /**
   * 分割区域（两部分）
   */
  split?: boolean
}

export declare class IceBasicLayout extends IceLayout {
  $listeners: BasicLayoutListeners
}

export declare class IceLayoutHeader extends IceComponent {
  /**
   * 是否使用fixed定位
   */
  fixed: boolean

  /**
   * 内容水平对齐方式
   */
  align: 'left' | 'center' | 'right'

  /**
   * 是否可见（.sync）
   */
  visible: boolean

  /**
   * fixed状态下有效。在fixed状态下，自动根据边栏宽度情况调节自身内容宽度。
   */
  justifyWidth: boolean

  /**
   * 是否应用动效
   */
  collapseTransition: boolean
}

export declare class IceLayoutAside extends IceComponent {
  $slots: {
    /**
     * 头部区域插槽
     */
    header: VNode[]

    /**
     * 折叠触发器插槽
     */
    trigger: VNode[]
  }

  /**
   * 是否可见（.sync）
   */
  visible: boolean

  /**
   * 是否固定定位（.sync）
   */
  fixed: boolean

  /**
   * 是否可折叠（启用时会显示trigger）
   */
  collapsible: boolean

  /**
   * 是否已经折叠（.sync）
   */
  collapsed: boolean

  /**
   * 折叠时的宽度
   */
  collapsedWidth: string | number

  /**
   * 折叠是否使用过渡效果
   */
  collapseTransition: boolean

  /**
   * 默认宽度
   */
  width: string | number

  /**
   * 最小宽度
   */
  minWidth: string | number

  /**
   * 最大宽度
   */
  maxWidth: string | number

  /**
   * fixed状态下有效。会检测是否存在页面布局header并在顶部减去header对应的高度。
   */
  justifyHeight: boolean
}

export declare class IceLayoutFooter extends IceComponent {}

export declare class IceLayoutContent extends IceComponent {
  /**
   * 是否应用内部滚动
   */
  scrollable: boolean
}

export declare class IceAsideTrigger extends IceComponent {
  /**
   * 是否可见（.sync）
   */
  visible: boolean
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $basicLayout?: BasicLayout
  }
}
