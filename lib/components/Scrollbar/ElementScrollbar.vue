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

  data() {
    return {
      $timer: -1,
    }
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
      return [viewClass, 'ice-scroll-view']
    },
  },

  mounted() {
    this.update()
    window.addEventListener('resize', this.update, false)
  },

  beforeDestroy() {
    clearTimeout(this.$timer)
    window.removeEventListener('resize', this.update, false)
  },

  methods: {
    update() {
      const { scrollbar } = this.$refs
      if (scrollbar && typeof scrollbar.update === 'function') {
        clearTimeout(this.$timer)
        this.$timer = setTimeout(() => this.$nextTick(scrollbar.update), 200)
      }
    },
  },
}
</script>

<style lang="less">
@import '../../theme/common.less';

.ice-scrollbar {
  & > .el-scrollbar__bar {
    & > .el-scrollbar__thumb {
      background-color: @scrollbar-background-color;
      opacity: @scrollbar-opacity;

      &:hover {
        background-color: @scrollbar-hover-background-color;
      }
    }

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
    display: flex;
    flex-direction: column;
    flex: none;

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

    & > .ice-scroll-view {
      flex: 1 1 0;
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
