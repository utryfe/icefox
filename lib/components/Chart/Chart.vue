<template>
    <div>
        <div id="bar"></div>
    </div>
</template>


<script>
  const colorList = [
    '#1890FF',
    '#41D9C7',
    '#2FC25B',
    '#FACC14',
    '#E6965C',
    '#223273',
    '#7564CC',
    '#8543E0',
    '#5C8EE6',
    '#13C2C2',
    '#5CA3E6',
    '#3436C7',
    '#B381E6',
    '#F04864',
    '#D598D9',
  ];
  import 'echarts'
  export default {
    name: 'Chart',
    data(){
      return{
        options:{
          color: colorList,
          title: {
            text: '',
            textStyle: {
              fontSize: 14,
              align: 'center',
            },
            subtextStyle: {
              align: 'center',
            },
          },
          grid: {
            top: '2%',
            left: '5%',
            right: '5%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis : [
            {
              type : 'category',
              data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'直接访问',
              type:'bar',
              barWidth: '60%',
              data:[10, 52, 200, 334, 390, 330, 220]
            }
          ]
        },
        barOptions:{},
      }
    },
    created(){
      this.initBar()
    },
    methods:{
        initBar(){
          let _this = this
          let option = {
            color: ['#3398DB'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
              }
            ]
          }
          this.$nextTick(function() {
            document.oncontextmenu = function() {
              return false
            }
            let myChart = _this.$echarts.init(document.getElementById('bar'))
            myChart.clear()
            myChart.setOption(option)
            // 查看详情
            myChart.on('click', function(params) {
              console.log(params)
            })
          })
        },
    },
  }
</script>

<style scoped>

</style>
