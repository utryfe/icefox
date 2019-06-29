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
  name: 'datepicker-base',
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
