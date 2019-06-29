<template>
  <ice-table-page
    background
    :handle="tableInfo.handle"
    :data.sync="tableInfo.data"
    :init-currentPage="tableInfo.initCurrentPage"
    :field-list="tableInfo.fieldList"
  />
</template>

<script>
export default {
  name: 'test-abc',
  data() {
    return {
      tableInfo: {
        initCurrentPage: 1,
        data: [],
        fieldList: [
          { label: '日期', prop: 'date', width: 180 },
          { label: '姓名', prop: 'name', width: 200 },
          { label: '地址', prop: 'address' },
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            {
              label: '查看',
              type: 'primary',
              icon: 'el-icon-browse',
              event: 'view',
              show: true,
            },
            {
              label: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              event: 'delete',
              show: true,
              ifRender(row) {
                return row.flag === true
              },
            },
          ],
        },
      },
    }
  },
}
</script>

<style scoped></style>
