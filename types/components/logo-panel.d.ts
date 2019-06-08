import { VNode } from 'vue'
import { IceComponent } from '../component'

export interface BasicLayoutSlots {
  /**
   * logo 插槽
   */
  logo?: VNode[]

  /**
   * 系统名称 插槽
   */
  title?: VNode[]

  [key: string]: VNode[]
}

export declare class IceLogoPanel extends IceComponent {
  $slots: BasicLayoutSlots

  /**
   * 图片地址（本地图片时，请使用logo插槽，并通过img标签导入图片）
   */
  src: string

  /**
   * 系统名称
   */
  title: string

  /**
   * 点击时切换至指定的路由路径。默认切换至根路由。
   */
  route: boolean | string | object
}
