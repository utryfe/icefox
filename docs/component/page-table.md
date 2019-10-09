# PageTable 分页表格

PageTable 组件主要是基于 Element 的 el-table 和 el-pagination 进行了二次封装。

## 使用方式

```vue
<template>
  <ice-page-table
    background
    :data.sync="tableInfo.data"
    :refresh="tableInfo.refresh"
    :init-currentPage="tableInfo.initCurrentPage"
    :api="getListApi"
    :handle="tableInfo.handle"
    :field-list="tableInfo.fieldList"
  />
</template>
<script>
export default {
  data() {
    return {
      tableInfo: {
        refresh: 1,
        initCurrentPage: 1,
        data: [],
        fieldList: [
          // 动态表头
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

  mounted() {
    this.getList()
  },

  methods: {
    // 查询数据的API
    getListApi(params) {
      return this.$http({
        url: '/api/article/getList',
        method: 'get',
        params,
      })
    },

    // 刷新表格
    getList() {
      /*而组件内部watch字段change，
      重新调获取数据的接口，即可实现刷新功能*/

      this.tableInfo.refresh = Math.random()
    },
  },
}
</script>
```

<page-table/>

## Attributes

| 参数             |             说明             |   类型   |             默认值 |
| ---------------- | :--------------------------: | :------: | -----------------: |
| data             |           信息列表           |  Array   |                  / |
| refresh          |           刷新数据           |  Number  |                  / |
| field-lists      |           字段列表           |  Array   |                  / |
| api              |           数据接口           | Function |                  / |
| handle           |          操作栏配置          | Function |                  / |
| checkBox         |            多选框            | Boolean  |              false |
| tabIndex         |             序号             | Boolean  |              false |
| pager            |           是否分页           | Boolean  |               true |
| init-currentPage |          初始化分页          | Boolean  |               true |
| background       |      分页是否加背景颜色      | Boolean  |              false |
| pageSizes        | 每页显示个数选择器的选项设置 | Number[] | [20, 50, 100, 200] |
| pageSize         |       每页显示条目个数       |  Number  |                 20 |

## Events

| 参数        |     说明     |   类型   | 默认值 |
| ----------- | :----------: | :------: | -----: |
| handleClick | 按钮点击事件 | Function |      / |
| handleEvent |   选中数据   | Function |      / |

## 源码

- [在线源码](https://github.com/utryfe/icefox/blob/master/lib/components/PageTable/PageTable.vue)
- [在线 demo](http://www.star2018.com/table)
