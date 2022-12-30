<template>
  <div id="weeklyVersion"></div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, onMounted, inject } from 'vue' // 主要

let echarts = inject('echarts') // 主要

let dataPie = [
  {
    value: 410,
    name: '已成功'
  },
  {
    value: 380,
    name: '已失败'
  },
  {
    value: 501,
    name: '已执行'
  }
]
let colorPie = ['#173852', '#0b2036', '#002e49']
let colorWrap = ['#3087d6', '#afe1ff', '#4be1ff']
let baseDataPie = [],
  baseDataWrap = []
for (var i = 0; i < dataPie.length; i++) {
  baseDataPie.push({
    value: dataPie[i].value,
    name: dataPie[i].name,
    itemStyle: {
      normal: {
        borderWidth: 50,

        borderColor: colorPie[i]
      }
    }
  })
  baseDataWrap.push(
    {
      value: dataPie[i].value,
      name: dataPie[i].name,
      itemStyle: {
        normal: {
          color: colorWrap[i],
          borderWidth: 10,
          borderColor: colorWrap[i],
          shadowBlur: 50,
          shadowColor: 'rgba(48, 135, 214, 0.3)'
        }
      }
    },
    {
      value: 10,
      name: '',
      itemStyle: {
        normal: {
          color: 'transparent',
          borderWidth: 10,
          borderColor: 'transparent'
        }
      }
    }
  )
}

const change = () => {
  const chartBox = echarts.init(document.getElementById('weeklyVersion')) // 主要

  const option = {
    backgroundColor: '',
    title: {
      text: '用例总数',
      subtext: '10,225',
      textStyle: {
        color: '#00b5f3',
        fontSize: 12
      },
      subtextStyle: {
        align: 'center',
        fontSize: 18,
        color: ['#85c7e3'],
        fontWeight: 800
      },
      x: '33%',
      y: '40%'
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{a}：{b} <br/>占比：{d}%'
    },
    legend: {
      data: ['已成功', '已失败', '已执行'],
      icon: 'vertical',
      right: '3%',
      top: 'center',
      orient: 'vertical',
      itemGap: 20,
      itemWidth: 15,
      itemHeight: 8,

      formatter: function (name) {
        let target
        for (let i = 0; i < dataPie.length; i++) {
          if (dataPie[i].name === name) {
            target = dataPie[i].value
          }
        }
        let arr = [name, target]
        return arr.join('\n')
      },
      textStyle: {
        lineHeight: 20,
        color: '#9ed2f5'
      }
    },
    grid: {
      left: '1%', // 与容器左侧的距离
      right: '1%', // 与容器右侧的距离
      top: '1%', // 与容器顶部的距离
      bottom: '1%' // 与容器底部的距离
    },
    series: [
      {
        name: '',
        type: 'pie',
        clockWise: false, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        center: ['40%', '50%'],
        radius: ['80%', '81%'],
        tooltip: {
          show: false
        },
        label: {
          normal: {
            show: false
          }
        },
        data: baseDataWrap
      },
      {
        name: '类别',
        type: 'pie',
        color: colorPie,
        selectedMode: 'single',
        radius: ['55%', '58%'],
        center: ['40%', '50%'],
        hoverAnimation: false,
        label: {
          normal: {
            show: false
          }
        },

        data: baseDataPie
      }
    ]
  }
  document.getElementById('weeklyVersion').removeAttribute('_echarts_instance_')
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

<style lang="scss" scoped>
#weeklyVersion {
  width: 100%;
  height: 90%;
}
</style>
