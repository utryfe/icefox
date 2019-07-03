<template>
  <!-- 条件栏 -->
  <ice-page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
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
            name: '',
            tag_id: '',
          },
          list: [
            {
              type: 'select',
              label: '城市',
              value: 'tag_id',
              list: 'tagTypeList',
            },
            { type: 'input', label: '昵称', value: 'name' },
            {
              type: 'button',
              label: '搜索',
              btType: 'primary',
              icon: 'el-icon-search',
              event: 'search',
              show: true,
            },
            {
              type: 'button',
              label: '添加',
              btType: 'primary',
              icon: 'el-icon-plus',
              event: 'create',
              show: true,
            }
          ],
        },
        // select相关列表
        listTypeInfo: {
          tagTypeList: [
            {
              key: '四川省',
              value: 1
            },
            {
              key: '江西省',
              value: 2
            },
            {
              key: '云南省',
              value: 3
            },
            {
              key: '安徽省',
              value: 4
            },
            {
              key: '陕西省',
              value: 5
            },
          ],
        },
      }
    }
  }
</script>

<style scoped>

</style>
