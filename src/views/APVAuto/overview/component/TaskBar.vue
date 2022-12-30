<template>
  <div id="TaskBar"></div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, onMounted, inject } from 'vue' // 主要

let echarts = inject('echarts') // 主要

// 基本柱形图
const change = () => {
  const chartBox = echarts.init(document.getElementById('TaskBar')) // 主要

  const option = {
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params) {
        return (
          params[0].name +
          '<br/>' +
          "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
          params[0].seriesName +
          ' : ' +
          Number((params[0].value.toFixed(4) / 10000).toFixed(2)).toLocaleString() +
          '<br/>'
        )
      }
    },
    backgroundColor: '',
    xAxis: {
      show: false,
      type: 'value'
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: ['成功任务总数', '失败任务总数']
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: '12'
          },
          formatter: function (value) {
            if (value >= 10000) {
              return (value / 10000).toLocaleString() + '万'
            } else {
              return value.toLocaleString()
            }
          }
        },
        data: [5000, 2200]
      }
    ],
    series: [
      {
        name: '总数',
        type: 'bar',
        zlevel: 1,
        itemStyle: {
          normal: {
            barBorderRadius: 30,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: 'rgb(57,89,255,1)'
              },
              {
                offset: 1,
                color: 'rgb(46,200,207,1)'
              }
            ])
          }
        },
        barWidth: 20,
        data: [50000000, 22000000, 10000000, 5000000, 1]
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: 20,
        barGap: '-100%',
        data: [50000000, 50000000, 50000000, 50000000, 1],
        itemStyle: {
          normal: {
            color: 'rgba(3, 14, 70, 0.5)',
            barBorderRadius: 30
          }
        }
      }
    ]
  }
  document.getElementById('TaskBar').removeAttribute('_echarts_instance_')
  chartBox.setOption(option, true)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    chartBox.resize()
  })
}

onMounted(async () => {
  await change()
})
</script>

<style scoped lang="scss">
#TaskBar {
  width: 100%;
  min-height: 50%;
}
</style>
