import { IceComponent } from '../component'

export declare class IceSplitPanes extends IceComponent {
  /**
   * 使用水平分割
   */
  horizontal?: boolean

  /**
   * 可手动调节分割区域尺寸
   */
  resizable?: boolean

  /**
   * 显示分割线
   */
  showSplitLine?: boolean

  /**
   * 最小尺寸（生效slot位置：left、top）
   */
  minSize?: string | number

  /**
   * 最大尺寸（生效slot位置：left、top）
   */
  maxSize?: string | number

  /**
   * 初始化尺寸（生效slot位置：left、top）
   */
  initialSize?: string | number

  /**
   * resize 事件的触发阈值
   */
  throttle?: number

  /**
   * 双击分割线，重置面板尺寸
   */
  dblClickReset?: boolean

  /**
   * 强制同步设置面板内容元素尺寸
   */
  forceSizing?: boolean
}
