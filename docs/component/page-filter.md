# PageFilter 分页表格

PageFilter 组件主要是基于 Element 的 el-input等各种输入框的集合 以及按钮的组合式。

## 使用方式
当然，一般是和表格放在一起用，主要起到过滤查询的作用。
```vue
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
  data () {
    return {
      // 过滤相关配置
      filterInfo: {
        // 查询参数
        query: {
          name: '',
          tag_id: '',
        },
        // 查询框
        list: [
          { type: 'select',label: '城市',value: 'tag_id',list: 'tagTypeList',},
          { type: 'input', label: '昵称', value: 'name' },
          { type: 'button',label: '搜索',btType: 'primary',icon: 'el-icon-search',event: 'search',show: true},
          { type: 'button',label: '添加',btType: 'primary',icon: 'el-icon-plus',event: 'create',show: true}
        ],
      },
      // select相关列表
      listTypeInfo: {
        tagTypeList: [],
      },
    }
  }
}
</script>
```
<page-filter/>

## Attributes
| 参数             |             说明             |   类型   |             默认值 |
| ---------------- | :--------------------------: | :------: | -----------------: |
| query            |           查询参数           |  Object   |                / |
| filter-list      |           查询框           |  Object  |                  / |
| list-type-info     |         下拉框可选数组     |  Array   |                  / |

## Events
| 参数        |     说明     |   类型   | 默认值 |
| ----------- | :----------: | :------: | -----: |
| handleClick | 按钮点击事件 | Function |      / |
| handleEvent |   选中数据   | Function |      / |

## 源码
- [在线源码](https://github.com/utryfe/icefox/blob/master/lib/components/PageFilter/PageFilter.vue)
- [在线Demo](http://www.star2018.com/table)
