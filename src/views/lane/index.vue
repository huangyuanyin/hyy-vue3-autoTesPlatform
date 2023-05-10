<template>
  <div class="lane_wrap">
    <div class="lane-top">
      <el-row :gutter="20">
        <el-col class="backButton" :span="7">
          <div class="grid-content ep-bg-purple" />
          <el-button @click="router.go(-1)">返回</el-button>
          <span style="color: #303133; font-weight: 600; margin-right: 5px">{{ taskName === '' ? '流水线' : taskName }} </span>
          <span>{{ laneTime }}</span>
        </el-col>
        <el-col :span="11">
          <div class="grid-content ep-bg-purple" />
          <el-tabs v-model="tabName" tab-position="top" class="lane-tabs" @tab-change="changeTab">
            <el-tab-pane name="basicInformation" label="基本信息"></el-tab-pane>
            <el-tab-pane name="processConfig" label="流程配置"></el-tab-pane>
            <el-tab-pane name="triggerSetting" label="触发设置"></el-tab-pane>
            <el-tab-pane name="variableCache" label="变量和缓存"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="saveButton" :span="6">
          <div class="grid-content ep-bg-purple" />
          <el-button v-if="!isDetail" type="default" @click="sumbitTask(true)">保存为草稿</el-button>
          <el-button v-if="!isDetail" type="primary" @click="sumbitTask(false)">保存并创建任务</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="lan-container">
      <basicInformation v-show="tabName === 'basicInformation'" @submitName="submitName" :taskName="taskName" />
      <Lane v-show="tabName === 'processConfig'" :flows="data.task_swim_lanes" />
      <TriggerSetting v-show="tabName === 'triggerSetting'" @formLabelAlign="formLabelAlign" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Lane from './lane.vue'
import basicInformation from './basicInformation/index.vue'
import TriggerSetting from './triggerSetting/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addTaskInfoApi, editTaskInfoApi, getTaskInfoApi } from '@/api/NetDevOps/index'
import bus from '@/utils/bus.js'

const router = useRouter()
const route = useRoute()
const tabName = ref('basicInformation')
const isDetail = ref(true)
const taskName = ref('')
const laneTime = ref(new Date().toLocaleString().replace(/\//g, '-'))
const oldFlows = ref(localStorage.getItem('flows'))

const data = reactive({
  name: '',
  draft: '',
  task_swim_lanes: [
    // {
    //   name: '部署',
    //   task_stages: [
    //     [
    //       {
    //         name: '串行'
    //       }
    //     ]
    //   ]
    // }
  ]
})

const changeTab = (e: any) => {
  tabName.value = e
}

const sumbitTask = type => {
  data.draft = type
  if (data.name === '') {
    return ElMessage.error('请输入任务名称')
  }
  const isName = data.task_swim_lanes.some(item => {
    return item.name === ''
  })
  if (isName) {
    return ElMessage.error('请检查是否有空的阶段名称')
  }
  if (!type) {
    let count = 0
    data.task_swim_lanes.map(item => {
      // 循环item.task_stages,判断其中的task_details的isPass是否为true，如果为true则放到count加1
      item.task_stages.map(item => {
        item.task_details.map(item => {
          if (!item.is_pass) {
            count++
          }
        })
      })
    })
    if (count > 0) {
      ElMessage.error(`流水线编排流程保存失败，流程中有${count}个未完成的配置，请检查后再次保存！`)
      return
    }
  }
  route.query.tem ? addTaskInfo() : editTaskInfo()
  console.log(`保存任务`, data)
}

const addTaskInfo = async () => {
  const { task_swim_lanes, ...params } = { ...data }
  // @ts-ignore
  params.task_detail_conf = data.task_swim_lanes.map(item => {
    return {
      name: item.name,
      details: item.task_stages.flatMap(item => {
        return [
          item.task_details.map(item => {
            return {
              name: item.name,
              plugin: item.plugin,
              dispose: item.dispose,
              is_pass: item.is_pass
              // dispose: eval(`(${item.dispose})`)
            }
          })
        ]
      })
    }
  })
  const res = await addTaskInfoApi(params)
  if (res.code === 1000) {
    ElMessage.success('任务创建成功')
    router.go(-1)
  }
}

const editTaskInfo = async () => {
  const { task_swim_lanes, ...params } = { ...data }
  // @ts-ignore
  params.task_id = Number(route.query.id)
  // @ts-ignore
  params.task_detail_conf = data.task_swim_lanes.map(item => {
    return {
      name: item.name,
      details: item.task_stages.flatMap(item => {
        return [
          item.task_details.map(item => {
            return {
              name: item.name,
              plugin: item.plugin,
              dispose: item.dispose,
              is_pass: item.is_pass
              // dispose: eval(`(${item.dispose})`)
            }
          })
        ]
      })
    }
  })
  console.log(`output->修改流水线data`, data)
  console.log(`output->修改流水线params`, params)

  const res = await editTaskInfoApi(params)
  if (res.code === 1000) {
    ElMessage.success('任务编辑成功')
    router.go(-1)
  }
}

const submitName = (e: any) => {
  data.name = e
}

const formLabelAlign = (e: any) => {
  // 循环e中的每一个值，循环data，将值赋给data
  for (const key in e) {
    if (Object.prototype.hasOwnProperty.call(e, key)) {
      const element = e[key]
      data[key] = element
    }
  }
}

const getTaskInfo = async () => {
  const params = { task_id: route.query.id }
  const res = await getTaskInfoApi(params)
  if (res.code === 1000) {
    taskName.value = res.data.name
    laneTime.value = res.data.created_time
    bus.emit('TriggerSettingData', res.data)
    data.task_swim_lanes = res.data.task_swim_lanes
  }
}

onMounted(() => {
  if (route.query.tem && route.query.tem !== 'noUse') {
    data.task_swim_lanes = JSON.parse(localStorage.getItem('taskTemplateObj'))
  }
  route.path === '/testTask/detailTestTask' ? (isDetail.value = true) : (isDetail.value = false)
  if (route.query.id) {
    getTaskInfo()
  }
})

// 路由导航守卫，离开页面前，未保存给出提示
router.beforeEach((to, from, next) => {
  if (from.name === 'EditTestTask' || from.name === 'AddTestTask') {
    if (data.task_swim_lanes.length === 0 || JSON.stringify(data.task_swim_lanes) === oldFlows.value) {
      next()
    } else {
      ElMessageBox.confirm('当前有未保存的流水线，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          next()
          data.task_swim_lanes = []
          oldFlows.value = ''
        })
        .catch(() => {
          next(false)
        })
    }
  } else {
    next()
  }
})
</script>

<style lang="scss" scoped>
.lane_wrap {
  .lane-top {
    height: 55px;
    border-bottom: 1px solid #e9edf0;
    .el-row,
    .el-col {
      height: 55px;
    }
    .backButton {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .el-button {
        margin: 0 20px;
      }
      span {
        color: #6e6e6e;
        font-size: 14px;
      }
    }
    .saveButton {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        margin-right: 20px;
      }
    }
    .lane-tabs {
      margin: 0 auto;
      :deep(.el-tabs__header) {
        height: 55px;
        margin: 0px;
      }
      :deep(.el-tabs__item, .el-tabs__nav, .el-tabs__nav-scroll, .el-tabs__nav-wrap) {
        height: 55px;
        line-height: 55px;
      }
      :deep(.el-tabs__nav-scroll) {
        display: flex;
      }
      :deep(.el-tabs__nav) {
        margin: 0 auto;
      }
      :deep(.el-tabs__nav-wrap::after) {
        display: none !important;
      }
    }
  }
}
</style>
