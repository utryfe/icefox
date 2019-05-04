<template>
  <div :class="className"></div>
</template>

<script>
export default {
  name: 'SplitHandle',

  props: {
    /**
     * 水平分割
     */
    horizontal: {
      type: Boolean,
      default: false,
    },

    /**
     * 被禁用的
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    className() {
      const { horizontal, disabled } = this
      return [
        'splitter-handle-item',
        `splitter-handle-${horizontal ? 'horizontal' : 'vertical'}`,
        { 'splitter-disabled': disabled },
      ]
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../theme/var.less';

.splitter-handle {
  &-item {
    overflow: visible;
    position: relative;
    border: 0;
    padding: 0;
    margin: 0;
    flex: none;

    &.splitter-disabled {
      display: none;
    }

    &:before {
      content: '';
      position: absolute;
      background-color: transparent;
      z-index: 3;
    }

    &:after {
      content: '';
      position: absolute;
      z-index: 0;
      left: 0;
      top: 0;
    }
  }

  &-horizontal {
    width: 100%;
    height: 0;
    max-height: 0;
    cursor: row-resize;

    &:before {
      left: 0;
      top: -6px;
      width: 100%;
      height: 12px;
      cursor: row-resize;
    }

    &:after {
      background-color: @layout-splitter-horizontal-color;
      width: 100%;
      height: 1px;
    }
  }

  &-vertical {
    width: 0;
    max-width: 0;
    flex: 1;
    flex-grow: 1; /*ie*/
    cursor: col-resize;

    &:before {
      left: -6px;
      top: 0;
      width: 12px;
      height: 100%;
      cursor: col-resize;
    }

    &:after {
      background-color: @layout-splitter-vertical-color;
      width: 1px;
      height: 100%;
    }
  }
}
</style>
