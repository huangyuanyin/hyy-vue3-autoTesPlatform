<template>
  <div class="testTask-wrap">
    <div style="display: flex; justify-content: space-between">
      <!-- <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="taskTemplateDialogVisible = true"> 新建任务</el-button> -->
      <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="handleAdd('noUse')"> 新建任务</el-button>
      <div class="search-wrap">
        <el-select v-model="tag_id" placeholder="选择标签进行搜索..." multiple clearable @change="searchLane">
          <el-option :label="item.name" :value="item.id" v-for="(item, index) in labelList" :key="'labelList' + index">
            <div class="tagStyle">
              <div class="circle" :style="{ 'background-color': item.color }"></div>
              <span>{{ item.name }}</span>
            </div>
          </el-option>
        </el-select>
        <el-input
          v-model="searchKeywords.keywords"
          class="w-50 m-2"
          placeholder="输入流水线名称进行搜索..."
          :prefix-icon="Search"
          @change="searchLane"
          clearable
        />
      </div>
    </div>
    <el-table
      :data="props.taskTableData"
      border
      style="width: 100%"
      stripe
      v-loading="props.taskLoading"
      :max-height="props.maxHeight"
      class="taskTableData"
    >
      <el-table-column prop="name" label="任务名称" width="250" align="center">
        <template #default="scope">
          <span class="item-ip" v-if="scope.row.draft === false" @click="toDetail('detail', scope.row)">{{ scope.row.name }}</span>
          <span class="item-ip" style="color: #909399" v-else @click="toDetail('detail', scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="draft" label="是否草稿" align="center" width="180">
        <template #default="item">
          <el-tag v-if="item.row.draft === false" type="info">否</el-tag>
          <el-tag v-else>是</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="device_list" label="使用设备详情" align="center" width="200">
        <template #default="item">
          <span v-if="item.row.device_list.length === 0 && item.row.docker_device_list.length === 0"> - </span>
          <el-popover placement="bottom" trigger="click" popper-class="devicePopper">
            <template #reference>
              <el-tag v-if="item.row.device_list.length !== 0">使用：{{ item.row.device_list.length }}</el-tag>
              <el-tag v-if="item.row.docker_device_list.length !== 0">使用：{{ item.row.docker_device_list.length }}</el-tag>
            </template>
            <el-card class="box-card" shadow="never" v-if="item.row.device_list.length !== 0">
              <el-descriptions
                class="showServerConfig"
                :title="'设备信息' + (index + 1) + '：'"
                :column="3"
                border
                v-for="(device_list_item, index) in item.row.device_list"
                :key="'device_list' + index"
              >
                <el-descriptions-item v-for="(it, index) in device_list_item" :key="'device_list_item' + index">
                  <template #label>
                    <div class="cell-item">{{ it.label }}</div>
                  </template>
                  {{ it.value }}
                </el-descriptions-item>
              </el-descriptions>
              <el-button v-if="item.row.status !== 'in_progress'" type="warning" class="shifang" @click="handleRelease(item.row)">
                释 放
              </el-button>
            </el-card>
            <el-card class="box-card" shadow="never" v-if="item.row.docker_device_list.length !== 0">
              <el-descriptions
                class="showServerConfig"
                :title="'设备信息' + (index + 1) + '：'"
                :column="3"
                border
                v-for="(device_list_item, index) in item.row.docker_device_list"
                :key="'docker_device_list' + index"
              >
                <el-descriptions-item v-for="(it, index) in device_list_item" :key="'device_list_item' + index">
                  <template #label>
                    <div class="cell-item">{{ it.label }}</div>
                  </template>
                  {{ it.value }}
                </el-descriptions-item>
              </el-descriptions>
              <el-button v-if="item.row.status !== 'in_progress'" type="warning" class="shifang" @click="handleRelease(item.row)">
                释 放
              </el-button>
            </el-card>
          </el-popover>
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
                <li v-if="item.row.status !== 'in_progress'">
                  <el-icon v-if="item.row.status === 'wait_execute'" style="color: #000"><InfoFilled /></el-icon>
                  <el-icon v-if="item.row.status === 'not_start'" style="color: #e6a23c"><InfoFilled /></el-icon>
                  <el-icon v-if="item.row.status === 'success'" style="color: #67c23a"><CircleCheckFilled /></el-icon>
                  <el-icon v-if="item.row.status === 'fail'" style="color: #e62412"><CircleCloseFilled /></el-icon>
                  <!-- <svg-icon v-if="item.row.status === 'in_progress'" class="run-icon" iconName="icon-shuaxin"></svg-icon> -->
                  <el-icon v-if="item.row.status === 'channel'" style="color: #909399"><RemoveFilled /></el-icon>
                </li>
              </el-tooltip>
              <el-popover
                placement="top"
                :title="
                  progressType !== 'warning' ? `容器创建进度【${create_count} / ${docker_all_number}】` : '正在努力获取容器创建进度...'
                "
                :width="250"
                trigger="click"
              >
                <template #reference>
                  <li v-if="item.row.status === 'in_progress'" @click="toShowPovper(item.row)">
                    <svg-icon class="run-icon" iconName="icon-shuaxin"></svg-icon>
                  </li>
                </template>
                <template #default>
                  <div class="progress">
                    <el-progress
                      v-if="progressType !== 'warning'"
                      :percentage="Math.floor((create_count / docker_all_number) * 100)"
                      :text-inside="true"
                      :stroke-width="15"
                      :status="progressType"
                      striped
                      striped-flow
                      :duration="10"
                    />
                  </div>
                </template>
              </el-popover>
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
      <el-table-column prop="create_user" label="创建人" width="150" align="center" />
      <el-table-column prop="created_time" label="创建时间" width="200" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template #default="item">
          <div>
            <el-tooltip class="box-item" effect="dark" content="收藏" placement="top">
              <div>
                <el-icon class="starIcon" @click.stop="handleStar(true, item.row)" v-if="!item.row.is_favorite"><StarFilled /></el-icon>
              </div>
            </el-tooltip>
          </div>
          <div>
            <el-tooltip class="box-item" effect="dark" content="取消收藏" placement="top">
              <div>
                <el-icon class="noStarIcon" @click.stop="handleStar(false, item.row)" v-if="item.row.is_favorite"><StarFilled /></el-icon>
              </div>
            </el-tooltip>
          </div>
          <div>
            <el-popconfirm
              title="确定执行这个任务流水线?"
              trigger="click"
              confirm-button-text="确认执行"
              cancel-button-text="取消"
              @confirm="handleRunTask(item.row.id)"
            >
              <template #reference>
                <div>
                  <el-tooltip class="box-item" effect="dark" content="执行" placement="top">
                    <div>
                      <el-icon class="starIcon hoverIcon" v-if="!item.row.draft && item.row.status !== 'in_progress'"
                        ><VideoPlay
                      /></el-icon>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-popconfirm>
          </div>
          <div>
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
                <div style="display: flex; align-item: center">
                  <el-tooltip class="box-item" effect="dark" content="取消运行" placement="top">
                    <div>
                      <el-icon class="starIcon hoverIcon" v-if="!item.row.draft && item.row.status === 'in_progress'"
                        ><VideoPause
                      /></el-icon>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-popconfirm>
          </div>
          <div>
            <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
              <div>
                <el-icon class="starIcon hoverIcon" @click="toDetail('edit', item.row)">
                  <Edit />
                </el-icon>
              </div>
            </el-tooltip>
          </div>
          <el-dropdown trigger="click" @command="handleCommand">
            <!-- <el-tooltip class="box-item" effect="dark" content="更多" placement="top"> -->
            <el-icon class="starIcon hoverIcon"><MoreFilled /></el-icon>
            <!-- </el-tooltip> -->
            <template #dropdown>
              <el-dropdown-menu :hide-on-click="false">
                <el-dropdown-item :command="{ name: 'moveGroup', value: item.row }" v-if="item.row.status !== 'in_progress'">
                  <el-popover placement="left" :width="300" trigger="click" popper-class="moveGroupDialog" :visible="groupVisible">
                    <template #reference>
                      <el-button link type="info" size="small"> 移动分组 </el-button>
                    </template>
                    <div class="moveGroupDialog-top">
                      <span>
                        移动【<span style="color: #409eff">{{ item.row.name }}</span
                        >】流水线至
                      </span>
                      <el-icon style="cursor: pointer" @click="resetMoveGroupForm(groupFormRef)"><CloseBold /></el-icon>
                    </div>
                    <el-form
                      ref="groupFormRef"
                      :model="groupForm"
                      :rules="groupRules"
                      label-width="120px"
                      class="demo-groupForm"
                      size="default"
                      status-icon
                      label-position="top"
                    >
                      <el-form-item label="目标分组名称" prop="region">
                        <el-select v-model="groupForm.name" placeholder="请选择目标分组">
                          <el-option :label="item.name" :value="item.name" v-for="(item, index) in groupList" :key="'groupList' + index" />
                        </el-select>
                      </el-form-item>
                      <el-form-item class="moveGroupDialog-bottom">
                        <div>
                          <el-button @click="resetMoveGroupForm(groupFormRef)">取消</el-button>
                          <el-button type="primary" @click="submitMoveGroupForm(groupFormRef)"> 确定 </el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </el-popover>
                </el-dropdown-item>
                <el-dropdown-item :command="{ name: 'setLabel', value: item.row }" v-if="item.row.status !== 'in_progress'">
                  <el-popover placement="left" :width="300" trigger="click" popper-class="setLabelDialog" :visible="labelVisible">
                    <template #reference>
                      <el-button link type="info" size="small"> 设置标签 </el-button>
                    </template>
                    <div class="setLabelDialog-top">
                      <span>
                        设置【<span style="color: #409eff">{{ item.row.name }}</span
                        >】标签
                      </span>
                      <el-icon style="cursor: pointer" @click="resetLabelForm(labelFormRef)"><CloseBold /></el-icon>
                    </div>
                    <el-form
                      ref="labelFormRef"
                      :model="labelForm"
                      :rules="labelRules"
                      label-width="120px"
                      class="demo-setLabelForm"
                      size="default"
                      status-icon
                      label-position="top"
                    >
                      <el-form-item label="标签" prop="name">
                        <el-select v-model="labelForm.name" placeholder="请选择标签" multiple clearable>
                          <el-option :key="0" :value="0" disabled>
                            <div class="custom-option">
                              <el-button :icon="CirclePlus" text type="primary" size="large" class="new-label-button" @click="addTag">
                                新建标签
                              </el-button>
                            </div>
                          </el-option>
                          <el-option :label="item.name" :value="item.id" v-for="(item, index) in labelList" :key="'labelList' + index">
                            <div class="tagStyle">
                              <div class="circle" :style="{ 'background-color': item.color }"></div>
                              <span>{{ item.name }}</span>
                            </div>
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="setLabelDialog-bottom">
                        <div>
                          <el-button @click="resetLabelForm(labelFormRef)">取消</el-button>
                          <el-button type="primary" @click="submitLabelForm(labelFormRef)"> 确定 </el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </el-popover>
                </el-dropdown-item>
                <el-dropdown-item :command="{ name: 'detail', value: item.row }" v-if="item.row.run_count != 0">
                  <el-button link type="success" size="small" @click="toDetail('detail', item.row)"> 详情 </el-button>
                </el-dropdown-item>
                <el-dropdown-item :command="{ name: 'release', value: item.row }" v-if="item.row.status !== 'in_progress'">
                  <el-button link type="primary" size="small"> 释放 </el-button>
                </el-dropdown-item>
                <el-dropdown-item :command="{ name: 'delete', value: item.row }" v-if="item.row.status !== 'in_progress'">
                  <el-button link type="danger" size="small"> 删除 </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!props.taskLoading"
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
    <LabelDialog :labelDialogVisible="labelDialogVisible" @closeTagDialog="closeTagDialog" @updatePipelineTag="updatePipelineTag" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue'
import {
  CirclePlus,
  CircleCloseFilled,
  CircleCheckFilled,
  InfoFilled,
  WarningFilled,
  RemoveFilled,
  RefreshRight,
  Search,
  CloseBold,
  StarFilled,
  Edit,
  MoreFilled,
  VideoPlay,
  VideoPause
} from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import preview1 from '@/assets/preview1.png'
import preview2 from '@/assets/preview2.png'
import {
  deleteTaskInfoApi,
  runTaskInfoApi,
  stopTaskApi,
  releaseDeviceApi,
  getPipelineGroupApi,
  updateGroupTagApi,
  addPipelineTagApi,
  getPipelineTagApi,
  addFavoriteTaskApi,
  deleteFavoriteTaskApi
} from '@/api/NetDevOps/index'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import LabelDialog from '@/components/LabelDialog.vue'

const props = defineProps({
  taskTableData: {
    type: Array,
    default: () => []
  },
  taskTotal: {
    type: Number,
    default: 0
  },
  taskLoading: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: '72vh'
  },
  keywords: {
    type: Object,
    default: {}
  },
  isSocket: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:taskTotal', 'searchLane', 'update:taskTableData'])

interface User {
  id: string
  name: string
  url: string
  obj: string
}

const route = useRoute()
const router = useRouter()
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTemplateDialogVisible = ref(false)
const tag_id = ref([])
const searchKeywords = ref({
  keywords: '',
  tag_id: ''
})
const currentLaneId = ref(null)
const labelDialogVisible = ref(false)
const labelDialogTitle = ref('')
const labelDialogData = ref({})
const labelFormRef = ref<FormInstance>()
const labelForm = reactive({
  name: []
})
const labelRules = reactive<FormRules>({})
const addLabelForm = reactive({
  name: '',
  type: -1,
  color: '#1f9aef'
})
const addLabelRuleFormRef = ref<FormInstance>()

const labelList = ref([])
const labelVisible = ref(false)
const groupVisible = ref(false)
const groupList = ref([
  {
    name: '未分组',
    id: -1
  }
])
const groupFormRef = ref<FormInstance>()
const groupForm = reactive({
  name: ''
})
const groupRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请至少选择一个分组',
      trigger: 'change'
    }
  ]
})
const statusMap = {
  wait_execute: '待执行',
  not_start: '未运行',
  in_progress: '运行中',
  success: '运行成功',
  fail: '运行失败',
  channel: '已取消'
}
const colorSvgIndex = ref('#1f9aef')
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
let wsLink = import.meta.env.MODE === 'development' ? 'ws://10.4.150.27:8023' : 'ws://10.4.150.56:8023'
let socket = new WebSocket(`${wsLink}/ws/get_task_result/`)

watch(
  () => props.keywords,
  (val, oldVal) => {
    if (val !== oldVal) {
      searchKeywords.value.keywords = val
    }
  }
)

const docker_all_number = ref(0)
const create_count = ref(0)
const progressType = ref('warning')

var socket2
const toShowPovper = data => {
  docker_all_number.value = 0
  create_count.value = 0
  progressType.value = 'warning'
  // 关闭之前的ws/get_docker_progress的连接
  if (socket2 && socket2.readyState === WebSocket.OPEN) {
    // 如果WebSocket连接处于活跃状态，关闭它
    socket2.close()
  }
  // 新建一个 WebSocket 连接
  socket2 = new WebSocket(`ws://10.4.150.56:8023/ws/get_docker_progress/${data.id}`)
  socket2.onopen = function (event) {
    console.log('WebSocket连接已经建立')
  }
  socket2.onclose = function (event) {
    console.log('WebSocket连接已经关闭')
  }
  socket2.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.code === 1000) {
      docker_all_number.value = message.data.docker_all_number
      create_count.value = message.data.create_count
      if (docker_all_number.value === 0) {
        progressType.value = 'warning'
      } else if (docker_all_number.value === create_count.value) {
        progressType.value = 'success'
      } else {
        progressType.value = ''
      }
    }
  })
}

const handleCommand = item => {
  let tmp = item.value
  switch (item.name) {
    case 'moveGroup':
      handleMoveGroup(tmp)
      break
    case 'setLabel':
      toSetLabel(tmp)
      break
    case 'detail':
      toDetail('detail', tmp)
      break
    case 'release':
      handleRelease(tmp)
      break
    case 'delete':
      handleDelete(tmp)
      break
    default:
      break
  }
}

const searchLane = () => {
  taskCurrentPage.value = 1
  searchKeywords.value.tag_id = JSON.stringify(tag_id.value)
  emit('searchLane', searchKeywords.value)
}

const handleAdd = (type: String, index?: number, row?: User) => {
  const routePath = route.path.split('/')[1] === 'compTest'
  taskTemplateDialogVisible.value = false
  if (type === 'noUse') {
    router.push({
      path: '/testTask/addTestTask',
      query: {
        tem: 'noUse',
        groupId: routePath ? route.query.id : undefined
      }
    })
  } else {
    localStorage.setItem('taskTemplateObj', JSON.stringify(row.obj))
    console.log(index, row)
    router.push({ path: '/testTask/addTestTask', query: { tem: index } })
  }
}

const toSetLabel = item => {
  currentLaneId.value = item.id
  labelVisible.value = true
  getPipelineTag()
  labelDialogTitle.value = `设置【${item.name}】标签`
  labelForm.name = []
  labelForm.name = item.tag.map(it => it.id)
  labelDialogData.value = item
}

const toDetail = (type, item) => {
  if (type === 'detail') {
    if (item.draft) {
      ElMessage.warning('草稿状态无法查看详情！')
      return
    }
    if (item.run_count === 0) {
      ElMessage.warning('该任务还未执行过，无法查看详情！')
    } else {
      router.push({ path: '/testTask/detailTestTask', query: { id: item.id } })
    }
  } else {
    if (item.status === 'in_progress') {
      ElMessage.warning('任务正在执行中，无法编辑！')
      return
    }
    router.push({ path: '/testTask/editTestTask', query: { id: item.id } })
  }
}

const handleRunTask = async id => {
  let res = await runTaskInfoApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务开始执行！')
    taskCurrentPage.value = 1
    emit('update:taskTableData', 1)
  }
}

const handleEndTask = async id => {
  let res = await stopTaskApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务终止成功')
    taskCurrentPage.value = 1
    emit('update:taskTableData', 1)
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
        emit('update:taskTableData', 1)
      }
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '取消删除'
      // })
    })
}

const submitMoveGroupForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateGroupTag()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const getPipelineTag = async () => {
  let res = await getPipelineTagApi({})
  if (res.code === 1000) {
    labelList.value = res.data
  }
}

const updateGroupTag = async () => {
  const params = {
    task_id: currentLaneId.value,
    group_id: null
  }
  groupList.value.forEach(item => {
    if (item.name === groupForm.name) {
      params.group_id = item.id
    }
  })
  let res = await updateGroupTagApi(params)
  if (res.code === 1000) {
    ElMessage.success('移动成功')
    groupVisible.value = false
    taskCurrentPage.value = 1
    emit('update:taskTableData', 1)
  }
}

const updateTag = async () => {
  const params = {
    task_id: currentLaneId.value,
    tag_list: labelForm.name
  }
  let res = await updateGroupTagApi(params)
  if (res.code === 1000) {
    ElMessage.success('标签更新成功')
    taskCurrentPage.value = 1
    labelVisible.value = false
    cancelAddLabelDialog(addLabelRuleFormRef.value)
    emit('update:taskTableData', 1)
  }
}

const handleStar = (type, val) => {
  type ? addFavoriteTask(val.id) : deleteFavoriteTask(val.id)
}

const addFavoriteTask = async id => {
  const params = {
    task_id: id
  }
  let res = await addFavoriteTaskApi(params)
  if (res.code === 1000) {
    emit('update:taskTableData', taskCurrentPage.value)
  }
}

const deleteFavoriteTask = async id => {
  let res = await deleteFavoriteTaskApi(id)
  if (res.code === 1000) {
    emit('update:taskTableData', taskCurrentPage.value)
  }
}

const handleMoveGroup = val => {
  currentLaneId.value = val.id
  groupVisible.value = true
  getPipelineGroup()
  if (val.group === null) {
    groupForm.name = '未分组'
  } else {
    groupForm.name = val.group.name
  }
}

const getPipelineGroup = async () => {
  groupList.value = [
    {
      name: '未分组',
      id: -1
    }
  ]
  const params = {
    page: 1,
    page_size: 10
  }
  let res = await getPipelineGroupApi(params)
  if (res.code === 1000) {
    if (res.data.length !== 0) {
      groupList.value.splice(0, 0, ...res.data)
    }
  }
}

const resetMoveGroupForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  groupVisible.value = false
}

const resetLabelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  labelVisible.value = false
}

const submitLabelForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateTag()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const closeTagDialog = val => {
  labelDialogVisible.value = val
}

const updatePipelineTag = val => {
  labelList.value = val
}

const addTag = () => {
  labelDialogVisible.value = true
}

const cancelAddLabelDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  colorSvgIndex.value = '#1f9aef'
  labelDialogVisible.value = false
}

const handleRelease = async val => {
  ElMessageBox.confirm(`【${val.name}】此流水线下的所有设备都会释放`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let res = await releaseDeviceApi({ task_id: val.id })
      if (res.code === 1000) {
        ElMessage.success('设备释放成功!')
        taskCurrentPage.value = 1
        emit('update:taskTableData', 1)
      }
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '取消释放'
      // })
    })
}

const handleTaskSizeChange = async (val: number) => {
  // taskPageSize.value = val
  // emit('update:taskTableData', 1)
}

const handleTaskCurrentChange = async (val: number) => {
  taskCurrentPage.value = val
  emit('update:taskTableData', taskCurrentPage.value)
}

function checkWebSocketStatus() {
  if (socket.readyState === WebSocket.CLOSED) {
    console.log('WebSocket连接已经断开')
    reconnectWebSocket()
  } else {
    console.log('WebSocket连接正常')
  }
}

function reconnectWebSocket() {
  socket = new WebSocket('ws://10.4.150.56:8022/ws/get_task_result/')
  socket.onopen = function (event) {
    console.log('WebSocket连接已经重新连接')
  }
  socket.onclose = function (event) {
    console.log('WebSocket连接已经关闭')
    setTimeout(checkWebSocketStatus, 10000)
  }
}

onMounted(() => {
  getPipelineTag()
  if (props.isSocket) {
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
        emit('update:taskTableData', taskCurrentPage.value)
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
            duration: 180000
          })
        })
      }
    })
  }
  props.isSocket ? (intervalId = setInterval(checkWebSocketStatus, 10000)) : ''
})

onUnmounted(() => {
  socket.close()
  clearInterval(intervalId)
})
</script>

<style lang="scss" scoped>
:deep(.el-tooltip__trigger) {
  display: flex;
}
.noStarIcon,
.starIcon {
  font-size: 20px;
  cursor: pointer;
  width: 39px;
}
.noStarIcon {
  color: #e6a23c;
}
.starIcon:hover {
  color: #e6a23c;
}
.hoverIcon:hover {
  color: #1b9aee;
}
.testTask-wrap {
  .svg-icon {
    font-size: 18px;
    cursor: pointer;
    // margin: 0 10px;
    width: 39px;
  }
  .svg-icon:hover {
    color: #1b9aee;
  }
  margin: 20px 0 0 20px;
  .search-wrap {
    display: flex;
    justify-content: end;
    align-items: center;
    min-width: 25vw;
    .el-select {
      min-width: 300px;
    }
    .w-50 {
      margin-left: 20px;
    }
  }

  .item-ip {
    cursor: pointer;
    color: #409eff;
  }
  .el-dropdown {
    // margin-left: 12px;
    width: 39px;
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
      width: 11vh;
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
          width: 10vh;
          // padding: 0 10px;
          // box-sizing: border-box;
          // max-width: 100px;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
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
        .wait_execute {
          border: 2px solid #000 !important;
          color: #000;
          background: #000;
        }
        .channel {
          border: 2px solid #909399 !important;
          color: #909399;
          background: #909399;
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
.tagStyle {
  display: flex;
  align-items: center;
  .circle {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-right: 20px;
  }
}
</style>

<style lang="scss">
.custom-option {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  .new-label-button {
    padding-left: 0px;
    padding-top: 0px;
    font-size: 14px;
    .el-icon {
      font-size: 16px;
    }
  }
}
.labelDialog {
  .el-dialog__title {
    color: #575757;
  }
  .el-select {
    width: 50%;
  }
  .el-select-dropdown__item {
    padding-right: 0 !important;
  }
}
.moveGroupDialog {
  padding: 0px !important;
  .el-select {
    width: 100%;
  }
  .moveGroupDialog-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dae0e5;
    font-size: 16px;
    color: #575757;
    padding: 15px 20px;
  }
  .demo-groupForm {
    padding: 15px 20px;
  }
  .moveGroupDialog-bottom {
    text-align: end;
    width: 100%;
    margin-bottom: 0px;
    div {
      width: 100%;
    }
  }
}
.setLabelDialog {
  padding: 0px !important;
  .el-select {
    width: 100%;
  }
  .setLabelDialog-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dae0e5;
    font-size: 16px;
    color: #575757;
    padding: 15px 20px;
  }
  .demo-setLabelForm {
    padding: 15px 20px;
  }
  .setLabelDialog-bottom {
    text-align: end;
    width: 100%;
    margin-bottom: 0px;
    div {
      width: 100%;
    }
  }
}
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
.taskTableData {
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.devicePopper {
  width: auto !important;
  .showServerConfig {
    margin-bottom: 20px;
  }
  .shifang {
    float: right;
    margin-bottom: 15px;
  }
}
</style>
