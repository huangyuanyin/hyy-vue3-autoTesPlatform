<template>
  <div class="RecentlyRun-wrap">
    <section class="recentlyRun-top">
      <div class="recentlyRun-top-left">
        <div class="left-label">
          <span class="build-num"> # {{ props.runResult.execution_number }}</span>
          <div class="status-label">
            <svg-icon
              class="status-icon"
              :class="[props.runResult.status === 'in_progress' ? 'run-icon' : '']"
              :iconName="iconType[props.runResult.status]"
              style="font-size: 16px; margin-right: 8px"
            ></svg-icon>
            <span>{{ contentType[props.runResult.status] }} </span>
          </div>
        </div>
        <div class="left-info">
          <span class="info-label">触发信息</span>
          <div class="instance-trigger-info">
            <div class="title">{{ props.runResult.create_user }}</div>
            &nbsp;•&nbsp;手动触发
          </div>
          <div class="info-divider"></div>
          <span class="info-label">开始时间</span>
          <span>{{ props.runResult.created_time }}</span>
          <div class="info-divider"></div>
          <span class="info-label">持续时间</span>
          <span>{{ props.runResult.duration_time }}</span>
          <el-tooltip
            popper-class="box-item"
            effect="customized"
            content="流水线从开始运行到运行结束的间隔时长，并非流水线实际的耗时"
            placement="top"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="recentlyRun-top-right">
        <ul class="info-list">
          <li v-for="(item, index) in infoList" :key="'infoList' + index">
            <div class="info-item">
              <span class="item-num">{{ item.num }}</span>
              <span class="item-title">{{ item.title }}</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <div class="pipeline-instance">
      <div class="pipeline-instance__content">
        <div class="flow-groups" v-for="(item, index) in groups" :key="'group' + index">
          <div class="flow-group">
            <div class="group-head">{{ item.name }}</div>
            <div
              class="stages"
              :class="[
                groups.length === 1 ? 'only-stages' : '',
                index === 0 && groups.length !== 1 ? 'first-stages' : '',
                index === groups.length - 1 && groups.length !== 1 ? 'last-stages' : ''
              ]"
            >
              <div
                v-for="(e, index2) in item.task_stages_history"
                :key="'task_stages_history' + index2"
                :class="[
                  item.task_stages_history.length === 1 ? 'only-card' : '',
                  index2 === 0 && item.task_stages_history.length !== 1 ? 'first-card' : '',
                  index2 === item.task_stages_history.length - 1 && item.task_stages_history.length !== 1 ? 'last-card' : ''
                ]"
              >
                <div class="stage">
                  <div
                    class="card"
                    :class="[it.plugin !== 'interfaceTest' && it.status !== 'success' ? cardTyp[it.status] : 'interfaceTest_card']"
                    v-for="(it, index) in e.task_details_history"
                    :key="'task_details_history' + index"
                  >
                    <div class="content-job" @click="toLookTestTaskConfig">
                      <div class="job-card">
                        <el-tooltip popper-class="box-item" effect="customized" :content="contentType[it.status]" placement="top">
                          <svg-icon
                            class="status-icon"
                            :class="[it.status === 'in_progress' ? 'run-icon' : '']"
                            :iconName="iconType[it.status]"
                            className="icon"
                            style="width: 24px"
                          ></svg-icon>
                        </el-tooltip>
                        <div class="card-content" :class="[cardTyp[it.status]]">
                          <div class="card-title">{{ it.name }}</div>
                          <div class="success-comp" v-if="it.status === 'success'">
                            <div class="card-info">
                              <span>{{ it.duration_time }}</span>
                              <div class="operate">
                                <div class="report">
                                  <!-- <el-icon><Document /></el-icon> <span>扫描报告</span> -->
                                </div>
                                <ConfigDetail :id="it.id" />
                                <div class="log" @click.stop="handleLog(it)">
                                  <el-icon><Document /></el-icon><span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="docker-message" v-if="it.plugin === 'dockerDeployment'">
                              <div>docker容器数：{{ JSON.parse(it.dispose)[0].number }}</div>
                              <div class="view" @click="viewDocker(it)">
                                <el-icon><View /></el-icon>查看
                              </div>
                            </div>
                            <div class="card-num" v-if="it.plugin === 'interfaceTest'">
                              <div class="stat-info">
                                <div class="stat-info-item" v-for="(item, index) in it.total_statistics" :key="'total_statistics' + index">
                                  <!-- <el-popover
                                    placement="top"
                                    :width="500"
                                    trigger="click"
                                    @show="getClassName(item, it.id)"
                                    :disabled="statList[item.name] === '总数'"
                                  > -->
                                  <!-- <template #reference> -->
                                  <div class="stat-info-item-value" :class="[statColor[item.name]]" @click="getClassName(item, it)">
                                    {{ item.value }}
                                  </div>
                                  <!-- </template> -->
                                  <!-- <el-table
                                      :data="tableData"
                                      v-loading="tableDataLoading"
                                      max-height="30vh"
                                      :span-method="objectSpanMethod"
                                    >
                                      <el-table-column width="150" property="project_name" label="项目名称" />
                                      <el-table-column width="250" property="class_name" label="class_name" />
                                      <el-table-column label="操作">
                                        <template #default="scope">
                                          <el-button size="small" type="primary" @click.stop="getMethods(scope.row, item.name, it)"
                                            >查看</el-button
                                          >
                                        </template>
                                      </el-table-column>
                                    </el-table>
                                    <el-pagination
                                      class="tableDataPage"
                                      v-model:current-page="tableDataCurrentPage"
                                      :page-size="tableDataPageSize"
                                      small="small"
                                      layout="total, prev, pager, next"
                                      :total="tableDataTotal"
                                      @size-change="handleTableDataSizeChange"
                                      @current-change="handleTableDataCurrentChange"
                                    /> -->
                                  <!-- </el-popover> -->
                                  <div class="stat-info-item-desc">{{ statList[item.name] }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="fail-comp" v-if="it.status === 'fail'">
                            <div class="card-info">
                              <span>{{ it.duration_time }}</span>
                              <div class="operate">
                                <ConfigDetail :id="it.id" />
                                <div class="log" @click.stop="handleLog(it)">
                                  <el-icon><Document /></el-icon><span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="message">
                              <div>运行失败，请查看日志！</div>
                            </div>
                            <div class="button" v-if="it.status === 'fail' && it.plugin === 'interfaceTest'" @click.stop="handleRun(it)">
                              <div>重试</div>
                            </div>
                          </div>
                          <div class="run-comp" v-if="it.status === 'in_progress'">
                            <div class="card-info">
                              <span>{{ it.duration_time }}</span>
                              <div class="operate">
                                <ConfigDetail :id="it.id" />
                                <div class="log" @click.stop="handleLog(it)">
                                  <el-icon><Document /></el-icon> <span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="message">
                              <div>运行中...</div>
                            </div>
                            <!-- <div class="button" @click="handleChannel(it)">
                              <div>取消</div>
                            </div> -->
                          </div>
                          <div class="channel-comp" v-if="it.status === 'channel'">
                            <div class="card-info">
                              <span>{{ it.duration_time }}</span>
                              <div class="operate">
                                <ConfigDetail :id="it.id" />
                                <div class="log" @click.stop="handleLog(it)">
                                  <el-icon><Document /></el-icon> <span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="message">
                              <div>用户已取消</div>
                            </div>
                            <div class="button" @click.stop="handleRun(it)">
                              <!-- <div>重试</div> -->
                            </div>
                          </div>
                          <div class="wait-comp" v-if="it.status === 'wait_execute'">
                            <div class="time">
                              <div>0s</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-group-splitline" v-if="index !== groups.length - 1">
            <div
              style="width: 10px; height: 10px; position: absolute; top: 13.5%; left: 40%; border-radius: 50%; background-color: #dbdbdb"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="logDialog"
      :title="logTitle"
      custom-class="logDialog"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <CodeMirror :code="log" :codeStyle="{ height: '60vh' }" />
    </el-dialog>
    <el-dialog
      v-model="methodsDialog"
      custom-class="methodsDialog"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div class="left">
            <h4 :id="titleId" :class="titleClass">{{ methodsTitle }}</h4>
            <span :class="[statColor[classNameTitle]]">
              【 <span>{{ statList[classNameTitle] }}用例</span> 】
            </span>
          </div>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </template>
      <el-table :data="methodsData" border style="width: 100%; margin-top: 20px" v-loading="methodsDataLoading" max-height="50vh">
        <el-table-column prop="method_name" label="方法名称" />
        <el-table-column prop="case_param" label="参数" />
        <el-table-column prop="exception_details" label="错误说明" />
        <el-table-column prop="case_description" label="描述" />
      </el-table>
      <el-pagination
        class="methodsDataPage"
        v-model:current-page="methodsDataCurrentPage"
        :page-size="methodsDataPageSize"
        small="small"
        layout="total, prev, pager, next"
        :total="methodsDataTotal"
        @current-change="handleMethodsDataCurrentChange"
      />
    </el-dialog>
    <el-dialog
      v-model="caseDialog"
      custom-class="caseDialog"
      width="60%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div class="left">
            <h4 :id="titleId" :class="titleClass">{{ interfaceTitle }}</h4>
            <span :class="[statColor[classNameTitle]]">
              【 <span>{{ statList[classNameTitle] }}用例</span> 】
            </span>
          </div>
          <div>
            <el-button type="success" v-show="!fullcen" @click="handleDialogFullcen">
              <el-icon class="el-icon--left"><FullScreen /></el-icon>
              全屏
            </el-button>
            <el-button type="info" v-show="fullcen" @click="handleDialogFullcen">
              <el-icon class="el-icon--left"><FullScreen /></el-icon>
              还原
            </el-button>
            <el-button type="danger" @click="close2">
              <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
              关闭
            </el-button>
          </div>
        </div>
      </template>
      <div class="demo-collapse" v-if="caseList.length !== 0">
        <el-collapse accordion @change="changeCollapse">
          <el-collapse-item :name="item.provider_name" v-for="(item, index) in caseList" :key="'caseList' + index">
            <template #title>
              <div>
                <span style="color: #409eff">{{ item.provider_name }}</span>
                <el-tag style="margin-left: 1vw">{{ item.provider_count }}</el-tag>
              </div>
            </template>
            <div>
              <el-table
                :data="item.class_data"
                style="width: 100%"
                @expand-change="getMethods2"
                stripe
                :row-key="row => row.class_key"
                :expand-row-keys="defaultExpandedKeys"
                @row-click="getMethods2"
                highlight-current-row
                max-height="80vh"
              >
                <el-table-column type="expand">
                  <template #default="props">
                    <div m="4" class="classData">
                      <h3 :class="[statColor[classNameTitle]]">Methods：{{ methodsData.length }}</h3>
                      <el-table
                        :data="methodsData"
                        max-height="70vh"
                        :border="true"
                        style="width: 100%"
                        v-if="classNameTitle !== 'success_count'"
                      >
                        <el-table-column label="方法名称" prop="method_name" width="220px" />
                        <el-table-column label="参数" prop="case_param" min-width="220px" />
                        <el-table-column label="错误说明" prop="exception_details" min-width="220px" />
                        <el-table-column label="描述" prop="case_description" width="250px" />
                      </el-table>
                      <el-table :data="methodsData" max-height="70vh" :border="true" style="width: 100%" v-else>
                        <el-table-column label="方法名称" prop="method_name" min-width="200px" />
                        <el-table-column label="总数" prop="count" />
                      </el-table>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="项目名称" prop="project_name" />
                <el-table-column label="测试类名称" prop="class_name" />
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-empty class="empty" description="数据加载中，请稍后......" v-else />
    </el-dialog>
    <el-drawer custom-class="dockerDrawer" v-model="dockerDrawer" :title="dockerDrawerTitle" direction="rtl" size="55%">
      <el-table :data="dockerNumDeatil" stripe>
        <el-table-column property="docker_name" label="容器名" width="200" />
        <el-table-column property="bridge_name" label="网口名" width="150" />
        <el-table-column property="ipaddress" label="网口IP" width="200" />
        <el-table-column property="gateway" label="子网掩码" width="200" />
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small"> 在线终端 </el-button>
            <el-button link type="success" size="small" @click="uploadFile(scope.row)"> 文件上传 </el-button>
            <el-button link type="warning" size="small" @click="getLog(scope.row)"> 日志列表 </el-button>
            <el-button link type="" size="small" @click="runShell(scope.row)"> 脚本执行 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="dockerCurrentPage"
        v-model:page-size="dockerPageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, prev, pager, next, jumper"
        :total="dockerTotal"
        @size-change="handleDockerSizeChange"
        @current-change="handleDockerCurrentChange"
      />
      <el-drawer v-model="logDrawer" :title="logDrawerTitle" :append-to-body="true" :before-close="handleCloseLogDrawer">
        <el-table :data="logDrawerList" stripe>
          <el-table-column property="id" label="id" width="80" />
          <el-table-column property="created_time" label="创建时间" width="170" />
          <el-table-column property="last_mod_time" label="修改时间" width="170" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="viewLog(scope.row)"> 日志 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
    </el-drawer>
    <el-dialog v-model="dockerFileDialog" :title="dockerFileDialogTitle" width="40%">
      <el-form :model="dockerFileForm" ref="dockerFileFormRef" :rules="dockerFileFormRules">
        <el-form-item label="docker地址" label-width="120px" prop="docker_path">
          <el-input v-model="dockerFileForm.docker_path" placeholder="/home/" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文件上传" label-width="120px" prop="upload_file">
          <el-upload
            class="upload-docker-file"
            drag
            action=""
            :auto-upload="false"
            v-model:file-list="dockerFileList"
            multiple
            :on-change="handleChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽文件至此处或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">* 可上传多个文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDockerFile(dockerFileFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="submitDockerFile(dockerFileFormRef)"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="文件上传中..."
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { CircleCloseFilled, QuestionFilled, View, Document, FullScreen, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
// @ts-ignore
import CodeMirror from '@/components/CodeMirror.vue'
import ConfigDetail from './ConfigDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getClassNameApi,
  getMethodsApi,
  getDockerNameseApi,
  getDockerLogsApi,
  runDockerShellApi,
  supplyDockerPackageApi
} from '@/api/NetDevOps'

const props = defineProps({
  runResult: {
    type: Object,
    default: () => {}
  }
})

const route = useRoute()
const router = useRouter()
const tableData = ref([])
const tableDataLoading = ref(false)
const dockerDrawer = ref(false)
const dockerDrawerTitle = ref('')
const dockerCurrentPage = ref(1)
const dockerPageSize = ref(10)
const dockerTotal = ref(0)
const dockerFileDialog = ref(false)
const dockerFileDialogTitle = ref('')
const dockerFileForm = reactive({
  task_detail_history_id: null,
  docker_path: '/home/',
  docker_name: '',
  upload_file: []
})
const dockerFileFormRef = ref<FormInstance>()
const dockerFileFormRules = reactive<FormRules>({
  docker_path: [{ required: true, message: '请输入docker地址', trigger: 'blur' }],
  upload_file: [{ required: true, message: '请至少选择一个文件上传', trigger: 'blur' }]
})
const dockerFileList = ref<UploadUserFile[]>([])
const fullscreenLoading = ref(false)
const logDrawer = ref(false)
const logDrawerTitle = ref('')
const logDrawerList = ref([])
const logDialog = ref(false)
const logTitle = ref('')
const methodsDialog = ref(false)
const methodsTitle = ref('')
const interfaceTitle = ref('')
const caseDialog = ref(false)
const classNameTitle = ref('')
const tableDataCurrentPage = ref(1)
const tableDataPageSize = ref(5)
const tableDataTotal = ref(0)
const methodsData = ref([])
const methodsDataCurrentPage = ref(1)
const methodsDataPageSize = ref(20)
const methodsDataTotal = ref(0)
const methodsDataLoading = ref(false)
const fullcen = ref(false)
const log = ref('暂无日志...')
const cardTyp = {
  success: 'success-card',
  fail: 'fail-card',
  in_progress: 'run-card',
  wait_execute: 'wait-card',
  channel: 'channel-card'
}
const iconType = {
  success: 'icon-zhengque',
  fail: 'icon-cuowu',
  in_progress: 'icon-shuaxin',
  wait_execute: 'icon-shijian',
  channel: 'icon-cuowu'
}
const contentType = {
  success: '运行成功',
  fail: '运行失败',
  in_progress: '运行中',
  wait_execute: '等待中',
  channel: '已取消'
}
const infoList = ref([
  { title: '代码变更', num: 0 },
  { title: '运行产物', num: 0 },
  { title: '环境变量', num: 7 }
])
const statList = ref({
  count: '总数',
  success_count: '成功',
  failed_count: '失败',
  skipped_count: '跳过'
})
const statColor = {
  count: 'total',
  success_count: 'success',
  failed_count: 'serious',
  skipped_count: 'yiban'
}
const statName = {
  success_count: 'SUCCESS',
  failed_count: 'FAILED',
  skipped_count: 'SKIPPED'
}
const groups = ref([])
const currentCollpose = ref(null)
const currentItem = ref(null)
const currentId = ref(null)
const currentMethodsItem = ref(null)
const currentMethodsId = ref(null)
const currentMethodsType = ref(null)
const currentLogVal = ref(null)
const caseList = ref([])
const defaultExpandedKeys = ref([])
const dockerNumDeatil = ref([])
const dockerDrawerId = ref(null)

watch(
  () => props.runResult,
  val => {
    groups.value = val.task_swim_lanes_history || []
    if (currentLogVal.value && currentLogVal.value['status'] === 'in_progress' && logDialog.value) {
      groups.value.map((item: any) => {
        item.task_stages_history.map((it: any) => {
          it.task_details_history.map((i: any) => {
            if (i.id === currentLogVal.value['id']) {
              log.value = i.task_execute_record[0].execute_record
            }
          })
        })
      })
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.runResult.task_swim_lanes_history,
  val => {
    if (props.runResult.task_swim_lanes_history) {
      props.runResult.task_swim_lanes_history.map((item: any) => {
        item.task_stages_history.map((it: any) => {
          it.task_details_history.map((i: any) => {
            if (i.status === 'success' && i.plugin === 'interfaceTest') {
              i.total_statistics = Object.entries(i.total_statistics).map(([key, value]) => ({
                name: key,
                value: String(value)
              }))
            }
          })
        })
      })
    }
  },
  {
    immediate: true
  }
)

const handleChannel = (item: any) => {
  ElMessage.warning('取消')
}

const handleLog = (item: any) => {
  log.value = '暂无日志...'
  logDialog.value = true
  logTitle.value = item.name
  currentLogVal.value = item
  if (item.status !== 'in_progress') {
    log.value = item.task_execute_record[0].execute_record
  }
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  console.log(`output->2323`, row, column, rowIndex, columnIndex)
  if (columnIndex === 0) {
    const _row = getRowCount(tableData.value).one[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
}

const getRowCount = arr => {
  let spanOneArr = []
  let concatOne = 0
  arr.forEach((item, index) => {
    if (index === 0) {
      spanOneArr.push(1)
    } else {
      if (item.project_name === arr[index - 1].project_name) {
        spanOneArr[concatOne] += 1
        spanOneArr.push(0)
      } else {
        spanOneArr.push(1)
        concatOne = index
      }
    }
  })
  return {
    one: spanOneArr
  }
}

const toLookTestTaskConfig = () => {
  // router.push({
  //   name: 'LookTestTaskConfig',
  //   query: {
  //     id: route.query.id
  //   }
  // })
}

const changeCollapse = val => {
  currentCollpose.value = val
}

const uploadFile = val => {
  dockerFileDialog.value = true
  dockerFileDialogTitle.value = `【${val.docker_name}】上传文件`
  dockerFileForm.docker_name = val.docker_name
  dockerFileForm.task_detail_history_id = dockerDrawerId.value
}

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  dockerFileForm.upload_file = uploadFiles
}

const submitDockerFile = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let fd = new FormData()
      fd.append('docker_name', dockerFileForm.docker_name)
      fd.append('task_detail_history_id', dockerFileForm.task_detail_history_id)
      // 循环添加文件
      dockerFileForm.upload_file.forEach((item: any) => {
        fd.append('upload_file', item.raw)
      })
      fd.append('docker_path', dockerFileForm.docker_path)
      fullscreenLoading.value = true
      let res = await supplyDockerPackageApi(fd)
      fullscreenLoading.value = false
      if (res.code === 1000) {
        ElMessage.success('上传成功！')
        dockerFileList.value = []
        dockerFileDialog.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const cancelDockerFile = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dockerFileList.value = []
  dockerFileDialog.value = false
}

const getLog = val => {
  logDrawer.value = true
  logDrawerTitle.value = `【${val.docker_name}】容器日志列表`
  getDockerLogs(val.docker_name)
}

const getDockerLogs = async docker_name => {
  const params = {
    task_detail_history_id: dockerDrawerId.value,
    page: 1,
    page_size: 10,
    docker_name
  }
  let res = await getDockerLogsApi(params)
  if (res.code === 1000) {
    logDrawerList.value = res.data
  }
}

const runShell = async val => {
  ElMessageBox.confirm(`确定执行【${val.docker_name}】脚本?`, '执行脚本', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params = {
        task_detail_history_id: dockerDrawerId.value,
        docker_name: val.docker_name
      }
      let res = await runDockerShellApi(params)
      if (res.code === 1000) {
        ElMessage.success('脚本执行执行成功！')
      }
    })
    .catch(() => {})
}

const handleCloseLogDrawer = (done: () => void) => {
  logDrawerTitle.value = ''
  done()
}

const viewLog = val => {
  logDialog.value = true
  log.value = val.execute_record
  logTitle.value = `${val.docker_name}容器日志 - ${val.id}`
}

const getClassName = async (item: any, val) => {
  if (item.name === 'count') return
  currentItem.value = item
  currentId.value = val.id
  handleClassNameApi(currentItem.value, currentId.value)
  interfaceTitle.value = val.name
}

const handleClassNameApi = async (item, id) => {
  // tableDataLoading.value = true
  caseDialog.value = true
  let res = await getClassNameApi({
    task_details_history_id: id,
    status: statName[item.name]
  })
  if (res.code === 1000) {
    classNameTitle.value = item.name
    // @ts-ignore
    // tableDataTotal.value = res.total
    // tableData.value = res.data.flatMap(({ project_name, class_name }) =>
    //   class_name.map(classItem => ({
    //     project_name: project_name,
    //     class_name: classItem
    //   }))
    // )
    caseList.value = res.data
    caseList.value.map(item => {
      item.class_data = item.class_data.flatMap(({ project_name, class_name }) =>
        class_name.map(classItem => ({
          project_name: project_name,
          class_name: classItem,
          class_key: `${project_name}-${classItem}`
        }))
      )
      console.log(`output->item.class_name`, item.class_data)
    })
  }
}

const getMethods2 = async (row, val) => {
  if (defaultExpandedKeys.value.includes(row.class_key)) {
    defaultExpandedKeys.value = []
  } else {
    defaultExpandedKeys.value = [row.class_key]
  }
  let res = await getMethodsApi({
    project_name: row.project_name,
    class_name: row.class_name,
    status: statName[currentItem.value.name],
    task_details_history_id: currentId.value,
    provider_name: currentCollpose.value
  })
  if (res.code === 1000) {
    methodsData.value = res.data
  }
}

const viewDocker = async val => {
  dockerDrawer.value = true
  dockerDrawerTitle.value = val.name
  dockerDrawerId.value = val.id
  dockerCurrentPage.value = 1
  getDockerNamese(dockerDrawerId.value)
}

const getDockerNamese = async (id?) => {
  const params = {
    task_detail_history_id: id,
    page: dockerCurrentPage.value,
    page_size: dockerPageSize.value
  }
  let res = await getDockerNameseApi(params)
  if (res.code === 1000) {
    dockerNumDeatil.value = res.data
    dockerTotal.value = res.total
  }
}

const getMethods = async (item: any, type, val) => {
  currentMethodsItem.value = item
  currentMethodsId.value = val
  currentMethodsType.value = type
  handleMethods(currentMethodsItem.value, currentMethodsType.value, currentMethodsId.value)
}

const handleMethods = async (item: any, type, val) => {
  methodsDataLoading.value = true
  let res = await getMethodsApi({
    project_name: item.project_name,
    class_name: item.class_name,
    status: statName[type],
    task_details_history_id: val.id,
    page: methodsDataCurrentPage.value,
    page_size: methodsDataPageSize.value
  })
  methodsDataLoading.value = false
  if (res.code === 1000) {
    methodsDialog.value = true
    methodsData.value = res.data
    // @ts-ignore
    methodsDataTotal.value = res.total
    methodsTitle.value = `${val.name} - ${item.project_name} - ${item.class_name}`
  }
}

const handleDialogFullcen = () => {
  // 获取对话框 DOM 元素
  const dialogEl = document.querySelector('.caseDialog')

  // 切换全屏样式
  if (dialogEl) {
    fullcen.value = !fullcen.value
    if (fullcen.value) {
      dialogEl.classList.add('fullscreen')
    } else {
      dialogEl.classList.remove('fullscreen')
    }
  }
}

const close2 = () => {
  fullcen.value = false
  const dialogEl = document.querySelector('.caseDialog')
  if (dialogEl) {
    dialogEl.classList.remove('fullscreen')
  }
  caseDialog.value = false
}

const handleRun = (item: any) => {
  ElMessage.warning('重试')
}

const handleClose = (done: () => void) => {
  done()
}

const handleTableDataSizeChange = (val: number) => {}
const handleTableDataCurrentChange = (val: number) => {
  tableDataCurrentPage.value = val
  getClassName(currentItem.value, currentId.value)
}
const handleMethodsDataCurrentChange = (val: number) => {
  methodsDataCurrentPage.value = val
  handleMethods(currentMethodsItem.value, currentMethodsType.value, currentMethodsId.value)
}
const handleDockerSizeChange = (val: number) => {
  // dockerCurrentPage.value = val
}
const handleDockerCurrentChange = (val: number) => {
  dockerCurrentPage.value = val
  getDockerNamese(dockerDrawerId.value)
}
</script>

<style lang="scss" scoped>
.RecentlyRun-wrap {
  padding: 0 32px;
  .recentlyRun-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .recentlyRun-top-left {
      display: flex;
      flex-direction: column;
      .left-label {
        display: flex;
        margin-bottom: 8px;
        .build-num {
          font-size: 16px;
          color: #292929;
          line-height: 24px;
          font-weight: 600;
        }
        .status-label {
          margin-left: 12px;
          font-size: 14px;
          display: flex;
          align-items: center;
          span {
            color: #575757;
          }
          .el-icon {
            font-size: 18px;
            margin-right: 10px;
          }
        }
      }
      .left-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        .info-label {
          color: #8b8b8b;
          margin-right: 8px;
        }
        .instance-trigger-info {
          display: flex;
        }
        .info-divider {
          position: relative;
          top: -0.06em;
          display: inline-block;
          width: 1px;
          background: #e9edf0;
          height: 1em;
          margin: 0 8px;
          vertical-align: middle;
        }
        .el-icon {
          margin-left: 8px;
          cursor: pointer;
          color: #6e6e6e;
          font-size: 16px;
        }
      }
    }
    .recentlyRun-top-right {
      .info-list {
        display: flex;
        align-items: center;
        li {
          margin-right: 24px;
          list-style: none;
          .info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .item-num {
              font-size: 26px;
              font-family: DINPro;
            }
            .item-title {
              font-size: 14px;
              color: #6e6e6e;
            }
          }
        }
        li:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .pipeline-instance {
    padding: 1px 0px 16px;
    height: 70vh;
    .pipeline-instance__content {
      display: flex;
      box-shadow: 0 0 0 1px #e9edf0;
      background-color: #f2f5f7;
      border-radius: 4px;
      height: 100%;
      overflow: auto;
      .flow-groups {
        display: flex;
        height: 100%;
        .flow-group-splitline {
          position: relative;
          width: 48px;
          height: 100%;
          &::before {
            content: '';
            position: absolute;
            left: 50%;
            height: 100%;
            border-left: 1px solid #dbdbdb;
          }
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            width: 48px;
            border-top: 1px solid #dbdbdb;
            margin-left: -24px;
            top: 95px;
          }
          > svg {
            position: absolute;
            left: 50%;
            width: 20px;
            top: 86px;
            margin-left: -10px;
            z-index: 2;
            cursor: pointer;
          }
        }
        .flow-group {
          padding-top: 20px;
          padding-left: 20px;
          .group-head {
            color: #575757;
            font-size: 14px;
          }
          .stages {
            margin-top: 10px;
            .first-card {
              .card {
                &::before {
                  border-right: none !important;
                  border-left: none !important;
                }
              }
            }
            .only-card {
              .card {
                &::before {
                  border-right: none !important;
                  border-left: none !important;
                }
              }
            }
            .stage {
              display: flex;
              .card {
                position: relative;
                display: flex;
                align-items: center;
                margin: 0 14px;
                height: 200px;
                position: relative;
                cursor: pointer;
                &::before {
                  pointer-events: none;
                  content: '';
                  position: absolute;
                  left: -12%;
                  top: -77%;
                  border-left: 1px solid #dbdbdb;
                  border-right: 1px solid #dbdbdb;
                  border-bottom: 1px solid #dbdbdb;
                  width: 118%;
                  height: 100%;
                }

                .content-job {
                  display: flex;
                  align-items: center;
                  margin-left: 10px;
                  margin-right: 10px;
                }
                .job-card {
                  position: relative;
                  .status-icon {
                    position: absolute;
                    top: 18px;
                    left: -9px;
                    z-index: 9;
                    font-size: 24px;
                  }
                  .fail,
                  .channel {
                    color: #e62412;
                  }
                  .success {
                    color: #22b066;
                  }
                  .in_progress {
                    color: #409eff;
                  }
                  .wait_execute {
                    color: #909399;
                  }
                  .fail-card {
                    border-left-color: #f7aaa3 !important;
                    .card-title {
                      flex: 1;
                    }
                  }
                  .wait-card {
                    border-left-color: #dae0e5 !important;
                  }
                  .run-card {
                    border-left-color: #75c0f2 !important;
                    .card-title {
                      flex: 1;
                    }
                  }
                  .channel-card {
                    border-left-color: #f7aaa3 !important;
                    .card-title {
                      flex: 1;
                    }
                  }
                  .card-content {
                    height: 165px;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03), 0 0 0 1px #e8e8e8;
                    transition: box-shadow 0.2s ease-in, -webkit-box-shadow 0.2s ease-in;
                    border-left: 4px solid #90deb5;
                    display: flex;
                    flex-direction: column;
                    border-radius: 4px;
                    width: 288px;
                    margin: 1px;
                    position: relative;
                    .card-title {
                      padding: 16px 23px 0 23px;
                      background-color: #fff;
                      border-radius: 0 4px 0 0;
                      font-weight: 600;
                      color: #292929;
                      font-size: 14px;
                    }

                    .docker-message {
                      background-color: #f0f9ff;
                      padding: 12px 20px 12px 16px;
                      border-top: 1px solid #e8e8e8;
                      color: #22b066;
                      font-size: 12px;
                      line-height: 18px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      .view {
                        display: flex;
                        align-items: center;
                        .el-icon {
                          margin-right: 5px;
                          color: #22b066;
                          font-size: 16px;
                        }
                      }
                      .view:hover {
                        color: #1b9aee;
                        .el-icon {
                          color: #1b9aee;
                        }
                      }
                    }
                    .wait-comp {
                      .time {
                        background-color: #fff;
                        padding: 10px 20px 16px 23px;
                        color: #8b8b8b;
                        font-size: 12px;
                      }
                    }
                    .run-comp {
                      .message {
                        color: #1b9aee;
                      }
                      .button {
                        color: #e62412;
                      }
                    }
                    .card-info {
                      padding: 10px 20px 16px 23px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      flex: 1;
                      background-color: #fff;
                      span {
                        color: #8b8b8b;
                        font-size: 12px;
                      }
                      .operate {
                        display: flex;
                        align-items: center;
                        .report,
                        .log {
                          display: flex;
                          align-items: center;
                          .el-icon {
                            margin-right: 5px;
                            color: #8b8b8b;
                          }
                        }
                        .config {
                          display: flex;
                          align-items: center;
                          .el-icon {
                            margin-right: 5px;
                            color: #8b8b8b;
                          }
                        }
                        .log {
                          margin-left: 20px;
                        }
                      }
                    }
                    .message {
                      background-color: #f0f9ff;
                      padding: 12px 20px 12px 16px;
                      border-top: 1px solid #e8e8e8;
                      color: #e62412;
                      font-size: 12px;
                      line-height: 18px;
                    }
                    .button {
                      flex: 1;
                      border-top: 1px solid #e8e8e8;
                      padding-right: 20px;
                      background-color: #fff;
                      color: #1b9aee;
                      font-size: 12px;
                      line-height: 40px;
                      text-align: end;
                    }
                    .card-num {
                      background-color: #fff;
                      border-top: 1px solid #e8e8e8;
                      padding: 12px 20px 12px 23px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      .stat-info {
                        display: flex;
                        justify-content: space-around;
                        width: 100%;
                        .stat-info-item {
                          // min-width: 25%;
                          height: 58px;
                          padding: 4px 0;
                          .stat-info-item-value {
                            font-size: 18px;
                            margin-bottom: 5px;
                            font-family: DINPro;
                          }
                          .total {
                            color: #fa8c15;
                          }
                          .success {
                            color: #22b066;
                          }
                          .serious {
                            color: #e62412;
                          }
                          .yiban {
                            color: #8b8b8b;
                          }
                          .stat-info-item-desc {
                            font-size: 12px;
                            color: #8b8b8b;
                          }
                        }
                      }
                    }
                  }
                }
              }

              .wait-card {
                display: flex !important;
                flex-direction: column !important;
                .card-content {
                  height: 75px !important;
                  border-left-color: #dbdbdb !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
              .fail-card {
                display: flex !important;
                flex-direction: column !important;
                border-left-color: #f7aaa3 !important;
                .card-content {
                  height: 120px !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
              .channel-card {
                display: flex !important;
                flex-direction: column !important;
                border-left-color: #f7aaa3 !important;
                .card-content {
                  height: 120px !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
              .run-card {
                display: flex !important;
                flex-direction: column !important;
                border-left-color: #75c0f2 !important;
                .card-content {
                  height: 120px !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
              .success-card {
                display: flex !important;
                flex-direction: column !important;
                border-left-color: #90deb5 !important;
                height: 100% !important;
                .card-content {
                  height: 75px !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
            }
          }
          .only-stages {
            .only-card {
              .card {
                &::before {
                  border-left: none !important;
                  border-right: none !important;
                  border-bottom: none !important;
                }
              }
            }
          }
          .first-stages {
            .card {
              &::before {
                left: 3px !important;
                width: 105% !important;
                border-left: none !important;
              }
            }
          }
          .last-stages {
            .only-card {
              .card {
                &::before {
                  border-left: none !important;
                  border-right: none !important;
                  width: 105% !important;
                }
              }
            }
            .first-card {
              .card {
                &::before {
                  width: 105% !important;
                  border-left: none !important;
                }
              }
            }
            .last-card {
              .card {
                &::before {
                  right: -3px !important;
                  width: 105% !important;
                  border-right: none !important;
                }
              }
            }
          }
        }
      }
    }
  }
  .interfaceTest_card {
    display: flex !important;
    flex-direction: column !important;
    .success-card {
      height: 100% !important;
      border-left-color: #90deb5 !important;
    }
    .card-content {
      height: 165px !important;
      border-left-color: #90deb5 !important;
    }
    .run-card {
      height: 120px !important;
      border-left-color: #75c0f2 !important;
    }
    .channel-card {
      height: 120px !important;
      border-left-color: #f7aaa3 !important;
    }
    .wait-card {
      height: 75px !important;
      border-left-color: #dbdbdb !important;
    }
    .content-job {
      margin-top: 5%;
    }
  }
  .run-icon {
    animation: run 0.7s infinite;
  }
  @keyframes run {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
.dockerDrawer {
  .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
.upload-docker-file {
  width: 100%;
  .el-upload__tip {
    color: red;
  }
}

.classData {
  .success {
    color: #22b066;
  }
  .serious {
    color: #e62412;
  }
  .yiban {
    color: #8b8b8b;
  }
}

.empty {
  padding-top: 0px;
  height: 30vh;
  :deep(.el-empty__description) p {
    color: #fa8c15;
    font-size: 16px;
  }
}
.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .success {
      margin-left: 5px;
      color: #22b066;
    }
    .serious {
      margin-left: 5px;
      color: #e62412;
    }
    .yiban {
      margin-left: 5px;
      color: #8b8b8b;
    }
  }
}
</style>

<style lang="scss">
.methodsDataPage,
.tableDataPage {
  display: flex !important;
  justify-content: flex-end !important;
  margin-top: 5px;
}

.methodsDialog {
  .el-dialog__header {
    padding: 0 16px !important;
  }
  .el-dialog__body {
    padding: 0 16px 16px !important;
  }
}

.logDialog {
  .el-dialog__header {
    padding-bottom: 0 !important;
  }
  .el-dialog__body {
    padding-top: 16px !important;
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

.caseDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }
}

.caseDialog.fullscreen {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
  z-index: 9999;
}
</style>
