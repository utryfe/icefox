<script>
class IceMenu {
  name = 'IceMenu'

  /**
   *  标记为函数式组件
   */
  functional = true

  props = {
    /**
     * 菜单项显示名称属性名（render）
     */
    titleProp: {
      type: [String, Function],
      default: 'title',
    },

    /**
     * 分组名属性名（render）
     */
    groupTitleProp: {
      type: [String, Function],
      default: 'groupTitle',
    },

    /**
     * 子菜单属性名
     */
    childrenProp: {
      type: [String, Function],
      default: 'children',
    },

    /**
     * 主键属性名（key）
     */
    indexProp: {
      type: [String, Function],
      default: 'id',
    },

    /**
     * 菜单项被禁用属性名
     */
    disabledProp: {
      type: [String, Function],
      default: 'disabled',
    },

    /**
     * 路由项属性名
     */
    routeProp: {
      type: [String, Function],
      default: 'route',
    },

    /**
     * 图标项属性名
     */
    iconProp: {
      type: [String, Function],
      default: 'icon',
    },

    /**
     * 图标样式库名称
     */
    iconLibName: {
      type: String,
      default: 'iconfont',
    },

    /**
     * 获取菜单项的属性（优先级更高）
     */
    getMenuItemProps: {
      type: Function,
      default: null,
    },

    /**
     * 获取子菜单属性（优先级更高）
     */
    getSubMenuProps: {
      type: Function,
      default: null,
    },

    /**
     * 弹出菜单层的样式名
     */
    popperClass: {
      type: String,
      default: '',
    },

    /**
     * 菜单树数据（数组）
     */
    menuItems: {
      type: Array,
      default: () => [],
    },
  }

  render = (createElement, context) => {
    const { children, props, data } = Object.assign({}, context)
    this.createElement = createElement
    this.runtimeProps = Object.assign({}, props)
    this.menuItems = this.runtimeProps.menuItems

    const subMenu =
      !Array.isArray(children) || !children.length
        ? this.createMenu(this.menuItems)
        : children

    this.clearAttrs(data)

    return createElement('el-menu', data, subMenu)
  }

  createMenu(items) {
    if (!Array.isArray(items)) {
      return []
    }
    const menu = []

    for (const item of items) {
      if (item === null || typeof item !== 'object') {
        continue
      }

      let title

      let groupTitle = this.getPropValue('groupTitle', item, items)

      if (groupTitle === '' || groupTitle === null || !this.isValidVNode(groupTitle)) {
        groupTitle = ''

        title = this.getPropValue('title', item, items)

        if (!this.isValidVNode(title)) {
          title = ''
        }
      }

      let children = this.getPropValue('children', item, items)
      if (Array.isArray(children)) {
        children = children.filter((item) => item !== null && typeof item === 'object')
      } else {
        children = []
      }

      if (!children.length) {
        menu.push(this.createMenuItem(title, item, items))
        continue
      }

      if (groupTitle) {
        menu.push(this.createMenuGroup(groupTitle, item, children, items))
        continue
      }

      menu.push(this.createSubMenu(title, item, children, items))
    }

    return menu
  }

  createMenuItem(title, item, items) {
    const { createElement, runtimeProps, menuItems } = this
    const { getMenuItemProps } = runtimeProps
    const itemProps = this.getPropValue(['index', 'disabled', 'route'], item, items)
    if (typeof getMenuItemProps === 'function') {
      Object.assign(itemProps, getMenuItemProps(item, items, menuItems))
    }

    return createElement('el-menu-item', { class: 'ice-menu-item', props: itemProps }, [
      ...this.createIcon(item, items),
      createElement(
        'span',
        { class: 'ice-menu-item-title' },
        IceMenu.getVNodeChildren(title)
      ),
    ])
  }

  createMenuGroup(groupTitle, item, children, items) {
    const { createElement } = this
    const menuGroup = this.createMenu(children)
    return createElement('el-menu-item-group', [
      this.createSlotElement('title', groupTitle, item, items),
      ...menuGroup,
    ])
  }

  createSubMenu(title, item, children, items) {
    const { createElement, runtimeProps, menuItems } = this
    const subMenu = this.createMenu(children)
    const { getSubMenuProps, popperClass } = runtimeProps
    const subMenuItemProps = this.getPropValue(['index', 'disabled'], item, items)
    if (typeof getSubMenuProps === 'function') {
      Object.assign(subMenuItemProps, getSubMenuProps(item, items, menuItems))
    }
    return createElement(
      'el-submenu',
      { props: Object.assign({ popperClass }, subMenuItemProps) },
      [this.createSlotElement('title', title, item, items), ...subMenu]
    )
  }

  createIcon(item, items) {
    const {
      createElement,
      runtimeProps: { iconLibName },
    } = this
    const icon = []
    let iconName = this.getPropValue('icon', item, items)
    if (Array.isArray(iconName) && !iconName.some((name) => typeof name !== 'string')) {
      iconName = iconName.join(' ')
    }
    if (typeof iconName === 'string') {
      const iconClass = ['ice-menu-icon', iconName]
      if (typeof iconLibName === 'string') {
        iconClass.unshift(iconLibName)
      }
      icon.push(
        createElement('i', {
          class: iconClass,
        })
      )
    } else if (typeof iconName === 'object') {
      icon.push(iconName)
    }

    return icon
  }

  createSlotElement(slot, elements, item, items) {
    const { createElement } = this
    const isTitle = slot === 'title'
    const children = IceMenu.getVNodeChildren(elements)
    return createElement('template', { slot }, [
      ...(isTitle ? this.createIcon(item, items) : []),
      isTitle
        ? createElement('span', { class: 'ice-menu-item-title' }, children)
        : children,
    ])
  }

  getPropValue(name, item, items) {
    const { runtimeProps, menuItems, createElement } = this
    if (Array.isArray(name)) {
      return name.reduce((propValues, prop) => {
        propValues[prop] = this.getPropValue(prop, item, items)
        return propValues
      }, {})
    }

    const propName = runtimeProps[`${name}Prop`]

    let value
    if (typeof propName === 'function') {
      const args = [item, [...items], [...menuItems]]
      if (['title', 'groupTitle', 'icon'].includes(name)) {
        args.unshift(createElement)
      }
      value = propName(...args)
    } else {
      value = item[propName]
    }

    if (name === 'index' && typeof value === 'number') {
      value = `${value}`
    }

    return value
  }

  isValidVNode(node) {
    const type = typeof node

    if (node === null || type === 'string' || type === 'number' || type === 'object') {
      return true
    }

    if (Array.isArray(node)) {
      return !node.some((item) => !this.isValidVNode(item))
    }

    return false
  }

  clearAttrs(data) {
    const { attrs } = Object.assign({}, data)
    if (attrs !== null && typeof attrs === 'object') {
      const attachedProps = this.props
      for (const prop of Object.keys(attachedProps)) {
        delete attrs[prop]
        delete attrs[
          prop.replace(/-?([A-Z]+)/g, ($0, $1, index) =>
            (!index ? $1 : `-${$1}`).toLowerCase()
          )
        ]
      }
    }
  }

  static getVNodeChildren(node) {
    if (node === null) {
      node = ''
    } else if (typeof node === 'number') {
      node = `${node}`
    }
    if (typeof node === 'string') {
      node = [node]
    }
    if (!Array.isArray(node)) {
      node = [node]
    }
    return node
  }
}

export default new IceMenu()
</script>

<style lang="less">
.ice-menu-icon {
  margin-right: 5px;
}
</style>
