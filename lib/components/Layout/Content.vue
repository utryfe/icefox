<template>
  <main :class="className">
    <div class="scroll-wrapper" v-if="scrollable">
      <element-scrollbar ref="scrollbar" v-bind="$attrs" v-on="$listeners">
        <slot />
      </element-scrollbar>
    </div>
    <slot v-else />
  </main>
</template>

<script>
import ElementScrollbar from '../Scrollbar'

export default {
  name: 'IceLayoutContent',
  inheritAttrs: false,
  components: { ElementScrollbar },
  props: {
    /**
     * 是否应用内部滚动
     */
    scrollable: Boolean,
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  computed: {
    className() {
      const { scrollable } = this
      return [
        'ice-layout-content',
        {
          'ice-scrollable': scrollable,
        },
      ]
    },
  },

  watch: {
    $route: 'refreshScrollbar',
  },

  mounted() {
    this.refreshScrollbar()
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$on('after-route-enter', this.refreshScrollbar)
      $basicLayout.$on('after-route-leave', this.refreshScrollbar)
    }
  },

  beforeDestroy() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$off('after-route-enter', this.refreshScrollbar)
      $basicLayout.$off('after-route-leave', this.refreshScrollbar)
    }
  },

  methods: {
    refreshScrollbar() {
      const { scrollbar } = this.$refs
      if (scrollbar) {
        scrollbar.update()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.ice-layout-content {
  flex: 1 1 0;
  padding: 0.1px 0 0 0;
  margin: -0.1px 0 0 0;
  box-sizing: border-box;
  position: relative;
}

.scroll-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
