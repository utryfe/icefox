<template>
  <div :class="className">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SplitPane',

  props: {
    /**
     * 面板位置
     * left、right、top、bottom
     */
    position: {
      type: String,
      required: true,
    },

    /**
     * 是否反转flex位置
     */
    reversed: Boolean,

    /**
     * 是否强制同步设置内容元素大小
     */
    forceSizing: Boolean,
  },

  computed: {
    className() {
      const { position, reversed } = this
      return [
        'ice-splitter-pane-item',
        `ice-splitter-pane-${position}`,
        {
          'ice-flex-reversed': reversed,
        },
      ]
    },
  },

  created() {
    this.$on('split-size-change', (...args) => this.$emit('size-change', ...args))
    this.$on('split-resizable-change', (...args) =>
      this.$emit('resizable-change', ...args)
    )
  },

  mounted() {
    this.$on('resize', this.onResize)
    this.onResize()
  },

  methods: {
    onResize() {
      if (!this.forceSizing) {
        return
      }
      const slot = this.$slots.default
      if (slot.length) {
        const elem = slot[0].elm
        if (elem instanceof HTMLElement) {
          const el = this.$el
          elem.style.width = `${el.clientWidth}px`
          elem.style.height = `${el.clientHeight}px`
        }
      }
    },
  },
}
</script>

<style lang="less">
.ice-splitter-pane-item {
  & > .ice-layout,
  & > .ice-layout-aside,
  & > .ice-layout-content {
    height: 100%;
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/var.less';

.ice-splitter-pane {
  &-item {
    margin: 0;
    padding: 0;
    border: none;
    transition: width @layout-collapse-transition-duration ease-out,
      min-width @layout-collapse-transition-duration ease-out,
      height @layout-collapse-transition-duration ease-out,
      min-height @layout-collapse-transition-duration ease-out,
      padding @layout-collapse-transition-duration ease-out;
  }

  &-left,
  &-top {
    flex: none;

    &.ice-flex-reversed {
      flex: 1 1 auto;
    }
  }

  &-right,
  &-bottom {
    flex: 1 1 auto;

    &.ice-flex-reversed {
      flex: none;
    }
  }

  &-top,
  &-bottom {
    width: 100%;
  }
}
</style>
