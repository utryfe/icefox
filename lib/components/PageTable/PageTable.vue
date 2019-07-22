<template>
  <div class="page-table" :class="className">
    <!-- 显示表格 -->
    <element-table
      ref="table"
      class="my-table"
      height="xxx"
      v-loading="listInfo.loading"
      :data="data"
      border
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange"
    >
      <element-table-column
        v-if="checkBox"
        :key="'selection'"
        type="selection"
        width="55"
      />
      <element-table-column
        v-if="tabIndex"
        :key="'index'"
        align="center"
        label="序号"
        :width="fieldList.length === 0 ? '' : 80"
        fixed
      >
        <template v-slot="scope">
          <span>{{
            scope.$index + 1 + (listInfo.query.currentPage - 1) * listInfo.query.pageSize
          }}</span>
        </template>
      </element-table-column>
      <element-table-column
        v-for="(item, index) in fieldList.filter((item) => !item.hidden)"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :fixed="item.fixed"
        :formatter="item.formatter"
        :sortable="item.sortable"
        align="center"
        :width="item.width"
        :min-width="item.minWidth || '100px'"
      >
      </element-table-column>
      <element-table-column
        v-if="handle"
        :key="'handle'"
        :fixed="handle.fixed"
        align="center"
        :label="handle.label"
        :width="handle.width"
      >
        <template v-slot="scope">
          <template v-for="(item, index) in handle.btList">
            <!-- 操作按钮 -->
            <el-button
              v-if="item.show && (!item.ifRender || item.ifRender(scope.row))"
              :key="index"
              size="mini"
              :type="item.type"
              :icon="item.icon"
              :disabled="item.disabled"
              :loading="scope.row[item.loading]"
              @click="handleClick(item.event, scope.row)"
            >
              {{ item.label }}
            </el-button>
          </template>
        </template>
      </element-table-column>
    </element-table>

    <!-- 分页组件 -->
    <template v-if="pager">
      <div class="pagination-container">
        <element-pagination
          :background="background"
          :current-page.sync="listInfo.query.currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { Table, TableColumn, Pagination } from 'element-ui'
export default {
  name: 'IcePageTable',
  inheritAttrs: false,
  components: {
    ElementTable: Table,
    ElementTableColumn: TableColumn,
    ElementPagination: Pagination,
  },
  props: {
    // 自定义类名
    className: {
      type: String,
    },

    // 操作栏配置
    handle: {
      type: Object,
    },

    // 刷新
    refresh: {
      type: Number,
    },

    // 获取数据的接口
    api: {
      type: Function,
    },

    // 是否显示序号
    tabIndex: {
      type: Boolean,
      default: false,
    },

    // 是否有选择框
    checkBox: {
      type: Boolean,
      default: false,
    },

    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return []
      },
    },

    // 是否分页
    pager: {
      type: Boolean,
      default: true,
    },

    // 列表数据
    data: {
      type: Array,
    },

    // 重置当前页
    initCurrentPage: {
      type: Number,
    },

    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {}
      },
    },

    // 页码选择器
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200]
      },
    },

    // 每页数量
    pageSize: {
      type: Number,
      default: 20,
    },

    // 页码是否带背景颜色
    background: {
      type: Boolean,
      default: false,
    },

    // 选中列表
    checkedList: {
      type: Array,
      default: () => {
        return []
      },
    },

    // 监听高度
    listenHeight: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      // 分页相关
      listInfo: {
        total: 0, // 总条数
        loading: false, // 加载动画
        query: {
          // 查询条件
          currentPage: 1, // 当前页
          pageSize: 20, // 每页条数
        },
      },
    }
  },

  watch: {
    initCurrentPage() {
      this.listInfo.query.currentPage = 1
    },
    refresh() {
      if (!this.api) return
      this.getList(this.api)
    },
  },

  methods: {
    // 处理参数
    handleParams() {
      const obj = {}
      for (const key in this.query) {
        if (this.query[key] || this.query[key] === 0) {
          obj[key] = this.query[key]
        }
      }
      // 如果不需要分页，则无分页相关参数
      return this.pager ? { ...this.listInfo.query, ...obj } : obj
    },

    // 得到数据
    getList(api) {
      this.listInfo.loading = true
      return new Promise((resolve, reject) => {
        // 每次调用接口时都自动绑定最新的数据
        api(this.handleParams())
          .then((res) => {
            this.listInfo.loading = false
            if (res.status === 200) {
              const result = res.data
              // 使外面可以访问到表格数据
              const arr = result.Data
              this.$emit('update:data', arr)
              if (this.pager) {
                this.listInfo.total = result.count
                this.listInfo.query.currentPage = result.currentPage
                this.listInfo.query.pageSize = result.pageSize
              }
              // 设置当前选中项
              this.checkedList.forEach((selected) => {
                const row = arr.find((item) => {
                  return item.flag === selected
                })
                this.$nextTick(() => {
                  if (!row) return
                  this.$refs.table.toggleRowSelection(row, true)
                })
              })
              resolve(res)
              this.$emit('handleEvent', 'list', arr)
            } else {
              this.$message({
                showClose: true,
                message: '获取列表失败',
                type: 'error',
              })
              reject()
            }
          })
          .catch(() => {
            reject()
            this.listInfo.loading = false
          })
      })
    },

    // 翻页刷新表格数据
    handleSizeChange(val) {
      const query = this.listInfo.query
      query.pageSize = val // 每页条数
      query.currentPage = 1 // 每页条数切换，重置当前页
      this.getList(this.api)
    },
    handleCurrentChange(val) {
      this.listInfo.query.currentPage = val // 当前页
      this.getList(this.api)
    },

    // 选中数据
    handleSelectionChange(rows) {
      this.$emit('handleEvent', 'tableCheck', rows)
    },

    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    },
  },
}
</script>

<style lang="less" scoped>
.page-table {
  height: 94%;
  .my-table {
    height: 87%;
    margin-bottom: 50px;
  }
  .pagination-container {
    float: right;
  }
}
</style>
