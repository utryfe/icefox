<template>
  <element-menu
    ref="menu"
    :class="menuClassName"
    :router="router"
    :collapse="menuCollapsed"
    :popper-class="popperClassName"
    :collapse-transition="false"
    :unique-opened="uniqueOpened"
    :default-active="currentActive"
    mode="vertical"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </element-menu>
</template>

<script>
import ElementMenu from '../Menu/ElementMenu'
import { escapeRegExp } from '../../utils/mixed'
import { mergeClass } from '../../utils/vnode'
import {
  isRouteCaseSensitive,
  isSameRoute,
  trimPathTrailingSlash,
} from '../../utils/route'

export default {
  name: 'IceAsideMenu',
  inheritAttrs: false,
  components: { ElementMenu },
  props: {
    /**
     * 是否开启路由模式
     */
    router: Boolean,

    /**
     * 是否已折叠（.sync）
     */
    collapse: Boolean,

    /**
     * 菜单折叠时弹出层的样式
     */
    popperClass: [String, Array, Object],

    /**
     * 默认激活的菜单项index（ID）
     */
    defaultActive: [String, Number],

    /**
     * 是否应用折叠动效
     */
    collapseTransition: {
      type: Boolean,
      default: true,
    },

    /**
     * 单一展开模式
     */
    uniqueOpened: {
      type: Boolean,
      default: true,
    },

    /**
     * 启用路由模式时，当无法精确匹配到当前激活路由的路径时，是否执行子路由路径匹配
     */
    matchSubRoute: {
      type: Boolean,
      default: true,
    },
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  data() {
    return {
      menuCollapsed: !!this.collapse,
      currentActive: '',
    }
  },

  computed: {
    menuClassName() {
      const { menuCollapsed, collapseTransition } = this
      return [
        'ice-aside-menu',
        {
          'ice-collapsed': menuCollapsed,
          'ice-transition-none': !collapseTransition,
        },
      ]
    },

    popperClassName() {
      const { popperClass, collapseTransition } = this
      return mergeClass(popperClass, 'ice-aside-menu-popper', {
        'ice-transition-none': !collapseTransition,
      })
    },
  },

  watch: {
    $route: 'refreshActiveIndex',

    collapse(collapsed) {
      this.menuCollapsed = !!collapsed
    },

    menuCollapsed(collapsed) {
      this.$emit('update:collapse', collapsed)
      const { $basicLayout } = this
      if ($basicLayout) {
        $basicLayout.$emit('aside-state-change', { collapsed })
      }
    },
  },

  created() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$on('aside-state-change', this.updateCollapse)
    }
  },

  beforeDestroy() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$off('aside-state-change', this.updateCollapse)
    }
  },

  mounted() {
    this.refreshActiveIndex()
  },

  methods: {
    refreshActiveIndex() {
      const { defaultActive, router, $route } = this
      let activeIndex
      if (router && $route !== null && typeof $route === 'object') {
        activeIndex = this.getActiveIndexByRoute($route)
      }
      if (!activeIndex) {
        activeIndex = defaultActive
      }

      if (['string', 'number'].includes(typeof activeIndex)) {
        activeIndex = `${activeIndex}`
      } else {
        activeIndex = ''
      }

      this.currentActive = activeIndex
    },

    updateCollapse(state) {
      const { collapsed } = Object.assign({}, state)
      if (typeof collapsed === 'boolean') {
        this.menuCollapsed = collapsed
      }
    },

    getActiveIndexByRoute({ path }) {
      const { menu } = this.$refs
      if (!menu) {
        return ''
      }

      const menuItemsStore = menu.getMenuItemsStore()
      if (!menuItemsStore) {
        return ''
      }
      const menuRoutes = Object.entries(menuItemsStore)

      // 精确匹配激活路由路径
      let activeIndex = this.getMatchedRouteIndex(menuRoutes, isSameRoute, path)

      if (!activeIndex && this.matchSubRoute) {
        // 匹配激活子路由路径
        activeIndex = this.getMatchedRouteIndex(menuRoutes, (routePath) => {
          const reg = new RegExp(
            `^${escapeRegExp(trimPathTrailingSlash(routePath))}(?:/[^/]+?)+(?:/(?=$))?$`,
            isRouteCaseSensitive() ? '' : 'i'
          )
          return reg.test(path)
        })
      }

      return activeIndex
    },

    getMatchedRouteIndex(routes, matcher, currentPath) {
      // 精确匹配激活路由路径
      const routeTypes = ['string', 'object']
      for (const [path, { route }] of routes) {
        let type
        let routePath
        if (route && routeTypes.includes((type = typeof route))) {
          if (type === 'string') {
            routePath = route
          } else if (typeof route.path === 'string') {
            routePath = route.path
          }
        }
        if (!routePath) {
          routePath = path
        }
        if (!routePath.startsWith('/')) {
          routePath = `/${routePath}`
        }
        if (matcher(routePath, currentPath)) {
          return path
        }
      }
      return ''
    },
  },
}
</script>

<style lang="less">
@import '../../theme/var.less';

.ice-aside-menu,
.ice-aside-menu-popper {
  &,
  & * {
    user-select: none;
  }

  &::-webkit-scrollbar {
    width: 0;
  }
}

.ice-aside-menu {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 0;

  .ice-menu-icon {
    font-size: @aside-menu-icon-font-size;
  }

  .ice-menu-item-title {
    opacity: 1;
    transition: opacity 0.4s ease-in-out;
  }

  .el-menu-item {
    cursor: pointer;
  }
}

.ice-aside-menu.el-menu,
.ice-aside-menu-popper {
  &.ice-transition-none {
    transition: none;
    animation: none;
    .el-menu--inline {
      transition: none;
      animation: none;
    }
  }
}

.ice-aside-menu.el-menu {
  .el-menu-item {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 3px;
      z-index: 1;
      opacity: 0;
      transform: scaleY(0.0001);
      transition: transform 0.15s ease-out, opacity 0.15s ease-out;
      background-color: @aside-menu-item-indicator-color;
    }

    &.is-active:after {
      opacity: 1;
      transform: scaleY(1);
    }
  }
}

.ice-aside-menu.el-menu.ice-collapsed,
.ice-aside-menu-popper .el-menu {
  .el-menu-item {
    &,
    &.is-active {
      &:after {
        display: none;
      }
    }
  }
}

.ice-aside-menu-popper {
  .el-menu--popup-right-start {
    margin-left: @aside-menu-popper-margin;
    margin-right: @aside-menu-popper-margin;
  }
}

.ice-aside-menu.el-menu,
.ice-aside-menu-popper .el-menu {
  .el-menu-item,
  .el-submenu__title {
    i {
      color: inherit;
    }

    &:hover {
      background-color: @aside-menu-item-hover-background-color;
      color: @aside-menu-item-hover-color;
    }
  }
  .el-menu-item,
  .el-menu-item-group .el-menu-item {
    &.is-active {
      background-color: @aside-menu-item-selected-background-color;
      color: @aside-menu-item-selected-color;
    }
  }
}

.ice-aside-menu.el-menu.ice-collapsed {
  & > .el-menu-item,
  & > .el-menu-item-group > ul > .el-menu-item {
    &.is-active {
      background-color: @aside-menu-item-selected-background-color;
      color: @aside-menu-item-selected-color;
    }
  }
}

.ice-aside-menu.el-menu.ice-collapsed > .el-submenu,
.ice-aside-menu-popper .el-menu .el-submenu {
  &.is-opened,
  &.is-active {
    & > .el-submenu__title {
      color: @aside-menu-item-selected-color;
    }
  }

  &.is-active {
    & > .el-submenu__title {
      &,
      &:hover {
        background-color: @aside-menu-item-selected-background-color;
      }
    }
  }
}

.ice-aside-menu.el-menu,
.ice-aside-menu-popper .el-menu {
  &,
  .el-submenu,
  .el-menu--popup {
    background-color: @aside-menu-background-color;
    border-top: 1px solid @aside-menu-background-color;
    border-bottom: 1px solid @aside-menu-background-color;
    border-right: none;
    border-left: none;
    box-sizing: border-box;

    .el-menu--inline {
      background-color: @aside-sub-menu-background-color;
    }
  }

  .el-submenu__icon-arrow {
    color: @aside-menu-item-color;
    font-weight: bold;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  .el-menu-item,
  .el-submenu__title {
    color: @aside-menu-item-color;
    height: @aside-menu-item-height;
    line-height: @aside-menu-item-height;
    margin: 8px 0;
    background-color: transparent;
  }

  .el-submenu .el-menu-item {
    margin: 4px 0 8px;
    height: @aside-menu-item-height;
    line-height: @aside-menu-item-height;
  }

  .el-menu-item,
  .el-submenu__title,
  .el-menu-item-group__title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .el-menu-item-group {
    &:first-child {
      & > .el-menu-item-group__title {
        padding-top: 12px;
      }
    }
  }

  .el-submenu__title {
    padding-right: 50px;
  }

  .el-menu-item,
  .el-menu-item-group > .el-menu-item-group__title {
    padding-right: 20px;
  }

  &.ice-collapsed {
    width: 100%;

    & > .el-menu-item-group > .el-menu-item-group__title {
      display: none;
    }

    & > .el-submenu > .el-submenu__title > .el-submenu__icon-arrow {
      opacity: 0;
    }

    & > .el-menu-item,
    & > .el-menu-item > .el-tooltip,
    & > .el-menu-item-group > ul > .el-menu-item,
    & > .el-submenu > .el-submenu__title {
      padding: 0 !important;
      text-align: center;

      & > .ice-menu-item-title {
        opacity: 0;
      }

      & > .el-submenu > .el-menu--inline {
        display: none;
      }

      .ice-menu-icon,
      [class^='el-icon-'] {
        margin: 0;
      }
    }
  }
}
</style>
