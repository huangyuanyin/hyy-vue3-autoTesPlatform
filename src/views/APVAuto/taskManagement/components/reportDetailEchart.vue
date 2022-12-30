<template>
  <div class="reportDetailEchart-wrap" id="reportDetailEchart" style="width: 942px; height: 300px"></div>
</template>

<script lang="ts" setup>
import { onMounted, inject, defineProps } from 'vue'
let echarts: any = inject('echarts')

const props = defineProps({
  reportDetailData: {
    type: Object,
    default: () => {}
  }
})

onMounted(() => {
  init()
})

const init = () => {
  const chartBox = echarts.init(document.getElementById('reportDetailEchart'))
  var seriesdata1 = [
    { name: '成功数', value: props.reportDetailData.success || 0 },
    { name: '失败数', value: props.reportDetailData.fail_cases },
    { name: '完成数', value: props.reportDetailData.counts }
  ]
  var colorList = [
    '#407AFB',
    '#1791FF',
    '#36B0FE',
    '#6635EF',
    '#73ACFF',
    '#41CBAB',
    '#7BDD43',
    '#FFC653',
    '#FF6519',
    '#EE3939',
    '#FFAFDA',
    '#00FFFF'
  ]

  var objData = array2obj(seriesdata1, 'name')

  //将合计值转换为数组
  var h = String(props.reportDetailData.counts || 0)
  let arr = h.split('')
  let m = ''

  arr.forEach((item, i) => {
    m += '{a|' + arr[i] + '}'
    if (i != arr.length - 1) {
      m += '  '
    }
  })

  const option = {
    backgroundColor: '#051F54',
    animation: false, // 取消动画
    grid: {
      x: '30%',
      y: '3%',
      x2: '5%',
      y2: '5%',
      borderWidth: 1,
      borderColor: '#f0f0f0'
    },
    title: [
      {
        show: true,
        // text: '{a|}{b|数量}{c|占比}',
        text: '{a|}{b|数量}',
        top: '40%',
        left: '60%',
        textStyle: {
          rich: {
            a: {
              align: 'center',
              fontSize: 16,
              color: 'rgba(255,255,255,1)',
              width: 20,
              padding: [0, 0, 0, 20]
            },
            b: {
              align: 'center',
              fontSize: 16,
              color: 'rgba(255,255,255,1)',
              width: 5,
              padding: [0, 0, 0, 70]
            },
            c: {
              align: 'center',
              fontSize: 16,
              color: 'rgba(255,255,255,1)',
              width: 5,
              padding: [0, 0, 0, 45]
            }
          }
        }
      },
      {
        text: '{b|用例数：}' + m,
        left: '70%',
        top: '10%',
        textAlign: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: '24',
          color: '#FFFFFF',
          textAlign: 'center',
          rich: {
            a: {
              fontSize: '24',
              fontWeight: 'bold',
              backgroundColor: 'rgba(56,89,255,0.2)',
              borderColor: 'rgba(56,211,255,1)',
              borderWidth: 1,
              padding: [10, 6, 6, 6],
              shadowColor: 'rgba(56,211,255,1)',
              shadowBlur: 3,
              borderRadius: 3
            },
            b: {
              fontSize: '24',
              fontWeight: 'bold',
              padding: [6, 6, 3, 6],
              color: '#FFFFFF'
            }
          }
        }
      }
    ],
    legend: {
      show: true,
      //icon: 'circle',
      orient: 'vertical',
      top: '50%',
      left: '59.4%',
      itemGap: 15,
      itemWidth: 20,
      itemHeight: 12,
      data: seriesdata1,
      formatter: function (name) {
        // return '{a|' + name + '}{b|' + objData[name].value.toFixed(0) + '}{c|' + (objData[name].value / props.reportDetailData.counts) + '%}'
        return '{a|' + name + '}{b|' + objData[name].value.toFixed(0) + '}'
      },
      selected: {
        完成数: false
      },
      textStyle: {
        rich: {
          a: {
            align: 'center',
            fontSize: 14,
            color: 'rgba(255,255,255,1)',
            width: 20,
            //fontWeight: 600,
            padding: [0, 0, 0, 10]
          },
          b: {
            align: 'center',
            fontSize: 14,
            color: 'rgba(255,255,255,1)',
            width: 5,
            //fontWeight: 600,
            padding: [0, 0, 0, 60]
          },
          c: {
            align: 'center',
            fontSize: 14,
            color: 'rgba(255,255,255,1)',
            width: 5,
            //fontWeight: 600,
            padding: [0, 0, 0, 50]
          }
        }
      }
    },
    series: {
      type: 'pie',
      center: ['30%', '50%'],
      radius: ['40%', '70%'],
      clockwise: true,
      //startAngle: 50,
      avoidLabelOverlap: true,
      hoverOffset: 15,
      itemStyle: {
        normal: {
          color: function (params) {
            return colorList[params.dataIndex]
          }
        }
      },
      label: {
        show: true,
        position: 'outside',
        formatter: function (data) {
          // return '\n{icon|}\n' + '{name|' + data.name + "}" + " {value|" + data.value.toFixed(0) + " ," + data.percent.toFixed(0) + "%}";
          return '\n{icon|}\n' + '{name|' + data.name + '}' + ' {value|' + data.value.toFixed(0) + '}'
        },
        //padding: [-40, -90, -20, -80],
        rich: {
          icon: {
            height: 5,
            width: 5,
            lineHeight: 5,
            //marginBottom: 10,
            padding: [0, -5],
            borderRadius: 5,
            backgroundColor: 't' // 圆点颜色和饼图块状颜色一致
          },
          name: {
            fontSize: 14,
            padding: [-10, 100, -20, -70],
            color: '#ffffff'
          },
          value: {
            fontSize: 14,
            padding: [-10, -90, -20, -100],
            color: '#ffffff'
          }
        }
      },
      labelLine: {
        show: false,
        normal: {
          length: 10,
          length2: 90,
          align: 'right',
          lineStyle: {
            width: 1
          }
        }
      },
      data: seriesdata1,
      seriesIndex: 0
    }
  }
  function array2obj(array, key) {
    var resObj = {}
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i]
    }
    return resObj
  }
  document.getElementById('reportDetailEchart').removeAttribute('_echarts_instance_')
  chartBox.setOption(option, true)
  chartBox.on('legendselectchanged', function (params) {
    chartBox.setOption({
      legend: { selected: { 完成数: false } }
    })
    console.log('点击了', params.name)
  })
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', function () {
    chartBox.resize()
  })
}
</script>

<style scoped>
.reportDetailEchart-wrap {
  margin-bottom: 20px;
}
</style>
