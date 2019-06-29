<template>
  <header :class="className">
    <transition
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <div v-show="!hidden" class="header-wrapper">
        <div class="header-layout-helper" v-show="showHelper" :style="helperStyle"></div>
        <div class="header-content">
          <slot />
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
export default {
  name: 'IceLayoutHeader',
  props: {
    /**
     * 是否使用fixed定位
     */
    fixed: Boolean,

    /**
     * 内容水平对齐方式
     */
    align: {
      type: String,
      default: 'right',
    },

    /**
     * 是否可见（.sync）
     */
    visible: {
      type: Boolean,
      default: true,
    },

    /**
     * fixed状态下有效。在fixed状态下，自动根据边栏宽度情况调节自身内容宽度。
     */
    justifyWidth: Boolean,

    /**
     * 是否应用动效
     */
    collapseTransition: {
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
    const { visible } = this
    return {
      hidden: !visible,
      resizing: false,
      helperStyle: {
        width: '',
        minWidth: '',
        maxWidth: '',
        marginLeft: '',
      },
    }
  },

  computed: {
    className() {
      const { fixed, align, hidden, resizing, collapseTransition } = this
      return [
        'ice-layout-header',
        `ice-align-${align}`,
        {
          'ice-position-fixed': fixed,
          'ice-transition-none': resizing || !collapseTransition,
          'ice-hidden': hidden,
        },
      ]
    },

    showHelper() {
      const { fixed, justifyWidth } = this
      return fixed && justifyWidth
    },
  },

  watch: {
    visible(val) {
      this.hidden = !val
    },

    hidden(val) {
      this.$emit('update:visible', !val)
    },
  },

  created() {
    const { $basicLayout, fixed, hidden } = this
    if ($basicLayout) {
      $basicLayout.$on('aside-size-change', this.updateHelperStyle)
      $basicLayout.$emit('header-state-change', { fixed, visible: !hidden })
      $basicLayout.$on('header-state-change', this.updateState)
    }
  },

  beforeDestroy() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$off('aside-size-change', this.updateHelperStyle)
      $basicLayout.$off('header-state-change', this.updateState)
    }
  },

  methods: {
    updateState(state) {
      const { visible } = Object.assign({}, state)
      if (typeof visible === 'boolean') {
        this.hidden = !visible
      }
    },

    updateHelperStyle(style) {
      if (this.showHelper) {
        const { resizing, left, width, ...helperStyle } = Object.assign({}, style)
        this.resizing = !!resizing
        let marginLeft = left
        if (typeof width === 'string' && width.endsWith('px')) {
          marginLeft = `-${Math.max(
            Math.min(Math.abs(parseFloat(left)), parseFloat(width)),
            0
          )}px`
        }
        Object.assign(this.helperStyle, helperStyle, { width, marginLeft })
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../theme/common.less';

.ice-layout-header {
  padding: 0.1px 0 0 0;
  margin: -0.1px 0 0 0;
  box-sizing: border-box;
  flex: none;
  order: -1;
  height: @layout-header-height;
  transition: height @layout-collapse-transition-duration ease-out;
}

.header-wrapper {
  box-sizing: border-box;
  height: @layout-header-height;
  display: flex;
  align-items: center;
  background-color: @layout-header-background-color;
  box-shadow: 0 1px 4px @layout-header-box-shadow-color;
  animation-duration: @layout-collapse-transition-duration;
}

.ice-position-fixed {
  .header-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: @layout-header-fixed-z-index;
  }
}

.header-layout-helper {
  flex: none;
  height: 100%;
  box-sizing: border-box;
  transition: width @layout-collapse-transition-duration ease-out,
    min-width @layout-collapse-transition-duration ease-out;
}

.header-content {
  flex: 1 1 auto;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
}

.ice-align-left {
  .header-content {
    justify-content: flex-start;
  }
}

.ice-align-center {
  .header-content {
    justify-content: center;
  }
}

.ice-hidden {
  overflow: visible;
  height: 0;
}

.ice-transition-none {
  transition: none;
  animation: none;

  .header-wrapper,
  .header-layout-helper {
    transition: none;
    animation: none;
  }
}
</style>
