<template>
  <div>
    <div id="main"></div>
  </div>
</template>

<script setup>
import { onMounted, inject, ref, watchEffect } from 'vue' // 主要

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const legendData = ref([])

watchEffect(() => {
  // 判断props.data是否为空对象
  if (JSON.stringify(props.data) !== '{}') {
    legendData.value = [
      {
        name: '成功',
        value: Number(props.data[1].value === '未统计' ? 0 : props.data[1].value),
        itemStyle: {
          color: 'rgb(70, 214, 160)'
        }
      },
      {
        name: '失败',
        value: Number(props.data[2].value),
        itemStyle: {
          color: 'rgb(248, 88, 125)'
        }
      },
      {
        name: '跳过',
        value: Number(props.data[3].value),
        itemStyle: {
          color: '#FA8c16'
        }
      }
    ]
  }
})

onMounted(() => {
  change()
})
let echarts = inject('echarts') // 主要
// 基本
const change = () => {
  const chartBox = echarts.init(document.getElementById('main')) // 主要
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      x: '55%',
      y: '28%',
      // itemWidth: 30,  // 设置宽度
      itemHeight: 15, // 设置高度
      textStyle: {
        color: '#8c8c8c',
        fontSize: 14
      },
      icon: 'circle',
      formatter: function (params) {
        var legendIndex = 0
        legendData.value.forEach(function (v, i) {
          if (v.name == params) {
            legendIndex = i
          }
        })
        return params + '    ' + legendData.value[legendIndex].value
      }
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function () {
              return `{name|总数}\n{val|${props.data[0].value}}`
            },
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  color: '#666666',
                  padding: [10, 0]
                },
                val: {
                  fontSize: 25,
                  color: '#333333'
                }
              }
            }
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: legendData.value
      }
    ]
  }
  chartBox.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    chartBox.resize()
  })
}
</script>

<style lang="scss" scoped>
#main {
  width: 50vw;
  height: 40vh;
  left: 12.5%;
}
</style>
