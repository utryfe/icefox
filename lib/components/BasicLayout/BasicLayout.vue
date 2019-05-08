<template>
  <split-panes
    :class="className"
    :resizable="resizable && showAside && !asideCollapsed"
    :show-split-line="showAside"
    :min-size="splitSize.min"
    :max-size="splitSize.max"
    :initial-size="splitSize.default"
    :force-sizing="forceSizing"
    @resize="handleResize"
  >
    <transition
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
      slot="left"
    >
      <div class="aside-pane" v-show="showAside">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div
            class="collapse-trigger"
            v-if="collapsible"
            :title="asideCollapsed ? '展开' : '收起'"
            @click="asideCollapsed = !asideCollapsed"
          >
            <i :class="triggerIconClass"></i>
          </div>
        </transition>

        <div
          class="aside-header"
          v-show="showAsideHeader"
          @click="handleAsideHeaderClick"
        >
          <div class="aside-header-logo">
            <slot name="logo" />
          </div>

          <transition
            enter-active-class="animated fadeInLeftLittle"
            leave-active-class="animated fadeOutLeftLittle"
          >
            <div class="aside-header-title" v-show="!asideCollapsed">
              <slot name="system" />
            </div>
          </transition>
        </div>

        <div class="aside-content">
          <slot name="aside" />
        </div>
      </div>
    </transition>

    <div class="body-pane" slot="right">
      <transition
        enter-active-class="animated slideInDown"
        leave-active-class="animated slideOutUp"
      >
        <div v-show="showMainHeader" class="main-header">
          <slot name="header" />
        </div>
      </transition>
      <slot />
    </div>
  </split-panes>
</template>

<script>
import SplitPanes from '../SplitPanes'

export default {
  name: 'IceBasicLayout',
  components: { SplitPanes },

  props: {
    /**
     * 是否可以手动调整边栏大小
     */
    resizable: {
      type: Boolean,
      default: true,
    },

    /**
     * 侧边栏是否可以折叠
     */
    collapsible: {
      type: Boolean,
      default: true,
    },

    /**
     *  侧边栏是否已折叠
     */
    collapsed: {
      type: Boolean,
      default: false,
    },

    /**
     * 侧边栏尺寸
     */
    asideSize: [Number, String, Object],

    /**
     * 是否强制设置面板宽高样式
     */
    forceSizing: Boolean,

    /**
     * 是否启用折叠动画
     */
    collapseTransition: {
      type: Boolean,
      default: true,
    },

    /**
     * 显示左侧边栏
     */
    showAside: {
      type: Boolean,
      default: true,
    },

    /**
     * 显示侧边栏头部
     */
    showAsideHeader: {
      type: Boolean,
      default: true,
    },

    /**
     * 显示顶部菜单栏
     */
    showMainHeader: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    const { collapsed } = this
    return {
      resizing: false,
      animationDisabled: true,
      asideCollapsed: !!collapsed,
    }
  },

  computed: {
    className() {
      const {
        showAside,
        showAsideHeader,
        showMainHeader,
        collapsible,
        asideCollapsed,
        collapseTransition,
        animationDisabled,
      } = this
      return [
        'basic-layout',
        {
          'layout-collapsible': collapsible && showAside,
          'layout-collapsed': asideCollapsed,
          'layout-aside-none': !showAside,
          'layout-main-header-none': !showMainHeader,
          'layout-collapse-transition-none': !collapseTransition,
          'layout-aside-header-none': !showAsideHeader,
          'layout-aside-animation-disabled': animationDisabled,
        },
      ]
    },

    triggerIconClass() {
      const { asideCollapsed } = this
      return [
        'iconfont',
        {
          'icon-collapse': !asideCollapsed,
          'icon-expand': asideCollapsed,
        },
      ]
    },

    splitSize() {
      const { showAside, asideSize, asideCollapsed } = this
      const argType = typeof asideSize
      const size = Object.assign(
        {
          min: '240px',
          max: '400px',
          default: '240px',
          collapsed: '60px',
        },
        argType === 'string' || argType === 'number' ? { default: asideSize } : asideSize
      )
      if (!showAside) {
        Object.assign(size, {
          min: 0,
          default: 0,
        })
      } else if (asideCollapsed) {
        Object.assign(size, {
          min: size.collapsed,
          default: size.collapsed,
        })
      }
      return size
    },
  },

  watch: {
    collapsed(val) {
      this.asideCollapsed = !!val
    },

    asideCollapsed(val) {
      this.animationDisabled = false
      this.$emit('update:collapsed', !!val)
      this.$emit('collapse-change', !!val)
    },
  },

  methods: {
    handleResize(...dimensions) {
      this.$emit('resize', ...dimensions)
    },
    handleAsideHeaderClick() {
      this.$emit('aside-header-click')
    },
  },
}
</script>

<style lang="less">
@import '../../theme/var.less';

html,
body {
  margin: 0;
  padding: 0;
  border: 0;
}

body {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  font-variant: tabular-nums;
  -webkit-tap-highlight-color: transparent;
}

.basic-layout {
  &.splitter-container-item {
    & > .splitter-handle-item {
      &:after {
        background-color: @layout-aside-splitter-vertical-color;
      }
    }
  }

  & > .splitter-pane-left > .aside-pane {
    & > .aside-header > .aside-header-logo {
      & > img {
        max-height: 61.8%;
      }
    }
  }

  &.layout-collapse-transition-none {
    & > .splitter-pane-left {
      transition: none;
      .aside-pane > .aside-content > .ice-aside-menu {
        transition: none;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/var.less';

/*******************************************/

.main-header {
  padding-right: 8px;
}

.aside-header {
  padding: 0 16px;
}

.aside-header-title {
  margin-left: 12px;
  color: @layout-aside-header-color;
}

/*******************************************/

.basic-layout {
  background-color: @layout-background-color;
  box-sizing: border-box;

  .aside-pane,
  .body-pane {
    height: 100%;
    min-height: 100vh;
    padding-top: @layout-header-height;
    box-sizing: border-box;
    position: relative;
  }

  .aside-pane {
    animation-duration: @layout-collapse-transition-duration;
  }

  &.layout-aside-none {
    .aside-pane {
      overflow: hidden;
    }
  }

  &.layout-aside-header-none {
    .aside-pane {
      padding-top: 0;
    }
  }

  &.layout-main-header-none {
    .body-pane {
      padding-top: 0;
    }
  }

  &.layout-collapsible .body-pane .main-header {
    padding-left: 80px;
  }

  &.layout-collapsed .aside-pane .aside-header {
    .aside-header-logo {
      animation: slideLogoToCenter @layout-collapse-transition-duration ease-in-out
        forwards calc(@layout-collapse-transition-duration - 0.1s);
      transition: none;
    }
  }

  &.layout-collapse-transition-none {
    transition: none;
    animation: none;

    .aside-pane,
    .body-pane {
      transition: none;
      animation: none;
    }

    .aside-pane .aside-header {
      .aside-header-logo {
        transition: none;
        animation-duration: 0s;
        animation-delay: 0s;
      }

      .aside-header-title {
        transition: none;
        animation: none;
      }
    }

    .body-pane {
      .main-header {
        transition: none;
        animation: none;
      }
    }
  }

  &.layout-aside-animation-disabled {
    .aside-pane .aside-header .aside-header-logo {
      animation: none;
    }
  }
}

.aside-pane {
  box-shadow: 2px 0 6px @layout-aside-box-shadow-color;
  animation-duration: @layout-collapse-transition-duration;
  z-index: 1;

  .collapse-trigger {
    font-size: 16px;
    position: absolute;
    z-index: 2;
    padding: 0 24px;
    height: @layout-header-height;
    line-height: @layout-header-height;
    vertical-align: middle;
    text-align: center;
    top: 0;
    right: 0;
    transform: translate3d(100%, 0, 0);
    cursor: pointer;
    animation-duration: 0.3s;
    transition: background-color 0.3s, color 0.1s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: rgba(0, 0, 0, 0.95);
    }
  }

  .aside-header {
    position: absolute;
    background-color: @layout-aside-header-background-color;
    box-shadow: 1px 1px 0 0 @layout-aside-header-border-color;
    height: @layout-header-height;
    box-sizing: border-box;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: hidden;

    .aside-header-logo {
      display: flex;
      flex: none;
      align-items: center;
      height: 100%;
      font-size: 0;
      position: relative;
      left: 0;
      top: 0;
      z-index: 1;
      animation: slideLogoToLeft calc(@layout-collapse-transition-duration + 0.3s)
        ease-out forwards;
    }

    .aside-header-title {
      animation-duration: 0.5s;
      overflow: hidden;
      white-space: nowrap;
      word-break: keep-all;
      flex: none;
    }
  }

  .aside-content {
    height: 100%;
    background-color: @layout-aside-background-color;
  }
}

.body-pane {
  z-index: 0;

  .main-header {
    box-sizing: border-box;
    width: 100%;
    padding-left: 24px;
    height: @layout-header-height;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    background: @layout-header-background-color;
    box-shadow: 0 1px 4px @layout-header-box-shadow-color;
    transition: padding-left 0.3s ease-out;
    animation-duration: 0.3s;
  }
}

.fadeInLeftLittle {
  animation-name: fadeInLeftLittle;
}

.fadeOutLeftLittle {
  animation-name: fadeOutLeftLittle;
}

@keyframes fadeInLeftLittle {
  from {
    opacity: 0;
    transform: translate3d(-24px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutLeftLittle {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(-24px, 0, 0);
  }
}

@keyframes slideLogoToCenter {
  from {
    position: absolute;
    left: 50%;
    margin-left: calc(-50% + 16px);
    transform: translate3d(0, 0, 0);
  }

  to {
    position: absolute;
    left: 50%;
    margin-left: 0;
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes slideLogoToLeft {
  from {
    position: relative;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }

  to {
    position: relative;
    left: 0;
    transform: translate3d(0, 0, 0);
  }
}
</style>
