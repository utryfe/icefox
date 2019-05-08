<template>
  <element-scrollbar
    ref="scrollbar"
    class="ice-scrollbar"
    :wrap-class="wrapperClass"
    :view-class="viewClassName"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </element-scrollbar>
</template>

<script>
import { Scrollbar as ElementScrollbar } from 'element-ui'

export default {
  name: 'IceScrollbar',
  inheritAttrs: false,
  components: { ElementScrollbar },

  props: {
    wrapClass: String,
    viewClass: String,
    overflowX: {
      type: String,
      default: 'hidden',
    },
    overflowY: {
      type: String,
      default: 'auto',
    },
  },

  computed: {
    wrapperClass() {
      const { overflowX, overflowY, wrapClass } = this
      return [
        wrapClass,
        'ice-scroll-wrapper',
        `ice-scroll-overflow-x-${overflowX}`,
        `ice-scroll-overflow-y-${overflowY}`,
      ]
    },

    viewClassName() {
      const { viewClass } = this
      return [viewClass, 'scroll-view-class']
    },
  },

  mounted() {
    const { scrollbar } = this.$refs
    if (scrollbar && typeof scrollbar.update === 'function') {
      scrollbar.update()
    }
  },
}
</script>

<style lang="less">
@import '../../theme/var.less';

.ice-scrollbar {
  & > .el-scrollbar__bar {
    &.is-vertical {
      right: @scrollbar-gap;
      width: @scrollbar-width;
    }

    &.is-horizontal {
      bottom: @scrollbar-gap;
      height: @scrollbar-width;
    }
  }

  & > .ice-scroll-wrapper {
    &.ice-scroll-overflow-x-hidden {
      overflow-x: hidden;
    }
    &.ice-scroll-overflow-x-auto {
      overflow-x: auto;
    }
    &.ice-scroll-overflow-x-visible {
      overflow-x: visible;
    }
    &.ice-scroll-overflow-y-hidden {
      overflow-y: hidden;
    }
    &.ice-scroll-overflow-y-visible {
      overflow-y: visible;
    }

    & > .scroll-view-class {
      height: 100%;
      overflow: visible;
      padding: 0.1px 0 0 0;
      margin: -0.1px 0 0 0;
      box-sizing: border-box;
    }
  }
}
</style>

<style lang="less" scoped>
.ice-scrollbar {
  height: 100%;
}
</style>
