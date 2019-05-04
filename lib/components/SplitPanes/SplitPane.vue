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
     * 是否强制同步设置内容元素大小
     */
    forceSizing: Boolean,
  },

  computed: {
    className() {
      const { position } = this
      return ['splitter-pane-item', `splitter-pane-${position}`]
    },
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

<style lang="less" scoped>
.splitter-pane {
  &-item {
    margin: 0;
    padding: 0;
    border: none;
    transition: width 0.2s ease-out, min-width 0.2s ease-out, height 0.2s ease-out,
      min-height 0.2s ease-out;
  }

  &-left,
  &-top {
    flex: inherit;
  }

  &-right,
  &-bottom {
    flex: 1;
    flex-grow: 1; /*ie*/
  }

  &-top,
  &-bottom {
    width: 100%;
  }
}
</style>
