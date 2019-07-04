<template>
  <ice-page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
  />
</template>

<script>
  export default {
    name: 'page-filter',
    data() {
      return {
        // 过滤相关配置
        filterInfo: {
          query: {
            data: ''
          },
          list: [
            {type: 'date',value: 'date'}
          ],
        },
      }
    }
  }
</script>

<style scoped>

</style>
