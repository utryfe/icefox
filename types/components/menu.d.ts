import { CreateElement, VNode } from 'vue'
import { Menu as ElementMenu } from 'element-ui'

/**
 * 菜单项定义
 */
type MenuItem = {
  /**
   * 菜单项标题
   */
  title?: string

  /**
   * 菜单项ID，路由模式时，作为路由路径使用
   */
  id?: string

  /**
   * 子菜单数组
   */
  children?: MenuItem[]

  /**
   * 其他属性
   */
  [prop: string]: any
}

/**
 * 自定义菜单项标题渲染函数
 */
type TitleRender = (
  // 创建VNode元素的工具函数
  createElement: CreateElement,

  // 当前菜单项
  item: MenuItem,

  // 当前层级的节点数组
  siblings: MenuItem[],

  // 当前菜单树
  menuItems: MenuItem[]
) => VNode | VNode[] | string | number

/**
 * 图标渲染函数
 */
type IconRender = TitleRender

/**
 * 属性渲染函数
 */
type PropHandler = (item: MenuItem, siblings: MenuItem[], menuItems: MenuItem[]) => any

/**
 * 菜单项属性获取函数
 */
type MenuItemPropsHandler = (
  item: MenuItem,
  siblings: MenuItem[],
  menuItems: MenuItem[]
) => object

/**
 * 子菜单属性获取函数
 */
type SubMenuPropsHandler = (
  item: MenuItem,
  siblings: MenuItem[],
  menuItems: MenuItem[]
) => object

export declare class Menu extends ElementMenu {
  /**
   * 菜单项显示名称属性名（render）
   */
  titleProp?: TitleRender | 'title' | string

  /**
   * 分组名属性名（render）
   */
  groupTitleProp?: TitleRender | 'groupTitle' | string

  /**
   * 子菜单属性名
   */
  childrenProp?: PropHandler | 'children' | string

  /**
   * 主键属性名（key）
   */
  indexProp?: PropHandler | 'id' | string

  /**
   * 菜单项被禁用属性名
   */
  disabledProp?: PropHandler | 'disabled' | string

  /**
   * 路由项属性名
   */
  routeProp?: PropHandler | 'route' | string

  /**
   * 图标项属性名
   */
  iconProp?: IconRender | 'icon' | string

  /**
   * 图标库样式名
   */
  iconLibName?: 'iconfont' | string

  /**
   * 图标类型，font为字体图标，svg为svg格式图标
   */
  iconType?: 'font' | 'svg'

  /**
   * 获取菜单项的属性（优先级更高）
   */
  menuItemProps?: MenuItemPropsHandler | object

  /**
   * 获取子菜单属性（优先级更高）
   */
  subMenuProps?: SubMenuPropsHandler | object

  /**
   * 子菜单浮层的样式名
   */
  popperClass?: string | string[] | object

  /**
   * 菜单树数据（数组）
   */
  menuItems?: MenuItem[]
}

export declare class IceMenu extends Menu {
  /**
   * 折叠展开子菜单是否使用动效过渡
   */
  collapseTransition: boolean
}

export declare class IceAsideMenu extends IceMenu {}
