<template>
  <article class="ice-basic-layout">
    <ice-layout
      class="ice-layout-body"
      :split="split"
      :horizontal="horizontal"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-if="split">
        <slot name="left" slot="left" />
        <slot name="right" slot="right" />
        <slot name="top" slot="top" />
        <slot name="bottom" slot="bottom" />
        <slot />
      </template>
      <slot v-else />
    </ice-layout>
  </article>
</template>

<script>
import IceLayout from './Layout'

export default {
  name: 'IceBasicLayout',
  components: { IceLayout },
  inheritAttrs: false,

  props: {
    /**
     * 分割区域（两部分）
     */
    split: Boolean,

    /**
     * 使用水平方向的布局
     */
    horizontal: Boolean,
  },

  provide() {
    return {
      $basicLayout: this,
    }
  },

  methods: {
    /**
     * 显示边栏
     */
    showAside() {
      this.$emit('aside-state-change', { visible: true })
    },

    /**
     * 隐藏边栏
     */
    hideAside() {
      this.$emit('aside-state-change', { visible: false })
    },

    /**
     * 折叠边栏
     */
    collapseAside() {
      this.$emit('aside-state-change', { collapsed: true })
    },

    /**
     * 展开边栏
     */
    expandAside() {
      this.$emit('aside-state-change', { collapsed: false })
    },

    /**
     * 显示页面顶栏
     */
    showHeader() {
      this.$emit('header-state-change', { visible: true })
    },

    /**
     * 隐藏页面顶栏
     */
    hideHeader() {
      this.$emit('header-state-change', { visible: false })
    },

    /**
     * 全屏
     */
    requestFullScreen() {},

    /**
     * 退出全屏
     */
    exitFullscreen() {},
  },
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  border: 0;
}

.ice-layout-body {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}
</style>

<style lang="less" scoped>
@import '../../theme/common.less';

.ice-basic-layout {
  min-width: @layout-min-width;
  min-height: @layout-min-height;
  background-color: @layout-background-color;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
}

.ice-layout-body {
  min-height: 100vh;
}
</style>
