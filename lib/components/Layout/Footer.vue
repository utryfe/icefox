<template functional>
  <footer class="ice-layout-footer">
    <slot />
  </footer>
</template>

<script>
export default {
  name: 'IceLayoutFooter',
}
</script>

<style lang="less" scoped>
.ice-layout-footer {
  order: 100;
  flex: none;
  padding: 0.1px 0 0 0;
  margin: -0.1px 0 0 0;
  box-sizing: border-box;
}
</style>
