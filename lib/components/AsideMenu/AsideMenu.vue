<template>
  <element-menu
    :class="className"
    v-on="$listeners"
    v-bind="$attrs"
    :collapse="collapse"
    :popper-class="popperClassName"
    :collapse-transition="false"
    mode="vertical"
  >
    <slot />
  </element-menu>
</template>

<script>
import ElementMenu from './ElementMenu'

export default {
  name: 'IceAsideMenu',
  inheritAttrs: false,
  components: { ElementMenu },
  props: {
    getSubMenuProps: Function,
    collapse: Boolean,
    popperClass: String,
    collapseTransition: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    className() {
      const { collapse, collapseTransition } = this
      return [
        'ice-aside-menu',
        {
          'aside-collapsed': collapse,
          'ice-collapse-transition-none': !collapseTransition,
        },
      ]
    },
    popperClassName() {
      const { popperClass, collapseTransition } = this
      const className = ['ice-aside-menu-popper']
      if (popperClass && typeof popperClass === 'string') {
        className.push(popperClass)
      }
      if (!collapseTransition) {
        className.push('ice-collapse-transition-none')
      }
      return className.join(' ')
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
}

.ice-aside-menu.el-menu,
.ice-aside-menu-popper {
  &.ice-collapse-transition-none {
    transition: none;
    animation: none;
    .el-menu--inline {
      transition: none;
      animation: none;
    }
  }
}

.ice-aside-menu.el-menu {
  .ice-menu-item {
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

.ice-aside-menu.el-menu.aside-collapsed,
.ice-aside-menu-popper .el-menu {
  .ice-menu-item {
    &,
    &.is-active {
      &:after {
        display: none;
      }
    }
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

.ice-aside-menu.el-menu.aside-collapsed {
  & > .el-menu-item,
  & > .el-menu-item-group > ul > .el-menu-item {
    &.is-active {
      background-color: @aside-menu-item-selected-background-color;
      color: @aside-menu-item-selected-color;
    }
  }
}

.ice-aside-menu.el-menu.aside-collapsed > .el-submenu,
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

  & > .el-menu-item,
  .el-submenu > .el-menu-item,
  .el-menu-item-group > .el-menu-item-group__title {
    padding-right: 20px;
  }

  &.aside-collapsed {
    width: 100%;

    & > .el-menu-item-group > .el-menu-item-group__title {
      display: none;
    }

    & > .el-submenu > .el-submenu__title > .el-submenu__icon-arrow {
      opacity: 0;
    }

    & > .el-menu-item,
    & > .el-menu-item-group > ul > .el-menu-item,
    & > .el-submenu > .el-submenu__title {
      padding: 0 !important;
      text-align: center;

      & > .ice-menu-icon,
      & > [class^='el-icon-'] {
        margin: 0;
      }

      & > .ice-menu-item-title {
        opacity: 0;
      }
    }

    & > .el-submenu > .el-menu--inline {
      display: none;
    }
  }
}
</style>
