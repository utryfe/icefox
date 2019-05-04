<template>
  <split-panes
    :class="className"
    :disabled="asideCollapsed || !resizable"
    :min-size="splitSize.min"
    :max-size="splitSize.max"
    :initial-size="splitSize.default"
    :force-sizing="forceSizing"
    @resize="handleResize"
  >
    <div class="aside-panel" slot="left">
      <div class="header-wrapper">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div
            v-if="collapsible"
            class="trigger"
            :title="asideCollapsed ? '展开' : '收起'"
            @click="asideCollapsed = !asideCollapsed"
          >
            <i :class="triggerIconClass"></i>
          </div>
        </transition>

        <div class="platform-wrapper" @click="handleHomeClick">
          <transition
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutLeft"
          >
            <div class="platform-logo">
              <slot name="logo" />
            </div>
          </transition>

          <transition
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutLeft"
          >
            <div v-if="!asideCollapsed" class="platform-name">
              <slot name="platform" />
            </div>
          </transition>
        </div>
      </div>

      <div class="menu-wrapper">
        <slot name="menu" />
      </div>
    </div>

    <div class="body-panel" slot="right">
      <div class="header">
        <slot name="header" />
      </div>
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
  },

  data() {
    const { collapsed } = this
    return {
      resizing: false,
      asideCollapsed: !!collapsed,
    }
  },

  computed: {
    className() {
      const { collapsible, asideCollapsed } = this
      return [
        'basic-layout',
        {
          'layout-collapsible': collapsible,
          'layout-collapsed': asideCollapsed,
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
      const { asideSize, asideCollapsed } = this
      const argType = typeof asideSize
      const size = Object.assign(
        {
          min: '240px',
          max: '400px',
          default: '240px',
          collapsed: '80px',
        },
        argType === 'string' || argType === 'number' ? { default: asideSize } : asideSize
      )
      if (asideCollapsed) {
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
      this.$emit('update:collapsed', !!val)
      this.$emit('collapse-change', !!val)
    },
  },

  methods: {
    handleResize(...dimensions) {
      this.$emit('resize', ...dimensions)
    },
    handleHomeClick() {
      this.$emit('home-click')
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
  /*width: 100%;*/
  /*height: 100%;*/
}

body {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  font-variant: tabular-nums;
}

.basic-layout {
  &.splitter-container-item {
    & > .splitter-handle-item {
      &:after {
        background-color: @layout-aside-splitter-vertical-color;
      }
    }
  }

  & > .splitter-pane-left {
    .platform-wrapper > .platform-logo {
      & > img {
        max-height: 61.8%;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/var.less';

/*******************************************/

.header {
  padding-right: 8px;
}

.platform-wrapper {
  padding: 0 16px;
}

.platform-name {
  margin-left: 12px;
  color: @layout-aside-header-color;
}

/*******************************************/

.basic-layout {
  background-color: @layout-background-color;
  box-sizing: border-box;

  .aside-panel,
  .body-panel {
    height: 100%;
    min-height: 100vh;
    padding-top: @layout-header-height;
    box-sizing: border-box;
    position: relative;
  }

  &.layout-collapsible {
    .body-panel {
      .header {
        padding-left: 80px;
      }
    }
  }

  &.layout-collapsed {
    .aside-panel {
      .header-wrapper {
        .platform-wrapper {
          .platform-logo {
            transition: left 0.3s ease, transform 0.3s ease-in-out;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
}

.aside-panel {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 1;

  .header-wrapper {
    position: absolute;
    background-color: @layout-aside-header-background;
    height: @layout-header-height;
    width: 100%;
    left: 0;
    top: 0;

    .trigger {
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
      transform: translateX(100%);
      cursor: pointer;
      animation-duration: 0.3s;
      transition: background-color 0.3s, color 0.1s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.95);
      }
    }

    .platform-wrapper {
      box-sizing: border-box;
      display: flex;
      height: 100%;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;

      .platform-logo {
        position: relative;
        z-index: 1;
        font-size: 0;
        left: 0;
        top: 0;
        height: 100%;
        display: flex;
        flex: none;
        align-items: center;
        transform: translateX(0);
        transition: left 0.3s ease-out;
      }

      .platform-name {
        animation-duration: 0.32s;
        overflow: hidden;
        white-space: nowrap;
        word-break: keep-all;
        flex: none;
      }
    }
  }

  .menu-wrapper {
    height: 100%;
    background-color: @layout-aside-background;
  }
}

.body-panel {
  z-index: 0;

  .header {
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
    background: @layout-header-background;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    transition: padding-left 0.3s ease-out;
  }
}
</style>
