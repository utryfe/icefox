<template>
  <element-pagination
    @size-change="paginationData.handleSizeChange"
    @current-change="paginationData.handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :layout="layout"
    :total="paginationData.total"
    :background="background"
  >
  </element-pagination>
</template>

<script>
import { Pagination } from 'element-ui'

export default {
  name: 'IceTablePage',
  inheritAttrs: false,
  components: { ElementPagination: Pagination },
  props: {
    paginationData: {
      type: Object,
      default: () => {},
    },

    /*是否添加背景颜色*/
    background: Boolean,
  },

  data() {
    const { paginationData } = this.$props
    return {
      pageSizes: paginationData.pageSizes || [20, 50, 100, 200],
      pageSize: paginationData.pageSize || 20,
      currentPage: paginationData.currentPage || 1,
      layout: paginationData.layout || 'total, sizes, prev, pager, next, jumper',
    }
  },
}
</script>

<style scoped></style>
