<script>
import { Menu, MenuItem, MenuItemGroup, Submenu } from 'element-ui'
import { getVNodeChildren, mergeClass, toCamelCaseProps } from '../../utils/vnode'
import SvgIcon from '../SvgIcon'

export default {
  name: 'IceMenu',
  props: {
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
     * 图标类型（font 或 svg）
     */
    iconType: {
      type: String,
      default: 'font',
    },

    /**
     * 获取菜单项的属性（优先级更高）
     */
    menuItemProps: {
      type: [Object, Function],
      default: null,
    },

    /**
     * 获取子菜单属性（优先级更高）
     */
    subMenuProps: {
      type: [Object, Function],
      default: null,
    },

    /**
     * 弹出菜单层的样式名，也适用于手动定义的内容菜单组件
     */
    popperClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * 菜单树数据（数组）
     */
    menuItems: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // 标记为非响应式数据
      $menuItemsStore: null,
    }
  },

  render() {
    const { menuItems, $createElement, $slots, $attrs, $listeners } = this
    const defaultSlots = $slots.default
    const hasDefaultSlots = defaultSlots && defaultSlots.length
    this.$menuItemsStore = {}

    if (hasDefaultSlots) {
      this.injectMenuClass(defaultSlots)
    }

    // 定义Menu组件
    return $createElement(
      Menu,
      {
        attrs: $attrs,
        on: $listeners,
      },
      hasDefaultSlots ? defaultSlots : this.createMenu(menuItems)
    )
  },

  methods: {
    getMenuItemsStore() {
      const { $menuItemsStore } = this
      return $menuItemsStore ? { ...$menuItemsStore } : null
    },

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
    },

    createMenuItem(title, item, items) {
      const { $createElement, menuItems, menuItemProps, $menuItemsStore } = this

      const itemProps = Object.assign(
        this.getPropValue(['index', 'disabled', 'route'], item, items),
        toCamelCaseProps(
          typeof menuItemProps === 'function'
            ? menuItemProps(item, items, menuItems)
            : menuItemProps
        )
      )

      if ($menuItemsStore) {
        $menuItemsStore[itemProps.index] = { ...itemProps }
      }

      return $createElement(MenuItem, { class: 'ice-menu-item', props: itemProps }, [
        ...this.createIcon(item, items),
        $createElement(
          'span',
          { class: 'ice-menu-item-title', slot: 'title' },
          getVNodeChildren(title)
        ),
      ])
    },

    createMenuGroup(groupTitle, item, children, items) {
      const { $createElement } = this
      return $createElement(MenuItemGroup, { class: 'ice-menu-group' }, [
        this.createSlotElement('title', groupTitle, item, items),
        ...this.createMenu(children),
      ])
    },

    createSubMenu(title, item, children, items) {
      const { $createElement, menuItems, subMenuProps, popperClass } = this

      const subProps = this.getPropValue(['index', 'disabled'], item, items)
      const customProps = toCamelCaseProps(
        typeof subMenuProps === 'function'
          ? subMenuProps(item, items, menuItems)
          : subMenuProps
      )

      return $createElement(
        Submenu,
        {
          class: 'ice-menu-submenu',
          props: Object.assign(
            {
              showTimeout: 200,
              hideTimeout: 200,
            },
            subProps,
            customProps,
            {
              popperClass: mergeClass(popperClass, customProps.popperClass),
            }
          ),
        },
        [
          this.createSlotElement('title', title, item, items),
          ...this.createMenu(children),
        ]
      )
    },

    createIcon(item, items) {
      const { $createElement, iconLibName, iconType } = this
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
          $createElement(iconType === 'svg' ? SvgIcon : 'i', {
            class: iconClass,
            props: { name: iconName },
          })
        )
      } else if (iconName !== null && typeof iconName === 'object') {
        icon.push(iconName)
      }

      return icon
    },

    createSlotElement(slot, elements, item, items) {
      const { $createElement } = this
      const isTitle = slot === 'title'
      const children = getVNodeChildren(elements)

      return $createElement('template', { slot }, [
        ...(isTitle ? this.createIcon(item, items) : []),
        isTitle
          ? $createElement('span', { class: 'ice-menu-item-title' }, children)
          : children,
      ])
    },

    injectMenuClass(vNodes) {
      const { $menuItemsStore } = this
      for (const node of vNodes) {
        const { componentOptions, data } = node || {}
        const { tag, propsData, children } = componentOptions || {}
        if (/^(?:el-submenu|ElSubmenu)$/.test(tag)) {
          const { popperClass } = this
          componentOptions.propsData = Object.assign(propsData || {}, {
            popperClass: mergeClass(
              popperClass,
              propsData ? propsData['popperClass'] : ''
            ),
          })

          node.data = Object.assign(data || {}, {
            class: mergeClass('ice-menu-submenu', data ? data['class'] : ''),
          })

          if (Array.isArray(children)) {
            this.injectMenuClass(children)
          }
        } else if (/^(?:el-menu-item-group|ElMenuItemGroup)$/.test(tag)) {
          node.data = Object.assign(data || {}, {
            class: mergeClass('ice-menu-group', data ? data['class'] : ''),
          })

          if (Array.isArray(children)) {
            this.injectMenuClass(children)
          }
        } else if (/^(?:el-menu-item|ElMenuItem)$/.test(tag)) {
          node.data = Object.assign(data || {}, {
            class: mergeClass('ice-menu-item', data ? data['class'] : ''),
          })
          if (propsData) {
            $menuItemsStore[propsData['index']] = { route: propsData['route'] }
          }
        }
      }
    },

    getPropValue(name, item, items) {
      const { $createElement, menuItems } = this
      if (Array.isArray(name)) {
        return name.reduce((propValues, prop) => {
          propValues[prop] = this.getPropValue(prop, item, items)
          return propValues
        }, {})
      }

      const propName = this[`${name}Prop`]

      let value
      if (typeof propName === 'function') {
        const args = [item, [...items], [...menuItems]]
        if (['title', 'groupTitle', 'icon'].includes(name)) {
          args.unshift($createElement)
        }
        value = propName(...args)
      } else {
        value = item[propName]
      }

      if (name === 'index' && typeof value === 'number') {
        value = `${value}`
      }

      return value
    },

    isValidVNode(node) {
      const type = typeof node

      if (node === null || type === 'string' || type === 'number' || type === 'object') {
        return true
      }

      if (Array.isArray(node)) {
        return !node.some((item) => !this.isValidVNode(item))
      }

      return false
    },
  },
}
</script>

<style lang="less">
.ice-menu-icon {
  margin-right: 5px;
}
</style>
