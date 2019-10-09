# DatePicker 日期选择器

DatePicker 组件对 elementUI 的 datePicker 进行再封装，扩展，增加了季度类型选择

## 使用方式

### 基本使用

```vue
<template>
  <ice-date-picker
    placeholder="选择日期"
    v-model="value"
    type="quarter"
    @change="changeDate"
  ></ice-date-picker>
</template>

<script>
export default {
  data() {
    return {
      value: '',
    }
  },
  methods: {
    changeDate(e) {
      console.log(e)
    },
  },
}
</script>
```

<datepicker-base />

### 动态场景使用

```vue
<template>
  <div>
    <span>时间粒度</span>
    <el-select
      @change="changeSelect"
      style="width:100px;margin-right:10px;"
      v-model="selectTimeType"
      placeholder="请选择"
    >
      <el-option
        v-for="item in dateOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <ice-date-picker
      placeholder="选择日期"
      v-model="modelValue"
      :type="selectTimeType"
      @change="changeDate($event)"
    ></ice-date-picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modelValue: '',
      selectTimeType: 'date',
      dateOptions: [
        {
          value: 'date',
          label: '日',
        },
        {
          value: 'week',
          label: '周',
        },
        {
          value: 'month',
          label: '月',
        },
        {
          value: 'quarter',
          label: '季',
        },
      ],
    }
  },
  methods: {
    changeDate(e) {
      console.log(e)
    },
    changeSelect(val) {
      this.selectTimeType = val
      this.modelValue = ''
    },
  },
}
</script>
```

<datepicker-component />

## 常用 Attributes

具体较全 api 可以查看- [官方](https://element.eleme.cn/2.4/#/zh-CN/component/date-picker)

| 参数     |         说明         |                 类型                  |     默认值 |
| -------- | :------------------: | :-----------------------------------: | ---------: |
| readonly |       完全只读       |                boolean                |      false |
| disabled |         禁用         |                boolean                |      false |
| type     |         类型         | year/month/date/dates/week/quarter... |       date |
| format   | 显示在输入框中的格式 |                String                 | yyyy-MM-dd |

## Events

| 参数   |          说明           |   类型   |                                               默认值 |
| ------ | :---------------------: | :------: | ---------------------------------------------------: |
| change | 用户确认选定的值时触发  | Function | 组件绑定值。格式与绑定值一致，可受 value-format 控制 |
| blur   | 当 input 失去焦点时触发 | Function |                                             组件实例 |
| focus  | 当 input 获得焦点时触发 | Function |                                             组件实例 |

## 源码

- [在线源码](https://github.com/utryfe/icefox/blob/master/lib/components/PageTable/PageTable.vue)
- [在线 demo](http://www.star2018.com/datepicker)
