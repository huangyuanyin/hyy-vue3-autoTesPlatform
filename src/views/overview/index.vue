<template>
  <div class="overview-wrap">
    <div id="main" style="width: 100%; height: 85vh"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, ref, reactive, watch, nextTick } from 'vue'
import { getStatisticsApi } from '@/api/NetDevOps'

const taskCount = ref(0)
const executeCount = ref(0)
var taskType = ['草稿', '正式任务']
var taskTypeValues = reactive([])
var taskTypeColorList = ['#03c781', '#fce348']
var data = reactive([])
var itemStyle = reactive({})
var taskCountType = ['正在执行中', '执行成功', '执行失败']
var taskCountTypeValues = reactive([])
var taskCountTypeColorList = ['#03acd1', '#04cab7', '#fc2d8a']
var taskCountData = reactive([])
var itemStyleTaskCount = reactive({})
var leftCenter = ['25%', '50%']
var rightCenter = ['75%', '50%']
var radius1 = ['50%', '55%'] // 饼图
var radius3 = ['60%', '61%'] // 线圈
// 公用调整-end

const echartInit = () => {
  var myChart = echarts.init(document.getElementById('main'))
  // 指定图表的配置项和数据
  var option = {
    backgroundColor: '#0A1934',
    tooltip: {
      trigger: 'item'
    },
    title: [
      {
        text: `任务数 ${taskCount.value}`,
        x: '23%',
        y: '48%',
        textStyle: {
          color: '#559dbd',
          fontSize: 20
        }
      },
      {
        text: `执行数 ${executeCount.value}`,
        x: '73%',
        y: '48%',
        textStyle: {
          color: '#559dbd',
          fontSize: 20
        }
      }
    ],
    series: [
      // 左饼图
      {
        // 饼图圈
        type: 'pie',
        zlevel: 3,
        radius: radius1,
        center: leftCenter,
        itemStyle: itemStyle,
        labelLine: {
          show: false,
          normal: {
            length: 5,
            length2: 0,
            lineStyle: {
              color: 'transparent'
            }
          }
        },
        label: {
          normal: {
            formatter: params => {
              return '●'
            }
          }
        },
        data: data
      },
      {
        // 最外圆圈
        type: 'pie',
        zlevel: 1,
        silent: true, //取消高亮
        radius: radius3,
        center: leftCenter,
        itemStyle: {
          normal: {
            color: function (params) {
              return taskTypeColorList[params.dataIndex]
            }
          }
        },
        labelLine: {
          show: false,
          normal: {
            length: 10,
            length2: 0,
            lineStyle: {
              color: 'transparent'
            }
          }
        },
        label: {
          show: true
        },
        data: data
      },

      // 右饼图
      {
        // 饼图圈
        type: 'pie',
        zlevel: 3,
        radius: radius1,
        center: rightCenter,
        itemStyle: itemStyleTaskCount,
        labelLine: {
          show: false,
          normal: {
            length: 5,
            length2: 0,
            lineStyle: {
              color: 'transparent'
            }
          }
        },
        label: {
          normal: {
            formatter: params => {
              return '●'
            }
          }
        },
        data: taskCountData
      },
      {
        // 线圆圈
        type: 'pie',
        zlevel: 1,
        silent: true, //取消高亮
        radius: radius3,
        center: rightCenter,
        itemStyle: {
          normal: {
            color: function (params) {
              return taskCountTypeColorList[params.dataIndex]
            }
          }
        },
        labelLine: {
          show: false,
          normal: {
            length: 10,
            length2: 0,
            lineStyle: {
              color: 'transparent'
            }
          }
        },
        label: {
          show: true
        },
        data: taskCountData
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

const getStatistics = async () => {
  const res = await getStatisticsApi()
  if (res.code === 1000) {
    taskCount.value = res.data.total_task_count
    executeCount.value = res.data.execute_count
    // 任务数
    taskTypeValues = [String(res.data.draft_task_count), String(res.data.real_task_count)]
    for (var i = 0; i < taskType.length; i++) {
      data.push({
        name: taskType[i],
        value: taskTypeValues[i]
      })
    }
    data.reverse()
    itemStyle = {
      normal: {
        color: function (params) {
          return taskTypeColorList[params.dataIndex]
        }
      }
    }
    // 执行数
    taskCountTypeValues = [
      String(res.data.execute_progress_count),
      String(res.data.execute_success_count),
      String(res.data.execute_fail_count)
    ]
    for (var i = 0; i < taskCountType.length; i++) {
      taskCountData.push({
        name: taskCountType[i],
        value: taskCountTypeValues[i]
      })
    }
    itemStyleTaskCount = {
      normal: {
        color: function (params) {
          return taskCountTypeColorList[params.dataIndex]
        }
      }
    }
    echartInit()
  }
  console.log(res)
}

onMounted(async () => {
  await getStatistics()
  // await echartInit()
})
</script>

<style lang="scss" scoped></style>
