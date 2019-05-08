import { CreateElement, VNode, Component } from 'vue'
import { RouteRecord } from 'vue-router'
import { Tabs, TabPane } from 'element-ui'

type LabelPropHandler = (
  createElement: CreateElement,
  route: RouteRecord,
  component: Component
) => VNode

type PropsHandler = (route: RouteRecord, component: Component) => object

export declare class IceRouterTabs extends Tabs {
  /**
   * 标签属性
   */
  labelProp?: string | LabelPropHandler

  /**
   * 面板样式名
   */
  tabPaneClass?: string | string[] | object | PropsHandler

  /**
   * 面板属性
   */
  tabPaneProps?: TabPane | object | PropsHandler

  /**
   * keep-alive 组件属性
   */
  keepAliveProps?: object | PropsHandler
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
