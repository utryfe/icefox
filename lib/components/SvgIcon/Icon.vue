<template>
  <i class="ice-svg-icon">
    <svg class="svg-icon" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="symbolId" />
    </svg>
  </i>
</template>

<script>
export default {
  name: 'IceSvgIcon',

  props: {
    /**
     * 图标的名称
     */
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    symbolId() {
      return `#${this.name}`
    },
  },
}
</script>

<style lang="less">
@import '../../theme/common.less';

.ice-svg-icon {
  font-size: @svg-icon-default-font-size;
}
</style>

<style scoped>
.ice-svg-icon {
  display: inline-block;
  box-sizing: border-box;
  color: inherit;
  font-style: normal;
  text-align: center;
  text-transform: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.svg-icon {
  width: 1em;
  height: 1em;
  box-sizing: border-box;
  vertical-align: -0.125em;
  fill: currentColor;
  overflow: hidden;
}
</style>
