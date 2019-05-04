import { IceComponent } from '../component'

type AsideSize = {
  min?: string | number
  max?: string | number
  default?: string | number
  collapsed?: string | number
}

export declare class IceBasicLayout extends IceComponent {
  resizable?: boolean

  collapsible?: boolean

  collapsed?: boolean

  asideSize?: AsideSize | string | number

  forceSizing?: boolean
}
