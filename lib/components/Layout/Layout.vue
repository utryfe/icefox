<template>
  <transition>
    <split-panes
      :class="className"
      :horizontal="!horizontal"
      :reversed="reversed"
      v-if="split"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-if="horizontal">
        <slot name="left" slot="left" />
        <slot name="right" slot="right" />
        <slot :slot="reversed ? 'left' : 'right'" />
      </template>

      <template v-else>
        <slot name="top" slot="top" />
        <slot name="bottom" slot="bottom" />
        <slot :slot="reversed ? 'top' : 'bottom'" />
      </template>
    </split-panes>
    <section v-else :class="className">
      <slot name="left" />
      <slot name="right" />
      <slot name="top" />
      <slot name="bottom" />
      <slot />
    </section>
  </transition>
</template>

<script>
import SplitPanes from '../SplitPanes'

export default {
  name: 'IceLayout',
  components: { SplitPanes },
  props: {
    /**
     * 使用水平方向的布局
     */
    horizontal: Boolean,

    /**
     * 分割区域（两部分）
     */
    split: Boolean,

    /**
     * 分割区域时，是否将flex容器交换位置
     */
    reversed: Boolean,
  },

  inject: ['$basicLayout'],

  computed: {
    className() {
      const { horizontal, split } = this
      return [
        'ice-layout',
        {
          'ice-horizontal': horizontal,
          'ice-layout-split': split,
        },
      ]
    },
  },
}
</script>

<style lang="less">
.ice-layout {
  & > .ice-splitter-container-item {
    width: auto;
    height: auto;
    flex: 1 1 auto;
  }

  &.ice-layout-split {
    &.ice-splitter-container-item {
      & > .ice-splitter-pane-item {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/var.less';

.ice-layout {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  border: none;
  padding: 0.1px 0 0 0;
  margin: -0.1px 0 0 0;
  box-sizing: border-box;
}

.ice-horizontal {
  flex-direction: row;
}
</style>
