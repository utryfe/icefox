<template>
  <div class="wrap">
    <el-date-picker
      ref="datePicker"
      v-bind="$attrs"
      v-on="$listeners"
      :format="innerFormat"
      :readonly="readonly || type === 'quarter'"
      :type="type === 'quarter' ? 'date' : type"
      @change="$emit('change', arguments[0])"
      @click.native.stop="showQuarterPicker"
      v-model="bindValue"
    />
    <el-popover
      popper-class="JD-date-wrap"
      placement="bottom"
      width="298"
      trigger="manual"
      v-model="pickerVisible"
    >
      <div class="dateWrap" @click.stop>
        <div class="header">
          <el-button
            @click="goPrev"
            class="arrow-btn"
            type="text"
            icon="el-icon-d-arrow-left"
          ></el-button>
          <div class="yearWrap">
            <span class="yeartext">{{ currentYear }}年</span>
          </div>
          <el-button
            @click="goNext"
            class="arrow-btn"
            type="text"
            icon="el-icon-d-arrow-right"
          ></el-button>
        </div>

        <el-button class="btn" style="margin-left:10px;" @click="handlePick(1)"
          ><span>第一季度</span></el-button
        >
        <el-button class="btn" @click="handlePick(4)"><span>第二季度</span></el-button>
        <el-button class="btn" @click="handlePick(7)"><span>第三季度</span></el-button>
        <el-button class="btn" @click="handlePick(10)"><span>第四季度</span></el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'IceDatePicker',
  inheritAttrs: false,
  props: ['modelValue', 'type', 'format', 'readonly'],
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  data() {
    return {
      bindValue: this.modelValue,
      quarter: 1,
      currentYear: '',
      pickerVisible: false,
    }
  },

  computed: {
    innerFormat() {
      const { type, format } = this
      return this.getFormatMask(type, format)
    },
  },

  watch: {
    bindValue() {
      this.$nextTick(() => {
        this.updateInnerState()
      })
    },
  },

  created() {
    document.body.addEventListener(
      'click',
      (this.closeHandler = () => {
        this.pickerVisible = false
      }),
      false
    )
  },

  mounted() {
    this.updateInnerState()
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.closeHandler, false)
  },

  methods: {
    updateInnerState() {
      const picker = this.$refs.datePicker
      const date = picker.parsedValue
      const currDate = date && date.toString() !== 'Invalid Date' ? date : new Date()
      this.currentYear = currDate.getFullYear()
      this.quarter = this.getQuarterStartMonth(currDate.getMonth() + 1)
    },

    //
    getQuarterStartMonth(month) {
      let quarterStartMonth = 0
      if (month < 4) {
        quarterStartMonth = 1
      }
      if (3 < month && month < 7) {
        quarterStartMonth = 4
      }
      if (6 < month && month < 10) {
        quarterStartMonth = 7
      }
      if (month > 9) {
        quarterStartMonth = 10
      }
      return (quarterStartMonth - 1) / 3 + 1
    },

    getFormatMask(type, format) {
      if (type === 'quarter') {
        const { currentYear, quarter } = this
        return format || `${currentYear}年 第${quarter}季度`
      } else if (type === 'week') {
        return format || 'yyyy 第 WW 周'
      }
      return format
    },

    showQuarterPicker() {
      this.pickerVisible = this.type === 'quarter'
    },

    handlePick(month) {
      const { currentYear } = this
      this.$emit('change', new Date(currentYear, month - 1, 1))
      this.quarter = (+month - 1) / 3 + 1
      this.pickerVisible = false
    },

    goPrev() {
      this.currentYear -= 1
    },

    goNext() {
      this.currentYear += 1
    },
  },
}
</script>

<style scoped>
.wrap {
  display: inline-block;
}
</style>
<style lang="less">
.JD-date-wrap {
  width: 100%;
  height: 240px;
  .dateWrap {
    width: 100%;
    height: 100%;
    .header {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 43px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 12px;
      .yearWrap {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .yeartext {
          color: #606266;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    .el-button.arrow-btn {
      width: 20px;
      color: #303133;
      font-size: 12px;
    }
    .el-button.btn {
      display: inline-flex;
      border: 0;
      width: 45%;
      height: 80px;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: #fff;
      }
      &:focus {
        background-color: #fff;
      }
    }
  }
}
</style>
