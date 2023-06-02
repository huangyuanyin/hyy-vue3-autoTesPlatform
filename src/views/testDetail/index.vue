<template>
  <div class="testDetail_wrap">
    <div class="testDetail_top">
      <el-row :gutter="20">
        <el-col class="backButton" :span="7">
          <div class="grid-content ep-bg-purple" />
          <el-button @click="router.go(-1)">返回</el-button>
          <span style="color: #303133; font-weight: 600; margin-right: 5px">{{ recentlyRunLog.name }} </span>
          <span>{{ laneTime }}</span>
        </el-col>
        <el-col :span="11">
          <div class="grid-content ep-bg-purple" />
          <el-tabs v-model="tabName" tab-position="top" class="testDetail_tabs" @tab-change="changeTab" @tab-remove="removeTab">
            <el-tab-pane name="recentlyRun" label="最近运行">
              <RecentlyRun :runResult="recentlyRunLog" />
            </el-tab-pane>
            <el-tab-pane name="operationHistory" label="运行历史">
              <RunHistory @handleClick="handleClick" />
            </el-tab-pane>
            <el-tab-pane :name="firstRecent" :label="'#' + firstRecent" v-if="isShowFirstRecent" closable>
              <RecentlyRun :runResult="recentlyRunLog" />
            </el-tab-pane>
            <el-tab-pane :name="item.name" :label="item.label" v-for="(item, index) in tabList" :key="'tabList' + index" closable>
              <keep-alive>
                <component
                  :is="item.component"
                  v-if="item.component != null && tabName == String(item.name)"
                  :key="tabName"
                  :runResult="runDetailLog"
                ></component>
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="buttonList" :span="6">
          <div class="grid-content ep-bg-purple" />
          <el-button type="default" @click="toEdit()" :disabled="recentlyRunLog.status === 'in_progress'">编辑</el-button>
          <el-button type="primary" @click="toRun()" :disabled="recentlyRunLog.status === 'in_progress'">执行</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, markRaw, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { getTaskHistoryApi, getTaskInfoApi, runTaskInfoApi } from '@/api/NetDevOps/index'
import bus from '@/utils/bus.js'
import RecentlyRun from './components/RecentlyRun.vue'
import RunHistory from './components/RunHistory.vue'

const router = useRouter()
const route = useRoute()
const tabName = ref('recentlyRun')
const isShowFirstRecent = ref(false)
const firstRecent = ref('')
const laneTime = ref(new Date().toLocaleString().replace(/\//g, '-'))
const tabList = ref([])
const recentlyRunLog = ref({})
const runDetailLog = ref({})
let intervalId = ref(null)
let socket = new WebSocket(`ws://10.4.150.27:8023/ws/get_task_history/${route.query.id}`)
let additionalSocket = null // 新的 WebSocket 实例

const changeTab = (e: any) => {
  tabName.value = e
  if (!['recentlyRun', 'operationHistory'].includes(tabName.value)) {
    tabList.value.map(item => {
      if (item.name === tabName.value && item.status !== 'in_progress') {
        getTaskHistoryDetail(item.id)
      }
    })
  }
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

const handleClick = val => {
  if (tabList.value.length >= 5) {
    ElMessage({
      type: 'warning',
      message: '最多只能查看5个历史运行记录！'
    })
    return
  }
  if (val.status === 'in_progress') {
    isShowFirstRecent.value = true
    firstRecent.value = val.execution_number
    tabName.value = firstRecent.value
    // createAdditionalSocket(val.task_basic_info)
  } else {
    tabName.value = val.execution_number
    let isExist = tabList.value.some(item => item.name === val.execution_number)
    if (isExist) {
      return
    } else {
      tabList.value.push({
        id: val.id,
        name: val.execution_number,
        label: '#' + String(val.execution_number),
        status: val.status
      })
      tabList.value.map(item => {
        item.component = markRaw(RecentlyRun)
      })
    }
    getTaskHistoryDetail(val.id)
  }
}

const removeTab = (e: any) => {
  const index = tabList.value.findIndex(item => item.name === e)
  if (index === -1) {
    isShowFirstRecent.value = false
  } else {
    tabList.value = tabList.value.filter(item => item.name !== e)
  }
  if (tabName.value === e) {
    tabName.value = 'recentlyRun'
  }
}

const getTaskHistoryDetail = async id => {
  const params = {
    task_history_id: id
  }
  let res = await getTaskHistoryApi(params)
  if (res.code === 1000) {
    runDetailLog.value = res.data
  }
}

const getTaskHistory = async () => {
  const params = {
    task_id: route.query.id,
    page: 1,
    page_size: 10
  }
  let res = await getTaskHistoryApi(params)
  if (res.code === 1000) {
    res.data[0].status !== 'in_progress' ? (recentlyRunLog.value = res.data[0]) : (intervalId = setInterval(checkWebSocketStatus, 1000))
  }
}

socket.onopen = function (event) {
  console.log('WebSocket连接已经建立')
}

socket.onclose = function (event) {
  console.log('WebSocket连接已经关闭')
}

socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.code === 1000) {
    recentlyRunLog.value = message.data
  }
})

function checkWebSocketStatus() {
  if (socket.readyState === WebSocket.CLOSED) {
    console.log('WebSocket连接已经断开')
    reconnectWebSocket()
  } else {
    console.log('WebSocket连接正常')
  }
}

function reconnectWebSocket() {
  socket = new WebSocket(`ws://10.4.150.27:8023/ws/get_task_history/${route.query.id}`)
  socket.onopen = function (event) {
    console.log('WebSocket连接已经重新连接')
  }
  socket.onclose = function (event) {
    console.log('WebSocket连接已经关闭')
    setTimeout(checkWebSocketStatus, 5000)
  }
}

// 新增 WebSocket 连接
function createAdditionalSocket(id) {
  additionalSocket = new WebSocket(`ws://10.4.150.27:8023/ws/get_task_history/${id}`) // 根据需要设置 WebSocket 的 URL
  additionalSocket.onopen = function (event) {
    console.log('Additional WebSocket连接已经建立')
  }
  additionalSocket.onclose = function (event) {
    console.log('Additional WebSocket连接已经关闭')
  }
  additionalSocket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.code === 1000) {
      runDetailLog.value = message.data
    }
  })
}

onMounted(() => {
  getTaskHistory()
})

onUnmounted(() => {
  socket.close()
  additionalSocket === null ? '' : additionalSocket.close() // 关闭新的 WebSocket 连接
  clearInterval(intervalId)
})
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
      :deep(.el-tabs__content) {
        width: 85vw;
        position: absolute;
        left: 12px;
      }
    }
  }
}
</style>
