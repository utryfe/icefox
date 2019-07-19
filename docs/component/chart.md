# echart 使用模版
chart模版是对于业务常用echart封装的复用模版，copy相应类型可直接使用，如果有定制需求，可查看官方api
## echart安装与引用
npm install echart</br>
eg</br>
import Vue from 'vue'</br>
import echarts from 'echarts'</br>
Vue.use(echarts)

## 使用方式

### 基本配置说明
#### 模版
```vue
<template>
    <div id="myChart"></div>
</template>
```
## 常用配置 option.Attributes

完整配置项手册api 可以查看- [官方](https://www.echartsjs.com/option.html#title)

| 参数     |         说明         |                 类型                  |     默认值 |
| -------- | :------------------: | :-----------------------------------: | ---------: |
| title |       标题       |                String       |       |
| color |       主题色       |                String or Array      |      |
| legend |       图例       |                String         |   'plain'：普通图例。缺省就是普通图例。'scroll'：可滚动翻页的图例。当图例数量较多时可以使用     |
| grid |       直角坐标系内绘图网格     |           Object           |       |
| xAxis   | 直角坐标系 grid 中的 x 轴 |                Object                 |  |
| yAxis   | 直角坐标系 grid 中的 y 轴 |                Object                 |  |
| series   |绘制图表数据 |Array    |  例series[i]-bar = Object |
| tooltip |         提示框         |                Object                |       |
| toolbox     |         工具栏         | Object |内置保存为图片saveAsImage，重置restore，缩放dataZoom，类型切换magicType，自定义|

## 初始化echart
```vue
method:{
    initChart(){
        let myChart = echarts.init(document.getElementById('myChart'))
            myChart.clear()
            myChart.setOption(option)
    }
}

```
## 蒙圈点之--数据处理
点击事件callback = series.data[i]</br>
配置非常灵活，不要怕，敢于尝试
```vue
method:{
    let data = [
        {id: '1', name: '星期一', value: '10', age: '25'},
        {id: '2', name: '星期二', value: '13', age: '25'},
        {id: '3', name: '星期三', value: '3', age: '25'},
        {id: '4', name: '星期四', value: '18', age: '25'},
        {id: '5', name: '星期五', value: '6', age: '25'},
        {id: '6', name: '星期六', value: '8', age: '25'},
        {id: '7', name: '星期日', value: '20', age: '25'},
    ]
    let XData = []
    let seriesData = []
    if(Array.isArray(data)){
        data.map((item)=>{
            XData.push(item.name)
            seriesData.push({
                id:item.id,
                value:item.value,
                name:item.name,
                age:item.age
            })
        })
    }
    // 应用
    option.xAxis.data = XData
    option.series.data = seriesData 
}
    
```
## 蒙圈点之--自定义hover

```vue
tooltip: {
    trigger: 'axis',
    axisPointer: {
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter:function(params){
        let res = ''
        retrun res
    }
},
```
## 模版Bar
```vue
initBar(data) {
    let colorList = [
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
    ]
    let XData = []
    let seriesData = []
    if (Array.isArray(data)) {
        data.map((item) => {
            let {name,id,value,age} = item
            XData.push(name)
            seriesData.push({
                id: id,
                value: value,
                name: name,
                age: age
            })
        })
    }
    let option = {
        title:{
            text:'Bar Demo'
        },
        color: colorList,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        dataZoom: [{type: 'inside'}],
        toolbox: {
            show: true,
            right: 10,
            top: 0,
            itemSize: 18,
            feature: {
                myTocol: {
                    show: true,
                    title: '放大按钮',
                    icon: 'image://static/img/enLarge.png',
                    z: '999',
                    left: 'center',
                    onclick: () => {
                        console.log('放大')
                    },
                },
                saveAsImage: {title: '导出图片',show: true, icon: 'image://static/img/downLoad.png'},
                myExcel: {
                    show: true,
                    title: '导出Excel',
                    icon: 'image://static/img/excelReport.png',
                    z: '999',
                    left: 'center',
                    onclick: () => {
                        console.log('导出')
                    },
                },
                myTool: {
                    show: true,
                    title: '自定义',
                    icon: 'image://static/img/setIng.png',
                    z: '999',
                    left: 'center',
                    onclick: () => {
                        console.log('自定义')
                    },
                },
            },
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: XData,
                axisTick: {
                    alignWithLabel: true,
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: [
            {
                type: 'bar',
                barWidth: '60%',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    },
                },
                data: seriesData,
            },
        ],
    }
    this.$nextTick(function () {
        let myChart = echarts.init(document.getElementById('bar'))
        myChart.clear()
        myChart.setOption(option)
        // 点击
        myChart.on('click', function (params) {
           console.log(params)
        })
    })
},
```
## 模版line

```vue
initLine(data) {
    let colorList = [
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
    ]
    let xAxisData = []
    let seriesData = []
    data.map((item) => {
        let { value, name } = item
        xAxisData.push(name)
        seriesData.push(value)
    })
    let option = {
        title:{
            text:'Line Demo'
        },
        color: colorList,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        dataZoom: [{ type: 'inside' }],
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: seriesData,
                type: 'line',
            },
        ],
    }
    this.$nextTick(function() {
        document.oncontextmenu = function() {
            return false
        }
        let myChart = echarts.init(document.getElementById('line'))
        myChart.clear()
        myChart.setOption(option)
    })
},
```

## 模版pie

```vue
 initPie(data) {
    let seriesData = []
    data.map((item) => {
        let { value,id,name} = item
        seriesData.push({
            name: name,
            value: value,
            id:id
        })
    })

    let colorList = [
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
    ]
    let option = {
        title:{
            text:'Pie Demo'
        },
        color: colorList,
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
        },
        series: [
            {
                name: 'pie',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: seriesData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
    this.$nextTick(function() {
        document.oncontextmenu = function() {
            return false
        }
        let myChart = echarts.init(document.getElementById('pie'))
        myChart.clear()
        myChart.setOption(option)
        // 查看详情
        myChart.on('click', function(params) {
           console.log(params)
        })
    })
}
```
