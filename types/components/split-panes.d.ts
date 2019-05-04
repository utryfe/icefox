import { IceComponent } from '../component'

export declare class IceSplitPanes extends IceComponent {
  horizontal?: boolean

  disabled?: boolean

  minSize?: string | number

  maxSize?: string | number

  initialSize?: string | number

  throttle?: number

  dblClickReset?: boolean

  forceSizing?: boolean
}
