import { CreateElement, VNode } from 'vue'
import { Menu } from 'element-ui'

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

export declare class IceMenu extends Menu {
  /**
   * 折叠展开子菜单是否使用动效过渡
   */
  collapseTransition: boolean

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
   * 菜单树数据（数组）
   */
  menuItems?: MenuItem[]
}

export declare class IceAsideMenu extends IceMenu {}
