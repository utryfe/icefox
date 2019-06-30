<template>
  <aside ref="container" :class="className" :style="rootStyle">
    <div class="aside-main" :style="mainStyle">
      <div class="aside-header">
        <slot name="header" />
      </div>

      <div class="aside-content">
        <element-scrollbar v-if="state.fixed || scrollable">
          <slot />
        </element-scrollbar>

        <template v-else>
          <slot />
        </template>
      </div>

      <aside-trigger
        class="aside-trigger"
        v-if="collapsible"
        :collapsed.sync="state.collapsed"
      >
        <slot name="trigger" :collapsed="state.collapsed" />
      </aside-trigger>
    </div>
  </aside>
</template>

<script>
import ElementScrollbar from '../Scrollbar'
import AsideTrigger from '../AsideTrigger'
import { addResizeListener, removeResizeListener } from '../../utils/dom'

export default {
  name: 'IceLayoutAside',
  components: { AsideTrigger, ElementScrollbar },

  props: {
    /**
     * 是否可见（.sync）
     */
    visible: { type: Boolean, default: true },

    /**
     * 是否固定定位（.sync）
     */
    fixed: { type: Boolean, default: false },

    /**
     * 是否可折叠（启用时会显示trigger）
     */
    collapsible: Boolean,

    /**
     * 是否可滚动
     */
    scrollable: Boolean,

    /**
     * 是否已经折叠（.sync）
     */
    collapsed: { type: Boolean, default: false },

    /**
     * 折叠时的宽度
     */
    collapsedWidth: { type: [String, Number], default: '60px' },

    /**
     * 折叠是否使用过渡效果
     */
    collapseTransition: { type: Boolean, default: true },

    /**
     * 默认宽度
     */
    width: { type: [String, Number], default: '240px' },

    /**
     * 最小宽度
     */
    minWidth: { type: [String, Number], default: '240px' },

    /**
     * 最大宽度
     */
    maxWidth: { type: [String, Number], default: '400px' },

    /**
     * fixed状态下有效。会检测是否存在页面布局header并在顶部减去header对应的高度。
     */
    justifyHeight: Boolean,
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  data() {
    const { visible, width, collapsed, fixed } = this
    return {
      pageScrollLeft: document.documentElement.scrollLeft,
      resizing: false,
      resizeWidth: width,
      offsetWidth: typeof width === 'string' && width.endsWith('px') ? width : 0,
      inheritWidth: false,
      justify: false,
      state: {
        fixed: !!fixed,
        visible: !!visible,
        collapsed: !!collapsed,
      },
    }
  },

  computed: {
    className() {
      const { useTransition, collapsible, resizing, justify, state, $slots } = this
      const { fixed, collapsed, visible } = state
      return [
        'ice-layout-aside',
        {
          'ice-position-fixed': fixed,
          'ice-transition-none': !useTransition,
          'ice-collapsed': collapsed,
          'ice-hidden': !visible,
          'ice-has-header': !!$slots.header,
          'ice-has-trigger': collapsible,
          'ice-resizing': resizing,
          'ice-justify': justify,
        },
      ]
    },

    useTransition() {
      const { collapseTransition, resizing } = this
      return collapseTransition && !resizing
    },

    style() {
      const { resizeWidth, minWidth, maxWidth } = this
      return {
        width: resizeWidth,
        minWidth,
        maxWidth,
      }
    },

    mainStyle() {
      const {
        collapsedWidth,
        offsetWidth,
        inheritWidth,
        style,
        state,
        pageScrollLeft,
      } = this
      const { collapsed, visible, fixed } = state
      let mainStyle
      if (collapsed) {
        mainStyle = {
          width: fixed || !visible ? collapsedWidth : '',
          minWidth: '0px',
          maxWidth: style.maxWidth,
        }
      } else if (fixed || !visible) {
        mainStyle = { ...style }
        if (fixed && inheritWidth) {
          mainStyle.width = `${offsetWidth}px`
        }
      } else if (inheritWidth) {
        mainStyle = {
          ...style,
          width: fixed ? `${offsetWidth}px` : '',
        }
      } else {
        mainStyle = {}
      }
      if (fixed) {
        mainStyle.left = `-${pageScrollLeft}px`
      }
      return mainStyle
    },

    rootStyle() {
      const { collapsedWidth, inheritWidth, style, state } = this
      const { collapsed, visible } = state
      if (!visible) {
        return {
          width: '0px',
          minWidth: '0px',
          maxWidth: style.maxWidth,
          overflow: 'visible',
        }
      }
      if (collapsed) {
        return {
          width: collapsedWidth,
          minWidth: '0px',
          maxWidth: style.maxWidth,
        }
      }
      if (inheritWidth) {
        return {
          ...style,
          width: '100%',
        }
      }
      return { ...style }
    },
  },

  watch: {
    visible(val) {
      this.state.visible = !!val
    },

    'state.visible'(val) {
      if (!val) {
        this.inheritWidth = false
        this.resizeWidth = this.width
      }
      this.syncParentSize(this.collapseTransition)
      this.$emit('update:visible', !!val)
    },

    collapsed(val) {
      this.state.collapsed = !!val
    },

    'state.collapsed'(val) {
      if (!val) {
        this.inheritWidth = false
        this.resizeWidth = this.width
      }
      this.syncParentSize(this.collapseTransition)
      this.$emit('update:collapsed', !!val)
    },

    fixed(val) {
      this.state.fixed = !!val
    },

    'state.fixed': {
      immediate: true,
      handler(val) {
        this.$emit('update:fixed', !!val)
        if (val) {
          this.registerResizeEvent()
          this.registerWindowEvent()
        } else {
          this.unregisterResizeEvent()
          this.unregisterWindowEvent()
        }
      },
    },

    rootStyle: {
      immediate: true,
      handler() {
        if (!this.state.fixed) {
          this.syncHeaderSize()
        }
      },
    },

    mainStyle: {
      immediate: true,
      handler() {
        if (this.state.fixed) {
          this.syncHeaderSize()
        }
      },
    },

    state: {
      deep: true,
      immediate: true,
      handler(state) {
        const { $basicLayout, $parent, useTransition } = this
        if ($basicLayout) {
          $basicLayout.$emit(
            'aside-state-change',
            { ...state, transition: useTransition },
            this
          )
        }
        $parent.$emit('split-resizable-change', !state.collapsed && state.visible)
      },
    },
  },

  created() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$on('aside-state-change', this.updateState)
      $basicLayout.$on('split-resize-start', this.handleResizeStart)
      $basicLayout.$on('split-resize-end', this.handleResizeEnd)
      $basicLayout.$on('split-resize', this.handleResize)
      $basicLayout.$on('header-state-change', this.syncHeaderSize)
    }
    this.syncParentSize(false)
  },

  mounted() {
    const { $basicLayout, state, useTransition } = this
    this.registerResizeEvent()
    this.handlePageScroll()
    if ($basicLayout) {
      $basicLayout.$emit(
        'aside-state-change',
        { ...state, transition: useTransition },
        this
      )
    }
  },

  beforeDestroy() {
    const { $basicLayout } = this
    this.unregisterResizeEvent()
    this.unregisterWindowEvent()
    if ($basicLayout) {
      $basicLayout.$off('aside-state-change', this.updateState)
      $basicLayout.$off('split-resize-start', this.handleResizeStart)
      $basicLayout.$off('split-resize-end', this.handleResizeEnd)
      $basicLayout.$off('split-resize', this.handleResize)
      $basicLayout.$off('header-state-change', this.syncHeaderSize)
    }
  },

  methods: {
    setOffsetWidth() {
      const { inheritWidth } = this
      if (!inheritWidth) {
        return
      }

      const { container } = this.$refs
      if (container) {
        this.offsetWidth = container.offsetWidth
      }
    },

    syncParentSize(useTransition) {
      const { $parent, rootStyle } = this
      const { width, minWidth, maxWidth } = rootStyle
      $parent.$emit(
        'split-size-change',
        {
          minSize: minWidth,
          maxSize: maxWidth,
          initialSize: width,
        },
        !!useTransition
      )
    },

    syncHeaderSize() {
      const { $basicLayout } = this
      if ($basicLayout) {
        const { resizeWidth, rootStyle, mainStyle, justifyHeight, resizing, state } = this
        const { fixed } = state
        const sizeStyle = { ...(fixed ? mainStyle : rootStyle), resizing }
        if (!fixed && resizing) {
          sizeStyle.width = resizeWidth
        }
        this.justify = !!(fixed && justifyHeight)
        $basicLayout.$emit('aside-size-change', sizeStyle)
      }
    },

    updateState(state) {
      if (state !== null && typeof state === 'object') {
        const propState = this.state
        for (const prop of ['fixed', 'collapsed', 'visible']) {
          const value = state[prop]
          if (typeof value === 'boolean') {
            propState[prop] = value
          }
        }
      }
    },

    handleResizeStart(component) {
      if (component === this.$parent) {
        this.resizing = true
      }
    },

    handleResizeEnd(component) {
      if (component === this.$parent) {
        this.resizing = false
      }
    },

    handleResize(styles, component) {
      if (this.resizing && styles.width !== undefined && component === this.$parent) {
        this.inheritWidth = true
        this.resizeWidth = styles.width
      }
    },

    handlePageScroll() {
      this.pageScrollLeft = document.documentElement.scrollLeft
    },

    registerWindowEvent() {
      this.handlePageScroll()
      window.addEventListener('resize', this.handlePageScroll, false)
      window.addEventListener('scroll', this.handlePageScroll, false)
    },

    unregisterWindowEvent() {
      window.removeEventListener('resize', this.handlePageScroll, false)
      window.removeEventListener('scroll', this.handlePageScroll, false)
    },

    registerResizeEvent() {
      const { $refs, state } = this
      const { container } = $refs
      if (container && state.fixed) {
        this.setOffsetWidth()
        addResizeListener(container, this.setOffsetWidth)
      }
    },

    unregisterResizeEvent() {
      const { container } = this.$refs
      if (container) {
        removeResizeListener(container, this.setOffsetWidth)
      }
    },
  },
}
</script>

<style lang="less">
.ice-layout-aside {
  & > .aside-main {
    & > .aside-header {
      & > img {
        min-width: 24px;
        max-height: 61.8%;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/common.less';

.ice-layout-aside {
  flex: none;
  order: -2;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0.1px 0 0 0;
  margin: -0.1px 0 0 0;
  transition: width @layout-collapse-transition-duration ease-out,
    min-width @layout-collapse-transition-duration ease-out;

  &.ice-transition-none {
    transition: none;
    animation: none;
  }
}

.aside-main {
  box-sizing: border-box;
  transform: translateX(0);
  opacity: 1;
  box-shadow: 2px 2px 6px @layout-aside-box-shadow-color;
  background-color: @layout-aside-background-color;
  transition: transform @layout-collapse-transition-duration ease-out,
    width @layout-collapse-transition-duration ease-out,
    min-width @layout-collapse-transition-duration ease-out,
    opacity @layout-collapse-transition-duration ease-out, background-color 0.3s ease-out;
}

.aside-main {
  height: 100%;
  position: relative;
}

.ice-transition-none {
  .aside-main {
    transition: none;
  }
}

.ice-has-trigger {
  .aside-main {
    padding-bottom: @layout-aside-inner-trigger-height;
  }

  .aside-trigger {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: @layout-aside-inner-trigger-height;
    line-height: @layout-aside-inner-trigger-height;
    z-index: 1;
    bottom: 0;
    left: 0;
    box-shadow: 0 -1px 0px @layout-aside-trigger-inner-border-color;
  }
}

.aside-header {
  display: none;
}

.aside-content {
  height: 100%;
  box-sizing: border-box;
}

.ice-resizing,
.ice-collapsed {
  .aside-main,
  .aside-content {
    overflow: hidden;
  }
}

.ice-has-header {
  .aside-main {
    padding-top: @layout-header-height;
  }

  .aside-header {
    height: @layout-header-height;
    background-color: @layout-aside-header-background-color;
    box-shadow: 1px 1px 0 0 @layout-aside-header-border-color;
    overflow: hidden;
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
}

.ice-position-fixed {
  .aside-main {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: auto;
    z-index: max(@layout-aside-fixed-z-index, @layout-header-fixed-z-index + 1);
  }

  &.ice-justify {
    .aside-main {
      top: @layout-header-height;
      z-index: max(min(@layout-aside-fixed-z-index, @layout-header-fixed-z-index - 1), 0);
    }
  }
}

.ice-hidden {
  .aside-main {
    opacity: 0;
    transform: translateX(-100%);
  }
}
</style>
