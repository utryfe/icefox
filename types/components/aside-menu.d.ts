import { CreateElement, VNode } from 'vue'
import { Menu } from 'element-ui'

type MenuItem = {
  title?: string
  id?: string
  children?: MenuItem[]
  [prop: string]: any
}

type TitleRender = (
  createElement: CreateElement,
  item: MenuItem,
  siblings: MenuItem[],
  menuItems: MenuItem[]
) => string | number | VNode | VNode[]

type IconRender = TitleRender

type PropHandler = (item: MenuItem, siblings: MenuItem[], menuItems: MenuItem[]) => any

type MenuItemPropsHandler = (
  item: MenuItem,
  siblings: MenuItem[],
  menuItems: MenuItem[]
) => object

type SubMenuPropsHandler = (
  item: MenuItem,
  siblings: MenuItem[],
  menuItems: MenuItem[]
) => object

export declare class IceMenu extends Menu {
  /**
   * 菜单项显示名称属性名（render）
   */
  titleProp?: 'title' | string | TitleRender

  /**
   * 分组名属性名（render）
   */
  groupTitleProp?: 'groupTitle' | string | TitleRender

  /**
   * 子菜单属性名
   */
  childrenProp?: 'children' | string | PropHandler

  /**
   * 主键属性名（key）
   */
  indexProp?: 'id' | string | PropHandler

  /**
   * 菜单项被禁用属性名
   */
  disabledProp?: 'disabled' | string | PropHandler

  /**
   * 路由项属性名
   */
  routeProp?: 'route' | string | PropHandler

  /**
   * 图标项属性名
   */
  iconProp?: 'icon' | string | IconRender

  /**
   * 图标库样式名
   */
  iconLibName?: 'iconfont' | string

  /**
   * 获取菜单项的属性（优先级更高）
   */
  getMenuItemProps?: MenuItemPropsHandler

  /**
   * 获取子菜单属性（优先级更高）
   */
  getSubMenuProps?: SubMenuPropsHandler

  /**
   * 子菜单浮层的样式名
   */
  popperClass?: string

  /**
   * 折叠展开子菜单是否使用动效过渡
   */
  collapseTransition: boolean

  /**
   * 菜单树数据（数组）
   */
  menuItems?: MenuItem[]
}

export declare class IceAsideMenu extends IceMenu {}
