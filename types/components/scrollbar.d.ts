import { IceComponent } from '../component'

export declare class IceScrollbar extends IceComponent {
  /**
   * 声明滚动元素的容器尺寸不会改变，可提升性能
   */
  noresize: boolean

  /**
   * 滚动容器样式名
   */
  wrapClass: string

  /**
   * 内容容器样式名
   */
  viewClass: string

  overflowX: 'hidden' | 'visible' | 'auto'
  overflowY: 'hidden' | 'visible' | 'auto'
}
