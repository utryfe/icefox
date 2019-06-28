<template>
    <div class="date-picker">
        <span class="mlr20">时间粒度</span>
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
        <ice-date-picker placeholder="选择日期" v-model="modelValue" :type="selectTimeType" @change="changeDate($event)"></ice-date-picker>
    </div>
</template>
<script>
    export default {
        name:'datepicker-component',
        data(){
            return {
                modelValue:'',
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
        methods:{
            changeDate(e){
                console.log(e)
            },
            changeSelect(val){
                this.selectTimeType = val
                this.modelValue=''
            },
        },
    }
</script>
