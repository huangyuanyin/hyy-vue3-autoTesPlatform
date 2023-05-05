<template>
  <div class="testDetail_wrap">
    <div class="testDetail_top">
      <el-row :gutter="20">
        <el-col class="backButton" :span="7">
          <div class="grid-content ep-bg-purple" />
          <el-button @click="router.go(-1)">返回</el-button>
          <span style="color: #303133; font-weight: 600; margin-right: 5px">{{ taskName }} </span>
          <span>{{ laneTime }}</span>
        </el-col>
        <el-col :span="11">
          <div class="grid-content ep-bg-purple" />
          <el-tabs v-model="tabName" tab-position="top" class="testDetail_tabs" @tab-change="changeTab">
            <el-tab-pane name="recentlyRun" label="最近运行"></el-tab-pane>
            <el-tab-pane name="operationHistory" label="运行历史"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="buttonList" :span="6">
          <div class="grid-content ep-bg-purple" />
          <el-button type="default" @click="toEdit()">编辑</el-button>
          <el-button type="primary" @click="toRun()">执行</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="testDetail_container">
      <RecentlyRun v-show="tabName === 'recentlyRun'" />
      <RunHistory v-show="tabName === 'operationHistory'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { getTaskInfoApi, runTaskInfoApi } from '@/api/NetDevOps/index'
import bus from '@/utils/bus.js'
import RecentlyRun from './components/RecentlyRun.vue'
import RunHistory from './components/RunHistory.vue'

const router = useRouter()
const route = useRoute()
const tabName = ref('recentlyRun')
const taskName = ref('流水线')
const laneTime = ref(new Date().toLocaleString().replace(/\//g, '-'))

const changeTab = (e: any) => {
  tabName.value = e
}

const handleRunTask = async id => {
  let res = await runTaskInfoApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务开始执行！')
  }
}

const toRun = () => {
  ElMessageBox.confirm('确定执行此流水线?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      handleRunTask(route.query.id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消执行'
      })
    })
}

const toEdit = () => {
  router.push({
    path: '/testTask/editTestTask',
    query: {
      id: route.query.id
    }
  })
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.testDetail_wrap {
  .testDetail_top {
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
    .buttonList {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        margin-right: 20px;
      }
    }
    .testDetail_tabs {
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
