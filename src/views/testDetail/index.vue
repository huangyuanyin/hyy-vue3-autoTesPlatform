<template>
  <div class="testDetail_wrap">
    <div class="testDetail_top">
      <el-row :gutter="20">
        <el-col class="backButton" :span="7">
          <div class="grid-content ep-bg-purple" />
          <el-button @click="router.go(-1)">返回</el-button>
          <span style="color: #303133; font-weight: 600; margin-right: 5px">{{ recentlyRunLog.name }} </span>
          <span>{{ recentlyRunLog.created_time }}</span>
        </el-col>
        <el-col :span="11">
          <div class="grid-content ep-bg-purple" />
          <el-tabs v-model="tabName" tab-position="top" class="testDetail_tabs" @tab-change="changeTab" @tab-remove="removeTab">
            <el-tab-pane name="recentlyRun" label="最近运行">
              <RecentlyRun :runResult="recentlyRunLog" />
            </el-tab-pane>
            <el-tab-pane name="operationHistory" label="运行历史">
              <RunHistory @handleClick="handleClick" :isUpdateHistory="isUpdateHistory" />
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
        <el-col class="buttonList" :span="6" v-if="tabName === 'recentlyRun'">
          <div class="grid-content ep-bg-purple" />
          <el-button type="success" @click="toReport('recent')" v-if="recentlyRunLog.status !== 'in_progress'">报告</el-button>
          <el-button type="default" @click="toEdit()" v-if="recentlyRunLog.status !== 'in_progress'">编辑</el-button>
          <el-button type="default" @click="toLook()" v-if="recentlyRunLog.status === 'in_progress'">查看</el-button>
          <el-button type="primary" @click="toRun()" :disabled="recentlyRunLog.status === 'in_progress'">执行</el-button>
        </el-col>
        <el-col class="buttonList" :span="6" v-if="tabName !== 'recentlyRun' && tabName !== 'operationHistory'">
          <div class="grid-content ep-bg-purple" />
          <el-button type="success" @click="toReport">#{{ tabName }} 报告</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-drawer v-model="reportDialogVisible" direction="rtl" size="80%" custom-class="reportDialogVisible">
    <template #header>
      <h4>{{ reportTitle }}</h4>
    </template>
    <template #default>
      <el-descriptions title="一、流水线基本信息：" :column="2" :size="size" class="baseInfo-config">
        <el-descriptions-item label="任务名称：">{{ reportData.name }}</el-descriptions-item>
        <el-descriptions-item label="执行人：">{{ reportData.create_user }}</el-descriptions-item>
        <el-descriptions-item label="执行时间：">{{ reportData.duration_time }}</el-descriptions-item>
        <el-descriptions-item label="运行结果：">
          <span
            :style="{
              color: statusColorMap[reportData.status]
            }"
          >
            {{ statusMap[reportData.status] }}
          </span>
        </el-descriptions-item>
      </el-descriptions>
      <div class="lane_config" style="font-size: 16px">二、流水线配置信息：</div>
      <div class="lane_config_items" v-for="(it, index) in reportData.task_swim_lanes_history" :key="'task_swim_lanes_history' + index">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="'阶段' + (index + 1) + '： ' + it.name" :name="it.name">
            <el-card class="box-card" v-for="(i, index) in it.task_stages_history" :key="'task_stages_history' + index" shadow="never">
              <template #header>
                <div class="card-header">
                  <span
                    :style="{
                      color: statusColorMap[i.task_details_history[0].status]
                    }"
                    >节点{{ index + 1 }}：{{ i.task_details_history[0].name }}</span
                  >
                  <el-button class="button" text type="primary">日志</el-button>
                </div>
              </template>
              <el-descriptions class="margin-top" title="一、执行结果" :column="2" :size="size" border>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">执行时长</div>
                  </template>
                  {{ i.task_details_history[0].duration_time }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">执行结果</div>
                  </template>
                  {{ i.task_details_history[0].status }}
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions class="margin-top" title="二、设备配置" :column="4" :size="size" border>
                <el-descriptions-item v-for="(a, index) in JSON.parse(i.task_details_history[0].dispose)[0].showServerConfig">
                  <template #label>
                    <div class="cell-item">{{ a.label }}</div>
                  </template>
                  {{ a.value }}
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions
                class="margin-top"
                title="三、其他配置："
                :column="4"
                :size="size"
                border
                v-if="i.task_details_history[0].plugin === 'netSignPrepare'"
              >
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">部署类型：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].deployType == 'full' ? '全量基线' : '项目基线' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">部署包名称：</div>
                  </template>
                  {{
                    JSON.parse(i.task_details_history[0].dispose)[0].deployType === 'full'
                      ? 'netsign_x10_x11'
                      : JSON.parse(i.task_details_history[0].dispose)[0].packageName
                  }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否需要进行系统还原：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].sysRest === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否需要进行设备重启：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].reboot === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否安装HA：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].ifha === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否安装人行模块：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].ispbc === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否安装农信银模块：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].isrbc === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">WatchDog是否使用新数据类型：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].useNewDataType === 'y' ? '是' : '否' }}
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions
                class="margin-top"
                title="三、其他配置："
                :column="2"
                :size="size"
                border
                v-if="i.task_details_history[0].plugin === 'netSignArrange'"
              >
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否生产部门安装：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].ifback === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">是否重启服务：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].ifrs === 'y' ? '是' : '否' }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">部署包名称：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].packageName }}
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions
                class="margin-top"
                title="三、其他配置："
                :column="2"
                :size="size"
                border
                v-if="i.task_details_history[0].plugin === 'interfaceTest'"
              >
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">NetSign接口自动化版本：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].netsignVersion }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">NetSign接口自动化分支：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].branch }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">数据包版本：</div>
                  </template>
                  {{ JSON.parse(i.task_details_history[0].dispose)[0].pendingVersion }}
                </el-descriptions-item>
              </el-descriptions>
              <div
                class="lane_config"
                style="font-size: 16px"
                v-if="i.task_details_history[0].plugin === 'interfaceTest' && i.task_details_history[0].status === 'success'"
              >
                四、测试结果：
              </div>
              <div v-if="i.task_details_history[0].plugin === 'interfaceTest' && i.task_details_history[0].status === 'success'">
                <Piechart :data="i.task_details_history[0].total_statistics" :height="400" :width="400" />
              </div>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <span class="dialog-footer">
          <el-button type="primary" @click="dowaloadReport"> 下载报告 </el-button>
        </span>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, markRaw, onUnmounted, nextTick, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { getTaskHistoryApi, getTaskInfoApi, runTaskInfoApi, getHistoryReportApi } from '@/api/NetDevOps/index'
import bus from '@/utils/bus.js'
import RecentlyRun from './components/RecentlyRun.vue'
import RunHistory from './components/RunHistory.vue'
import { downloadFile } from '@/utils/util.js'
import Piechart from './components/piechart.vue'

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
const isUpdateHistory = ref(false)
const reportDialogVisible = ref(false)
const reportTitle = ref('')
const reportData = ref({})
const reportUrl = ref('')
const tabId = ref(null)
const size = ref('')
const statusMap = {
  wait_execute: '待执行',
  not_start: '未运行',
  in_progress: '运行中',
  success: '运行成功',
  fail: '运行失败',
  channel: '已取消'
}
const statusColorMap = {
  wait_execute: '#909399',
  not_start: '#909399',
  in_progress: '#409EFF',
  success: '#67C23A',
  fail: '#F56C6C',
  channel: '#F56C6C'
}
let wsLink = import.meta.env.MODE === 'development' ? 'ws://10.4.150.27:8023' : 'ws://10.4.150.55:8023'
let socket = new WebSocket(`${wsLink}/ws/get_task_history/${route.query.id}`)
let additionalSocket = null // 新的 WebSocket 实例

const activeNames = ref([])
const handleChange = (val: string[]) => {
  console.log(val)
}

const changeTab = (e: any) => {
  tabName.value = e
  if (!['recentlyRun', 'operationHistory'].includes(tabName.value)) {
    tabList.value.map(item => {
      if (item.name === tabName.value && item.status !== 'in_progress') {
        getTaskHistoryDetail(item.id)
        tabId.value = item.id
      }
    })
  }
}

const handleRunTask = async id => {
  let res = await runTaskInfoApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务开始执行！')
    getTaskHistory()
    isUpdateHistory.value = true
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

const toReport = async (type?) => {
  console.log(`output->recentlyRunLog`, recentlyRunLog.value)
  activeNames.value = []
  reportData.value = {}
  reportDialogVisible.value = true
  if (type && type === 'recent') {
    getHistoryReport('get', recentlyRunLog.value.id)
    reportData.value = recentlyRunLog.value
    reportTitle.value = `最近运行 报告`
  } else {
    getHistoryReport('get', tabId.value)
    reportData.value = runDetailLog.value
    reportTitle.value = `#${tabName.value} 运行报告`
  }
}

const dowaloadReport = () => {
  downloadFile(reportUrl.value)
}

const getHistoryReport = async (type, id) => {
  const params = {}
  type === 'get' ? (params['task_history_id'] = id) : (params['download_id'] = id)
  let res = await getHistoryReportApi(params)
  if (res.code === 1000) {
    // reportData.value = res.data.report_data
    reportUrl.value = res.data.download_url
  }
}

const toEdit = () => {
  router.push({
    path: '/testTask/editTestTask',
    query: {
      id: route.query.id
    }
  })
}

const toLook = () => {
  router.push({
    name: 'LookTestTaskConfig',
    query: {
      id: route.query.id
    }
  })
}

const handleClick = val => {
  if (tabList.value.length >= 4) {
    ElMessage({
      type: 'warning',
      message: '最多只能查看4个历史运行记录！'
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
    recentlyRunLog.value = res.data[0]
    if (res.data[0].status === 'in_progress') {
      intervalId = setInterval(checkWebSocketStatus, 1000)
    } else {
      socket.close()
      clearInterval(intervalId)
    }
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
  socket = new WebSocket(`${wsLink}/ws/get_task_history/${route.query.id}`)
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
  additionalSocket = new WebSocket(`${wsLink}/ws/get_task_history/${id}`) // 根据需要设置 WebSocket 的 URL
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
  isUpdateHistory.value = false
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
.lane_config {
  color: #303133;

  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.lane_config_items {
  .el-collapse-item__header {
    font-size: 16px;
  }
  margin-left: 40px;
  .box-card {
    margin: 10px 10px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-descriptions {
      margin-bottom: 20px;
    }
  }
}
.report-dialog {
  .el-dialog__body {
    padding-top: 30px !important;
  }
}
.reportDialogVisible {
  .el-drawer__header {
    margin-bottom: 0px !important;
    padding-top: 0px;
  }
  .el-drawer__body {
    margin-left: 20px;
  }
  .baseInfo-config {
    .el-descriptions__body {
      margin-left: 40px;
    }
  }
  .descriptions-config {
    margin-top: 20px;
  }
  .el-collapse {
    border-bottom: none;
  }
}
</style>
