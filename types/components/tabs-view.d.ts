import { CreateElement, VNode, Component } from 'vue'
import { RouteRecord } from 'vue-router'
import { Tabs, TabPane } from 'element-ui'

type LabelPropHandler = (
  createElement: CreateElement,
  route: RouteRecord,
  component: Component
) => VNode

type PropsHandler = (route: RouteRecord, component: Component) => object

export declare class IceTabsView extends Tabs {
  $listeners: {
    /**
     * 路由视图状态改变时的回调
     */
    change?: Function | Function[]

    /**
     * 路由组件进入时的回调（过渡结束后触发）
     */
    'after-route-enter'?: Function | Function[]

    /**
     * 路由组件离开后的回调（过渡结束后触发）
     */
    'after-route-leave'?: Function | Function[]
  }

  /**
   * 标签属性
   */
  labelProp?: string | LabelPropHandler

  /**
   * 面板样式名
   */
  viewClass?: string | string[] | object | PropsHandler

  /**
   * 面板属性
   */
  tabPaneProps?: TabPane | object | PropsHandler

  /**
   * 最小保留的页签数。达到最小个数时页签将不可被关闭。
   */
  minTabsCount?: number

  /**
   * 是否保留未激活路由组件的状态。默认为true。
   */
  keepAlive?: boolean

  /**
   * keep-alive 组件属性
   */
  keepAliveProps?: object | PropsHandler

  /**
   * 路由组件切换时，是否启用过渡动效。默认不开启。
   * 使用字符串格式参数时，可自定义动效样式名。
   */
  transition?: boolean | string
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * 获取当前已激活的视图路径
     */
    readonly $activeView?: string

    /**
     * 获取当前已缓存的视图列表
     */
    readonly $cachedViews?: RouteRecord[]

    /**
     * 根据路径名称，清除被缓存的视图
     */
    readonly $removeCachedView?: (path: string) => void
  }
}
