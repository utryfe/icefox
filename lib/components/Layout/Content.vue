<template>
  <main :class="className">
    <div class="scroll-wrapper" v-if="scrollable">
      <element-scrollbar v-bind="$attrs" v-on="$listeners">
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
}
</script>

<style lang="less">
.ice-layout-content {
  &.ice-scrollable > .scroll-wrapper > .ice-scrollbar {
    & > .el-scrollbar__bar {
      .el-scrollbar__thumb {
        background-color: #656667;
        opacity: 0.75;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.ice-layout-content {
  flex: 1 1 auto;
  padding: 0.1px 0 0 0;
  margin: -0.1px 0 0 0;
  box-sizing: border-box;

  &.ice-scrollable {
    position: relative;
  }
}

.scroll-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
