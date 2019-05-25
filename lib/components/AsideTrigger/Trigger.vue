<template>
  <div :class="className">
    <div
      class="icon-wrapper"
      v-show="!hidden"
      :title="collapsed ? '展开' : '折叠'"
      @click="collapsed = !collapsed"
    >
      <div class="trigger-icon">
        <slot :collapsed="collapsed">
          <svg-icon class="" :name="iconName" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../SvgIcon'

export default {
  name: 'IceAsideTrigger',
  components: { SvgIcon },

  props: {
    /**
     * 是否可见（.sync）
     */
    visible: {
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
      collapsed: false,
      hidden: !visible,
    }
  },

  computed: {
    className() {
      const { hidden } = this
      return [
        'aside-trigger',
        {
          'ice-hidden': hidden,
        },
      ]
    },

    iconName() {
      const { collapsed } = this
      return `ice-icon-${collapsed ? 'expand' : 'collapse'}`
    },
  },

  watch: {
    visible(val) {
      this.hidden = !!val
    },

    hidden(val) {
      this.$emit('update:visible', !val)
    },

    collapsed(collapsed) {
      const { $basicLayout } = this
      if ($basicLayout) {
        $basicLayout.$emit('aside-state-change', { collapsed })
      }
    },
  },

  created() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$on('aside-state-change', this.updateState)
    }
  },

  beforeDestroy() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$off('aside-state-change', this.updateState)
    }
  },

  methods: {
    updateState(state, aside) {
      const { collapsed, visible } = Object.assign({}, state)
      if (typeof collapsed === 'boolean') {
        this.collapsed = collapsed
      }
      if (typeof visible === 'boolean' && this.$parent !== aside) {
        this.hidden = !visible
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../theme/var.less';

.aside-trigger {
  display: inline-block;
  flex: none;
  order: -1;
  vertical-align: middle;
  height: @layout-aside-trigger-height;
  line-height: @layout-aside-trigger-height;
  box-sizing: border-box;
  background-color: @layout-aside-trigger-background-color;
  cursor: pointer;
  overflow: hidden;
  font-size: 0;

  &.ice-hidden {
    width: 0;
    visibility: hidden;
  }
}

.icon-wrapper {
  padding: 0 24px;
  box-sizing: border-box;
  font-size: @layout-aside-trigger-font-size;
  transition: background-color 0.3s ease-out;
  &:hover {
    background-color: @layout-aside-trigger-hover-background-color;
  }
}

.trigger-icon {
  color: @layout-aside-trigger-color;
  transition: color 0.3s ease-out;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;

  &:hover {
    color: @layout-aside-trigger-hover-color;
  }
}
</style>
