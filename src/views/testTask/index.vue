<template>
  <div class="testTask-wrap">
    <!-- <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="taskTemplateDialogVisible = true"> 新建任务</el-button> -->
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="handleAdd('noUse')"> 新建任务</el-button>
    <el-table :data="taskTableData" border style="width: 100%" stripe v-loading="taskLoading" max-height="70vh">
      <el-table-column prop="name" label="任务名称" width="250" align="center" />
      <el-table-column prop="draft" label="是否草稿" align="center" width="180">
        <template #default="item">
          <el-tag v-if="item.row.draft === false" type="info">否</el-tag>
          <el-tag v-else>是</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="任务状态" align="center" width="200">
        <template #default="item">
          <el-tag v-if="item.row.status === 'not_start'" type="warning">未运行</el-tag>
          <el-tag v-if="item.row.status === 'success'" type="success">运行成功</el-tag>
          <el-tag v-if="item.row.status === 'fail'" type="danger">已失败</el-tag>
          <el-tag v-if="item.row.status === 'in_progress'">运行中</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="最近运行状态" align="center" width="200">
        <template #default="item">
          <div class="pipe-status">
            <ul>
              <el-tooltip popper-class="box-item" effect="customized" :content="`第${item.row.run_count}次运行`" placement="top">
                <li>
                  <span>{{ item.row.run_count }}</span>
                </li>
              </el-tooltip>
              <li>-</li>
              <el-tooltip popper-class="box-item" effect="customized" :content="`${statusMap[item.row.status]}`" placement="top">
                <li>
                  <el-icon v-if="item.row.status === 'not_start'" style="color: #e6a23c"><InfoFilled /></el-icon>
                  <el-icon v-if="item.row.status === 'success'" style="color: #67c23a"><CircleCheckFilled /></el-icon>
                  <el-icon v-if="item.row.status === 'fail'" style="color: #e62412"><CircleCloseFilled /></el-icon>
                  <svg-icon v-if="item.row.status === 'in_progress'" class="run-icon" iconName="icon-shuaxin"></svg-icon>
                  <el-icon v-if="item.row.status === 'channel'" style="color: #909399"><RemoveFilled /></el-icon>
                </li>
              </el-tooltip>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最近运行阶段" align="center" prop="pipeHistory" min-width="350">
        <template #default="scope">
          <div class="pipe-history">
            <el-tooltip
              v-for="(item, index) in scope.row.run_phase"
              :key="'run_phase' + index"
              :content="`${item.name}：${statusMap[item.status]}`"
              popper-class="box-item"
              effect="customized"
              placement="top"
            >
              <div class="group-status">
                <div class="content">
                  <div class="title">{{ item.name }}</div>
                  <div class="point" :class="item.status"></div>
                </div>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template #default="item">
          <el-popconfirm
            title="确定执行这个任务流水线?"
            trigger="click"
            confirm-button-text="确认执行"
            cancel-button-text="取消"
            @confirm="handleRunTask(item.row.id)"
          >
            <template #reference>
              <el-button link type="warning" size="small" v-if="!item.row.draft && item.row.status !== 'in_progress'"> 执行 </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            title="确定取消运行这个任务流水线?"
            trigger="click"
            :icon="WarningFilled"
            icon-color="#F56C6C"
            confirm-button-text="确认取消"
            cancel-button-text="取消"
            @confirm="handleEndTask(item.row.id)"
          >
            <template #reference>
              <el-button link style="color: #ff99ff" size="small" v-if="!item.row.draft && item.row.status === 'in_progress'">
                取消
              </el-button>
            </template>
          </el-popconfirm>
          <el-button link type="success" size="small" @click="toDetail('detail', item.row)"> 详情 </el-button>
          <el-button v-if="item.row.status !== 'in_progress'" link type="primary" size="small" @click="toDetail('edit', item.row)">
            编辑
          </el-button>
          <el-dropdown>
            <el-button link type="info" size="small"> 更多 </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="item.row.status !== 'in_progress'" link type="danger" size="small" @click="handleDelete(item.row)">
                    删除
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!taskLoading"
      v-model:currentPage="taskCurrentPage"
      v-model:page-size="taskPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="taskTotal"
      @size-change="handleTaskSizeChange"
      @current-change="handleTaskCurrentChange"
    />

    <!--模板弹窗-->
    <el-dialog v-model="taskTemplateDialogVisible" title="任务模板" width="77%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="模板名称" width="100" align="center" />
        <el-table-column label="模板预览" width="1220" align="center">
          <template #default="scope">
            <el-image style="" :src="scope.row.url" fit="contain" :zoom-rate="1.2" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleAdd('use', scope.$index, scope.row)">使用此模板</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleAdd('noUse')">不使用模板，直接新建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import {
  CirclePlus,
  CircleCloseFilled,
  CircleCheckFilled,
  InfoFilled,
  WarningFilled,
  RemoveFilled,
  RefreshRight
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import preview1 from '@/assets/preview1.png'
import preview2 from '@/assets/preview2.png'
import { getTaskInfoApi, deleteTaskInfoApi, runTaskInfoApi, stopTaskApi } from '@/api/NetDevOps/index'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

interface User {
  id: string
  name: string
  url: string
  obj: string
}

const router = useRouter()
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskLoading = ref(false)
const taskTemplateDialogVisible = ref(false)
const taskTableData = ref([])
const statusMap = {
  not_start: '待运行',
  in_progress: '运行中',
  success: '运行成功',
  fail: '运行失败',
  channel: '已取消'
}
const tableData = [
  {
    id: '0',
    name: '模板一',
    url: preview1,
    obj: [
      {
        name: '部署',
        stages: [
          [
            {
              id: '10',
              name: 'NetSign环境准备'
            },
            {
              id: '11',
              name: 'NetSign项目部署'
            }
          ]
        ]
      },
      {
        name: '测试',
        stages: [
          [
            {
              id: '20',
              name: '接口测试'
            },
            {
              id: '21',
              name: 'UI测试'
            }
          ]
        ]
      },
      {
        name: '执行命令',
        stages: [
          [
            {
              id: '30',
              name: '执行命令'
            }
          ]
        ]
      },
      {
        name: '版本构建',
        stages: [
          [
            {
              id: '40',
              name: '版本构建'
            }
          ]
        ]
      }
    ]
  },
  {
    id: '1',
    name: '模板二',
    url: preview2,
    obj: [
      {
        name: '部署',
        stages: [
          [
            {
              id: '10',
              name: 'NetSign基线部署'
            },
            {
              id: '11',
              name: 'NetSign项目部署'
            }
          ]
        ]
      },
      {
        name: '测试',
        stages: [
          [
            {
              id: '20',
              name: '接口测试'
            }
          ]
        ]
      },
      {
        name: '版本构建',
        stages: [
          [
            {
              id: '40',
              name: '版本构建'
            }
          ]
        ]
      }
    ]
  }
]
let intervalId = ref(null)
const messages = ref([])
let socket = new WebSocket('ws://10.4.150.27:8021/ws/get_task_result/')

const handleAdd = (type: String, index?: number, row?: User) => {
  taskTemplateDialogVisible.value = false
  if (type === 'noUse') {
    router.push({ path: '/testTask/addTestTask', query: { tem: 'noUse' } })
  } else {
    localStorage.setItem('taskTemplateObj', JSON.stringify(row.obj))
    console.log(index, row)
    router.push({ path: '/testTask/addTestTask', query: { tem: index } })
  }
}

const toDetail = (type, item) => {
  if (type === 'detail') {
    router.push({ path: '/testTask/detailTestTask', query: { id: item.id } })
  } else {
    router.push({ path: '/testTask/editTestTask', query: { id: item.id } })
  }
}

const handleRunTask = async id => {
  let res = await runTaskInfoApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务开始执行！')
    taskCurrentPage.value = 1
    getTaskInfo()
  }
}

const handleEndTask = async id => {
  let res = await stopTaskApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务终止成功')
    taskCurrentPage.value = 1
    getTaskInfo()
  }
}

const handleDelete = async val => {
  ElMessageBox.confirm(`确定删除【${val.name}】此流水线?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let res = await deleteTaskInfoApi(val.id)
      if (res.code === 1000) {
        ElMessage.success('删除成功')
        taskCurrentPage.value = 1
        getTaskInfo()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

const getTaskInfo = async () => {
  const params = {
    page: taskCurrentPage.value,
    page_size: taskPageSize.value
  }
  taskLoading.value = true
  let res = await getTaskInfoApi(params)
  taskLoading.value = false
  if (res.code === 1000) {
    taskTableData.value = res.data || []
    taskTotal.value = res.total
  }
}

const handleTaskSizeChange = async (val: number) => {
  taskPageSize.value = val
  await getTaskInfo()
}

const handleTaskCurrentChange = async (val: number) => {
  taskCurrentPage.value = val
  await getTaskInfo()
}

socket.onopen = function (event) {
  console.log('WebSocket连接已经建立')
}

socket.onclose = function (event) {
  console.log('WebSocket连接已经关闭')
}

socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  console.log(message.data)
  if (message.code === 1000) {
    ElMessage.success('流水线执行结果更新！')
    getTaskInfo()
    message.data.map(item => {
      ElNotification({
        title: '通知',
        dangerouslyUseHTMLString: true,
        message:
          item.status === 'success'
            ? `<div>
              <div>流水线【${item.name}】<span style='color:#67c23a;font-weight:600'>执行成功<span></div>
                <div>成功时间：${item.last_mod_time}</div>
              </div>`
            : item.status === 'fail'
            ? `<div>
                <div>流水线【${item.name}】<span style='color:#f56c6c;font-weight:600'>执行失败<span></div>
                <div>最后失败时间：${item.last_mod_time}</div>
              </div>`
            : item.status === 'channel'
            ? `<div>
                <div>流水线【${item.name}】<span style='color:#909399;font-weight:600'>已取消<span></div>
                <div>取消时间：${item.last_mod_time}</div>
              </div>`
            : `<div>
                <div>流水线【${item.name}】<span style='color:#e6a23c;font-weight:600'>执行中<span></div>
                <div>执行时间：${item.last_mod_time}</div>
              </div>`,
        duration: 0
      })
    })
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
  socket = new WebSocket('ws://10.4.150.27:8021/ws/get_task_result/')
  socket.onopen = function (event) {
    console.log('WebSocket连接已经重新连接')
  }
  socket.onclose = function (event) {
    console.log('WebSocket连接已经关闭')
    setTimeout(checkWebSocketStatus, 10000)
  }
}

onMounted(() => {
  getTaskInfo()
  intervalId = setInterval(checkWebSocketStatus, 10000)
})

onUnmounted(() => {
  socket.close()
  clearInterval(intervalId)
})
</script>

<style lang="scss" scoped>
.testTask-wrap {
  margin: 20px 0 0 20px;
  .el-dropdown {
    margin-left: 12px;
  }
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
  .pipe-status {
    display: flex;
    justify-content: flex-start;
    .run-icon {
      animation: run 0.8s infinite;
    }
    @keyframes run {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    ul {
      display: flex;
      padding-left: 0px;
      justify-content: center;
      width: 100%;
      li {
        list-style: none;
        margin-right: 8px;
        .el-icon {
          height: 23px;
          line-height: 23px;
        }
      }
    }
  }
  .pipe-history {
    display: flex;
    justify-content: center;
    .group-status {
      min-width: 80px;
      display: flex;
      position: relative;
      text-align: center;
      -webkit-box-pack: center;
      -webkit-box-align: end;
      align-items: flex-end;
      margin-bottom: 5px;
      .content {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        .title {
          color: #383838;
          margin-bottom: 10px;
          // padding: 0 10px;
          // box-sizing: border-box;
          // max-width: 100px;
          // overflow: hidden; //超出的文本隐藏
          // text-overflow: ellipsis; //溢出用省略号显示
          // white-space: nowrap; //溢出不换行
        }
        .point {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 100%;
          text-align: center;
          margin: 0 auto;
        }
        .success {
          border: 1px solid #67c23a;
          color: #67c23a;
          background: #67c23a;
        }
        .fail {
          border: 1px solid #f56c6c;
          color: #f56c6c;
          background: #f56c6c;
        }
        .in_progress {
          border: 2px solid #1b9aee !important;
          color: #1b9aee;
          background: #1b9aee;
        }
        .not_start {
          border: 2px solid #e6a23c !important;
          color: #e6a23c;
          background: #e6a23c;
        }
      }
      &::after {
        content: '-';
        display: inline-block;
        width: 80px;
        color: transparent;
        border-bottom: 1px solid #e9edf0;
        vertical-align: middle;
        height: 1px;
        margin-left: -35px;
        margin-right: -45px;
        margin-bottom: 3px;
      }
      &:last-child:after {
        // width: 0;
        display: none;
      }
    }
  }
}
</style>

<style lang="scss">
.box-item {
  padding: 6px 12px !important;
  background: linear-gradient(90deg, rgb(98, 101, 111), rgb(98, 101, 111)) !important;
  color: #fff;
}

.box-item .el-popper__arrow::before {
  background: linear-gradient(45deg, #626f6f, #626f6f) !important;
  right: 0 !important;
}
.el-message--error {
  white-space: pre-line;
}
.testTask-wrap {
  .el-button--small {
    --el-button-size: 2.313131vw;
  }
}
</style>
