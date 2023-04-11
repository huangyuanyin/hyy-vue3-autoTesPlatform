<template>
  <div class="lane_wrap">
    <div class="lane-top">
      <el-row :gutter="20">
        <el-col class="backButton" :span="5">
          <div class="grid-content ep-bg-purple" />
          <el-button @click="router.go(-1)">返回</el-button>
          <span>流水线 2023-02-08</span>
        </el-col>
        <el-col :span="15">
          <div class="grid-content ep-bg-purple" />
          <el-tabs v-model="tabName" tab-position="top" class="lane-tabs" @tab-change="changeTab">
            <el-tab-pane name="basicInformation" label="基本信息"></el-tab-pane>
            <el-tab-pane name="processConfig" label="流程配置"></el-tab-pane>
            <el-tab-pane name="triggerSetting" label="触发设置"></el-tab-pane>
            <el-tab-pane name="variableCache" label="变量和缓存"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="saveButton" :span="4">
          <div class="grid-content ep-bg-purple" />
          <el-button v-if="!isTemplate" type="default" @click="sumbitTask(true)">保存为草稿</el-button>
          <el-button v-if="!isTemplate" type="primary" @click="sumbitTask(false)">保存并创建任务</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="lan-container">
      <basicInformation v-show="tabName === 'basicInformation'" @submitName="submitName" />
      <Lane v-show="tabName === 'processConfig'" :flows="data.task_detail_conf" />
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
import { ElMessage } from 'element-plus'
import { addTaskInfoApi } from '@/api/NetDevOps/index'

const router = useRouter()
const route = useRoute()
const tabName = ref('basicInformation')
const isTemplate = ref(false)
const data = reactive({
  name: '',
  draft: '',
  task_detail_conf: [
    // {
    //   name: '部署',
    //   stages: [
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
  addTaskInfo()
  console.log(`保存任务`, data)
}

const addTaskInfo = async () => {
  const params = { ...data }
  params.task_detail_conf = JSON.stringify(data.task_detail_conf)
  const res = await addTaskInfoApi(params)
  if (res.code === 1000) {
    ElMessage.success('任务创建成功')
    router.push({ path: '/task' })
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
  console.log(`output->data`, data)
}

onMounted(() => {
  if (route.query.id === '0' || route.query.id === '1') {
    isTemplate.value = true
    data.task_detail_conf = JSON.parse(localStorage.getItem('taskTemplateObj'))
  } else {
    isTemplate.value = false
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
