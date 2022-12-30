<template>
  <div class="performanceManagement">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <!-- <el-tab-pane label="任务管理" name="taskManagement"> -->
      <!-- <el-card class="box-card" shadow="never" style="margin-bottom:20px"> -->
      <!-- <el-form :model="searchForm" label-width="120px" :inline="true" class="searchForm">
        <el-form-item label="build版本" prop="build">
          <el-select v-model="searchForm.build" placeholder="请选择build版本...">
            <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name"
              :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="group">
          <el-select clearable v-model="searchForm.group" placeholder="请选择任务状态..." @change="getGroupDataId">
            <el-option v-for="(item, index) in state.selectStatusList" :key="'selectStatusList' + index"
              :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-input v-model="searchForm.user" placeholder="请输入要搜索的负责人..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="onResert">重置</el-button>
        </el-form-item>
      </el-form> -->
      <!-- </el-card> -->
      <el-card class="box-card" shadow="never">
        <div class="search-wrap">
          <div>
            <el-button size="large" type="primary" @click="openAddDialog('task', 'add', null)" style="margin-bottom: 20px">
              添加任务
            </el-button>
          </div>
          <div>
            <el-select size="large" clearable v-model="searchBuild" placeholder="请选择要搜索的build版本..." @change="getTask(1)">
              <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name" :value="item.name" />
            </el-select>
            <el-select size="large" clearable v-model="searchGroup" placeholder="请选择要搜索的任务状态..." @change="getTask(1)">
              <el-option
                v-for="(item, index) in state.selectStatusList"
                :key="'selectStatusList' + index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              size="large"
              clearable
              v-model="searchUser"
              placeholder="请输入要搜索的负责人..."
              :suffix-icon="Search"
              @change="getTask(1)"
            />
          </div>
        </div>

        <el-table :data="state.tableData" stripe style="width: 100%" v-loading="tableLoading" height="65vh">
          <el-table-column prop="name" label="任务名称" align="center" width="150" />
          <el-table-column prop="build" label="build版本" align="center" width="250" />
          <el-table-column prop="groupAfter" label="测试平台" class-name="testStyle" width="320" header-align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.groupAfter == 0 && scope.row.failGroupAfter == 0" type="info"> 暂无测试平台 </el-tag>
              <el-popover placement="top" width="auto" trigger="hover" v-if="scope.row.groupAfter != 0">
                <template #reference>
                  <!-- <el-tag class="tagType">成功的测试平台集合</el-tag> -->
                  <div class="wrapper">
                    <div class="circle">
                      <div class="small-circle"></div>
                    </div>
                  </div>
                </template>
                <el-tag class="tagType" v-for="(item, index) in scope.row.groupAfter" :key="'groupAfter' + index">
                  {{ item.label }}
                </el-tag>
              </el-popover>
              <el-popover placement="top" width="auto" trigger="hover" v-if="scope.row.failGroupAfter != 0">
                <template #reference>
                  <!-- <el-tag class="tagType errorTagType" type="danger">失败的测试平台集合</el-tag> -->
                  <div class="wrapper">
                    <div class="circle">
                      <div class="small-circle" style="background-color: #ff6600"></div>
                    </div>
                  </div>
                </template>
                <el-table :data="scope.row.failGroupAfter" stripe style="width: 100%">
                  <el-table-column prop="label" label="测试平台名称" align="center" width="200" />
                  <el-table-column fixed="right" label="操作" align="center">
                    <template #default="item">
                      <el-button link type="primary" size="small" @click="runAgain(item.row.value, scope.row)"> 重新运行 </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="总用例数 / 执行数 / 失败用例数" align="center" width="200">
            <template #default="scope">
              <span v-if="scope.row.number">{{ scope.row.number[0] }}</span>
              <span style="margin: 0 5px">/</span>
              <span>{{ scope.row.run_cases }}</span>
              <span style="margin: 0 5px">/</span>
              <span class="failNumStyle" @click="toDetail(scope.row.id)" v-if="scope.row.number && scope.row.number[1] != 0">{{
                scope.row.number[1]
              }}</span>
              <span class="failNumStyle" v-if="scope.row.number && scope.row.number[1] == 0">{{ scope.row.number[1] }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="counts" label="总用例数" align="center" width="120" />
          <el-table-column prop="fail_cases" label="失败用例数" align="center" width="120" /> -->
          <el-table-column prop="state" label="任务状态" align="center" width="170">
            <template #default="scope">
              <div class="stateStyle" v-if="scope.row.state === 'stop'">
                <div class="status-point" style="background-color: #909399"></div>
                <span style="color: #909399">已停止</span>
              </div>
              <div class="stateStyle fail" v-if="scope.row.state === 'fail'">
                <div class="status-point" style="background-color: #f56c6c"></div>
                <span style="color: #f56c6c">已失败</span>
              </div>
              <div class="stateStyle hhh" v-if="scope.row.state === 'running'">
                <div class="status-point hhh" style="background-color: #67c23a"></div>
                <span style="color: #67c23a">运行中</span>
              </div>
              <div class="stateStyle" v-if="scope.row.state === 'create'">
                <div class="status-point" style="background-color: #e6a23c"></div>
                <span style="color: #e6a23c">已创建</span>
              </div>
              <div class="stateStyle" v-if="scope.row.state === 'complete'">
                <div class="status-point" style="background-color: #409eff"></div>
                <span style="color: #409eff">已完成</span>
              </div>
              <div class="stateStyle hhh" v-if="scope.row.state === 'ready'">
                <div class="status-point hhh" style="background-color: #666666"></div>
                <span style="color: #666666">准备中</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="负责人" align="center" width="120" />
          <el-table-column prop="uptimeAfter" label="更新时间" align="center" width="200" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-popover placement="bottom" :width="10" trigger="hover" popper-class="morePopover">
                <template #reference>
                  <el-button link type="primary" size="small">启停</el-button>
                </template>
                <div class="moreButton">
                  <el-tooltip content="该任务下所有测试平台均停止运行" v-if="scope.row.state === 'running'" placement="top" effect="dark">
                    <span>
                      <el-button link type="primary" size="small" @click="changeTaskStatus('stop', scope.row.id)"> 任务终止 </el-button>
                    </span>
                  </el-tooltip>
                  <el-button link type="primary" size="small" v-else @click="changeTaskStatus('start', scope.row.id)"> 任务启动 </el-button>
                  <el-tooltip content="继续运行该任务下失败用例" placement="top" effect="dark">
                    <span>
                      <el-button
                        link
                        type="primary"
                        size="small"
                        v-if="scope.row.state == 'fail'"
                        @click="changeTaskStatus('restart', scope.row.id)"
                      >
                        继续运行
                      </el-button>
                    </span>
                  </el-tooltip>
                </div>
              </el-popover>
              <el-tooltip content="可查看当前任务的进度详情" placement="top" effect="dark">
                <el-button link type="primary" size="small" @click="taskProgress(scope.row)"> 任务进度 </el-button>
              </el-tooltip>
              <el-popover placement="bottom" :width="10" trigger="click" popper-class="morePopover">
                <template #reference>
                  <el-button link type="info" size="small">更多</el-button>
                </template>
                <div class="moreButton">
                  <el-tooltip content="可修改当前任务下所有的测试平台" placement="top" effect="dark">
                    <el-button link type="primary" size="small" @click="openTestPlatformDialog(scope.row)" style="margin-left: 0px">
                      测试平台
                    </el-button>
                  </el-tooltip>
                  <el-button style="margin-left: 0px" link type="primary" size="small" @click="openAddDialog('task', 'edit', scope.row)">
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定删除此项任务?"
                    trigger="click"
                    confirm-button-text="确认删除"
                    cancel-button-text="取消"
                    @confirm="handleDelete('task', scope.row)"
                  >
                    <template #reference>
                      <el-button link type="danger" size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="taskCurrentPage"
          v-model:page-size="taskPageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, prev, pager, next, jumper"
          :total="taskTotal"
          @size-change="handleTaskSizeChange"
          @current-change="handleTaskCurrentChange"
        />
      </el-card>
      <!-- </el-tab-pane> -->
    </el-tabs>
    <!--添加任务弹窗-->
    <el-dialog v-model="dialogVisible" :title="titleDialog" width="40%" :before-close="handleClose" :close-on-click-modal="false">
      <span>
        <el-form
          :inline="false"
          :model="addTaskForm"
          ref="addTaskRuleFormRef"
          :rules="addTaskFormRules"
          class="addDevice-form"
          label-width="160px"
        >
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="addTaskForm.name" placeholder="请输入..." :disabled="editDisabled" />
          </el-form-item>
          <el-form-item label="build版本" prop="build">
            <el-select v-model="addTaskForm.build" placeholder="请选择..." :disabled="editDisabled">
              <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="测试平台" prop="group">
            <el-select
              multiple
              clearable
              v-model="addTaskForm.group"
              placeholder="请选择..."
              @change="getGroupDataId"
              @remove-tag="deleteGroupDataId"
            >
              <el-option v-for="(item, index) in state.d_groupData" :key="'d_groupData' + index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" prop="user">
            <el-input v-model="addTaskForm.user" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="用例集" prop="cases">
            <el-cascader
              v-model="casValue"
              :options="casesOptions"
              :props="casesProps"
              @change="getCasesOptions"
              popper-class="casesProps-tree"
              collapse-tags
              collapse-tags-tooltip
              clearable
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addTaskForm.remark" placeholder="提示信息：可根据测试设备硬件等信息区分同一build的不同测试任务" />
          </el-form-item>
          <el-form-item label="是否含有物理机" prop="config">
            <el-radio-group v-model="isPhysicalMachine">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-collapse v-show="isPhysicalMachine == '1'" v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="(item, index) in physicalItems" :key="'physicalItems' + index" :name="item.name">
            <template #title>
              <span>{{ `【${item.name}】` + `&nbsp` + '的物理机配置项：' }}</span>
              <span v-if="item.requiredTip" class="requiredTip">【待完善】</span>
              <el-icon class="header-icon">
                <info-filled />
              </el-icon>
            </template>
            <el-form :model="item" ref="physicalForms" label-width="160px">
              <el-form-item label="TipServer IP " prop="TipServer" :required="item.required">
                <el-input v-model="item.TipServer" :placeholder="placeholderTipServer" @input="onPhysicalItemChange(item, index)" />
              </el-form-item>
              <el-form-item label="TipServer Port" prop="TipPort" :required="item.required">
                <el-input v-model="item.TipPort" :placeholder="placeholderTipPort" @input="onPhysicalItemChange(item, index)" />
              </el-form-item>
              <!-- <el-form-item label="TipServer PassWord" prop="TestPass" :required="item.required">
                <el-input v-model="item.TestPass" :placeholder="placeholderTestPass"
                  @input="onPhysicalItemChange(item, index)" />
              </el-form-item> -->
              <!--<el-form-item v-show="isPhysicalMachine == '1'" label="物理设备硬件型号" prop="model">
                    <el-input v-model="addTaskForm.config.model" :placeholder="placeholderTipModel" />
                  </el-form-item> -->
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetTaskForm(addTaskRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="toShowPreviewDialog(addTaskRuleFormRef)">{{ buttonText }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!--任务进度弹窗-->
    <el-dialog
      custom-class="taskProgressDialog"
      v-model="taskProgressDialog"
      title="任务进度"
      width="1050px"
      @close="closeTaskProgressDialog"
    >
      <el-timeline>
        <el-timeline-item timestamp="准备阶段" placement="top" size="large" type="primary" hollow>
          <!-- <el-card shadow="never" :body-style='bodyStyle'> -->
          <el-input v-model="textarea" :rows="13" type="textarea" placeholder="暂无log日志..." />
          <!-- </el-card> -->
        </el-timeline-item>
        <el-timeline-item timestamp="运行阶段" placement="top" color="#0bbd87">
          <!-- <el-card shadow="never"> -->
          <reportDetailVue v-if="showDetail" :reportDetailData="reportDetailData" />
          <!-- </el-card> -->
        </el-timeline-item>
        <el-timeline-item timestamp="任务完成" placement="top" color="#f56c6c" />
      </el-timeline>
    </el-dialog>
    <!--平台弹窗-->
    <el-dialog v-model="platformDialog" title="修改测试平台" custom-class="platformDialog" width="50%" :before-close="handleTestPlatClose">
      <div class="tagList">
        <span class="title">已有测试平台：</span>
        <el-tag v-if="testPlatList.length == 0" class="ml-2" type="info">暂无测试平台</el-tag>
        <div>
          <el-tag
            class="tagType"
            v-for="(item, index) in testPlatList"
            :key="'testPlatList' + index"
            closable
            @close="handleCloseTag(item, item.id)"
          >
            {{ item.label }}
          </el-tag>
        </div>
      </div>
      <el-form :inline="false" :model="addTestPlatForm" ref="addTestPlatFormRef" class="addDevice-form" label-width="130px">
        <el-form-item label="添加测试平台：">
          <el-select clearable v-model="addTestPlatForm.group" placeholder="请选择要添加的测试平台..." @change="getTestPlatDataId">
            <el-option
              v-for="(item, index) in state.d_groupDataAfter"
              :key="'d_groupDataAfter' + index"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onResetTaskForm(addTestPlatFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddTestPlatForm(addTestPlatFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--确认预览弹窗-->
    <el-dialog
      v-model="submitPreviewDialog"
      title="添加任务预览"
      custom-class="submitPreviewDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">添加任务预览清单<span>【请仔细核对每一项后提交】</span></h4>
        </div>
      </template>
      <div class="preview">
        <div class="preview_item">
          <span class="left">任务名称：</span>
          <span>{{ addTaskForm.name }}</span>
        </div>
        <div class="preview_item">
          <span class="left">build版本：</span>
          <span>{{ addTaskForm.build }}</span>
        </div>
        <div class="preview_item" style="display: flex">
          <span class="left" style="display: block">测试平台：</span>
          <div v-for="(item, index) in physicalNames" :key="'physicalNames' + index">
            <el-tag style="margin-right: 10px">{{ item }}</el-tag>
          </div>
        </div>
        <div class="preview_item">
          <span class="left">负责人：</span>
          <span>{{ addTaskForm.user }}</span>
        </div>
        <div class="preview_item" style="display: flex">
          <span class="left" style="display: block">用例集：</span>
          <div style="width: 80%">
            <span>用例版本：</span>
            <el-tag>{{ casesName }}</el-tag>
            <div style="margin-top: 10px; display: flex">
              <div style="min-width: 70px">用例模块：</div>
              <div style="display: flex; flex-wrap: wrap">
                <div v-for="(item, index) in caseModule" :key="'caseModule' + index">
                  <el-tag type="info" style="margin-right: 10px; margin-bottom: 5px">{{ item }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="preview_item">
          <span class="left">备注：</span>
          <span>{{ addTaskForm.remark || '无' }} </span>
        </div>
        <div class="preview_item">
          <span class="left">是否含有物理机：</span>
          <span v-if="isPhysicalMachine == '1'">是</span><span v-else>否</span>
        </div>
        <template v-if="isPhysicalMachine == '1'">
          <div class="phy-items" v-for="(item, index) in physicalItems" :key="'physicalItems' + index">
            <div v-if="item.TipPort !== ''" style="display: flex; margin-bottom: 20px">
              <span class="title">{{ `【${item.name}】` + '为物理机，配置项：' }}</span>
              <div>
                <div style="margin-bottom: 10px">
                  <span>TipServer：</span><span>{{ item.TipServer }}</span>
                </div>
                <div style="margin-bottom: 10px">
                  <span>TipPort：</span><span>{{ item.TipPort }}</span>
                </div>
                <!-- <div style="margin-bottom: 10px;"><span>TestPass：</span><span>{{ item.TestPass }}</span></div> -->
              </div>
            </div>
            <div v-else style="display: flex; margin-bottom: 20px">
              <span class="title">{{ `【${item.name}】` + '为虚拟机，无配置项' }}</span>
            </div>
          </div>
        </template>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="submitPreviewDialog = false">取消</el-button>
          <el-button type="primary" @click="onAddTaskForm(addTaskRuleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, watch } from 'vue'
import { ref, reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Calendar, Search } from '@element-plus/icons-vue'
import { ElInput } from 'element-plus'
import {
  deviceApi,
  addDeviceApi,
  editDeviceApi,
  deleteDeviceApi,
  d_typeApi,
  addD_typeApi,
  editD_typeApi,
  deleteD_typeApi,
  d_groupApi,
  addD_groupApi,
  editD_groupApi,
  deleteD_groupApi
} from '@/api/APV/index.js'
import {
  taskApi,
  addTaskApi,
  editTaskApi,
  deleteTaskApi,
  taskRunApi,
  taskStatusApi,
  deleteTestPlatApi,
  putTestPlatApi,
  getCaseApi,
  getTaskConfigApi
} from '@/api/APV/taskManagement.js'
import { getReportApi } from '@/api/APV/testReport.js'
import { buildApi } from '@/api/APV/buildManagement.js'
import { utc2beijing } from '@/utils/util.js'
import reportDetailVue from './components/reportDetailEchart.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeName = ref('taskManagement')
const dialogVisible = ref(false)
const deviceTypeDialogVisible = ref(false)
const groupDialogVisible = ref(false)
const taskProgressDialog = ref(false)
const platformDialog = ref(false)
const tableLoading = ref(false)
const editDisabled = ref(false)
const showDetail = ref(false)
const submitPreviewDialog = ref(false)
const textarea = ref('')
const testPlatList = ref([]) // 已有测试平台集合List
const buttonText = ref('添加')
const timer = ref(null) // 定时器
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const activeNames = ref([1])
const physicalItems = ref([])
const handleChange = (val: string[]) => {
  console.log(val)
}
const casesProps = {
  multiple: true,
  label: 'name',
  value: 'name'
}
const casesOptions = ref([])

// 调用 获取用例集接口
const getCase = async () => {
  let res = await getCaseApi()
  casesOptions.value = res.data || []
}

const tag = ref(-1)
const casValue: any = ref([])
// 处理用例集字段传参
const getCasesOptions = data => {
  /* 解决父节点为单选，子节点为多选的需求 */
  data.forEach((i: any) => {
    if (i[0] != tag.value) {
      tag.value = i[0]
    }
  })
  let filterd = data.filter((v: any) => v[0] == tag.value)
  casValue.value = []
  casValue.value.push(...filterd)
  /* 解决父节点为单选，子节点为多选的需求 */

  let cases_name = []
  let modules_name = []
  let arr = []
  for (var i = 0; i < data.length; i++) {
    cases_name.push(data[i][0])
  }
  cases_name = [...new Set(cases_name)]
  cases_name.map(item => {
    arr.push({
      cases_name: item,
      module_name: []
    })
  })
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (arr[i].cases_name == data[j][0]) {
        arr[i].module_name.push(data[j][1])
      }
    }
  }

  // 如果可以多选用这个方法
  // addTaskForm.cases = arr

  // 只单选
  addTaskForm.cases = arr[0]
  // console.log("dada", cases_name, modules_name, arr);
}

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const state: any = reactive({
  tableData: [], // 任务管理数据
  getD_group: [], // 测试平台数据
  buildData: [], // 压测版本数据
  d_groupDataAfter: [],
  selectStatusList: [
    {
      value: 'running',
      label: '运行中'
    },
    {
      value: 'fail',
      label: '已失败'
    },
    {
      value: 'stop',
      label: '已停止'
    }
  ]
})

const physicalNames = ref([])
const casesName = ref('')
const caseModule = ref([])
const searchForm = ref({
  build: '',
  group: '',
  user: ''
})
const searchUser = ref('')
const searchBuild = ref('')
const searchGroup = ref('')

// 添加测试平台数据
const addTestPlatForm = reactive({
  id: null,
  group: null
})
const addTestPlatFormRef = ref<FormInstance>()

const isPhysicalMachine = ref('0')
const titleDialog = ref('')
const addTaskForm = reactive({
  id: '',
  name: '',
  user: '',
  build: '',
  group: [],
  cases: null,
  remark: '',
  config: []
  // config: {
  //   TipServer: "",
  //   TipPort: "",
  //   TestPass: "",
  //   // model: ""
  // }
})

const addTaskRuleFormRef = ref<FormInstance>()
const validateTipServer = (rule: any, value: any, callback: any) => {
  if (isPhysicalMachine.value == '0') {
    return callback()
  } else {
    physicalItems.value.forEach(item => {
      if (item.TipServer === '') {
        return callback(new Error('请输入物理机ip'))
      } else {
        callback()
      }
    })
  }
}
const validateTipPort = (rule: any, value: any, callback: any) => {
  if (isPhysicalMachine.value == '0') {
    return callback()
  } else {
    let _arr = []
    physicalItems.value.forEach(item => {
      _arr.push(item.TipPort)
      // if (item.TipPort === '') {
      //   return callback(new Error('请输入物理机port'))
      // } else {
      //   callback()
      // }
    })
    if (_arr.some(val => val === '')) {
      callback(new Error('请输入物理机port'))
    } else {
      callback()
    }
  }
}
const validateTestPass = (rule: any, value: any, callback: any) => {
  if (isPhysicalMachine.value == '0') {
    return callback()
  } else {
    physicalItems.value.forEach(item => {
      if (item.TestPass === '') {
        return callback(new Error('请输入物理机PassWord'))
      } else {
        callback()
      }
    })
  }
}
const validateModel = (rule: any, value: any, callback: any) => {
  // if (isPhysicalMachine.value == '0') {
  //   return callback()
  // } else {
  //   if (addTaskForm.config.model === '') {
  //     callback(new Error('请输入物理机硬件型号'))
  //   } else {
  //     callback()
  //   }
  // }
}
const addTaskFormRules = reactive<FormRules>({
  name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  user: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  build: [{ required: true, message: '请选择测build版本', trigger: 'blur' }],
  group: [{ required: true, message: '请选择测试平台', trigger: 'blur' }],
  cases: [{ required: true, message: '请选择用例集', trigger: 'blur' }],
  // config: [
  //   { required: true, message: "请选择是否需要物理机", trigger: "blur" },
  // ],
  // TipServer: [
  //   { required: true, validator: validateTipServer, trigger: "blur" },
  // ],
  // TipPort: [
  //   { required: true, validator: validateTipPort, trigger: "blur" },
  // ],
  // TestPass: [
  //   { required: true, validator: validateTestPass, trigger: "blur" },
  // ],
  model: [{ required: true, validator: validateModel, trigger: 'blur' }]
})

const physicalForms = ref([])

const onPhysicalItemChange = (item, index) => {
  // const { TipServer, TipPort, TestPass } = item
  // item.required = !!(TipServer || TipPort || TestPass)
  // item.required && !(TipServer && TipPort && TestPass) ? item.requiredTip = true : item.requiredTip = false
  const { TipServer, TipPort } = item
  item.required = !!(TipServer || TipPort)
  item.required && !(TipServer && TipPort) ? (item.requiredTip = true) : (item.requiredTip = false)
  if (!item.required) {
    physicalForms.value[index].clearValidate()
  }
}

// 切换Tab
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event);
}

// 打开添加/编辑弹窗
const openAddDialog = async (type, operation, data) => {
  switch (type) {
    case 'task':
      operation == 'add'
        ? (titleDialog.value = '添加任务') && (buttonText.value = '添加') && (editDisabled.value = false)
        : (titleDialog.value = '编辑任务') && (buttonText.value = '确定') && (editDisabled.value = true)
      casValue.value = []
      if (operation == 'add') {
        isPhysicalMachine.value = '0'
      } else {
        if (JSON.stringify(data.config) === '{}' || data.config == null) {
          isPhysicalMachine.value = '0'
        } else {
          isPhysicalMachine.value = '1'
          // addTaskForm.config.TipServer = data.config.TipServer
          // addTaskForm.config.TipPort = data.config.TipPort
          // addTaskForm.config.TestPass = data.config.TestPass
          // addTaskForm.config.model = data.config.model
        }
      }
      if (data && data.state === 'running') {
        return ElMessage({
          message: '任务运行中，禁止编辑！',
          type: 'warning',
          duration: 1000
        })
      }
      nextTick(() => {
        getOneData(type, data?.id)
      })
      dialogVisible.value = true
      break
    default:
      break
  }
}

// 获取单个数据
const getOneData = (type, id) => {
  switch (type) {
    case 'task':
      state.tableData.map(item => {
        if (item.id === id) {
          addTaskForm.id = item.id
          addTaskForm.name = item.name
          addTaskForm.user = item.user
          addTaskForm.remark = item.remark
          addTaskForm.build = item.build
          addTaskForm.group = item.group
          addTaskForm.cases = item.cases
          handleSelectData(addTaskForm.group)
          handleCaseValue(item.cases)
        }
      })
      break
    default:
      break
  }
}

// 处理 编辑弹窗 - 测试平台字段回显数据
const handleSelectData = data => {
  let arr = []
  data.forEach(item => {
    state.d_groupData.map(it => {
      if (it.id == item) {
        arr.push(it.id)
      }
    })
  })
  addTaskForm.group = arr
}

// 处理 编辑弹窗 - 用例集字段回显数据
const handleCaseValue = data => {
  let module_nameList = []
  if (data.module_name && data.module_name[0] == 'all') {
    // 获取当前版本下全部的模块名
    casesOptions.value.map(item => {
      if (data.cases_name === item.name) {
        item.children.map(it => module_nameList.push(it.name))
      }
    })
  } else {
    // 获取当前版本下返回的模块名
    module_nameList = data.module_name || []
  }
  // casValue.value数据结构： [["10_5_runcase","AAA"],["10_5_runcase","Boundary"]]
  module_nameList.map(item => {
    casValue.value = casValue.value.concat([[data.cases_name, item]])
  })
}

// 展示预览弹窗
const toShowPreviewDialog = async (formEl: FormInstance | undefined) => {
  // 配置项中已填写但未完善提醒
  const forms = physicalForms.value
  if (forms) {
    for (const item of forms) {
      const result = await item.validate()
      if (!result) return
    }
  }
  // 去除未填写的配置项
  physicalItems.value.map(item => {
    // const { TipServer, TipPort, TestPass } = item
    // if (!!(TipServer || TipPort || TestPass)) {
    //   addTaskForm.config.push(item)
    // }
    const { TipServer, TipPort } = item
    if (!!(TipServer || TipPort)) {
      addTaskForm.config.push(item)
    }
  })
  // 选择含有物理机，未填写配置项提醒
  if (addTaskForm.config.length == 0 && isPhysicalMachine.value === '1') {
    return ElMessage.error('至少填写一个物理机配置项')
  }
  console.log('forms', addTaskForm)
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      submitPreviewDialog.value = true
      casesName.value = addTaskForm.cases.cases_name
      caseModule.value = addTaskForm.cases.module_name
    }
  })
}

// 添加任务
const onAddTaskForm = async (formEl: FormInstance | undefined) => {
  // addTaskForm.config = physicalItems.value
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    submitPreviewDialog.value = false
    if (valid) {
      console.log('添加成功...', JSON.parse(JSON.stringify(addTaskForm)))
      // addTaskForm.group = "[" + String(addTaskForm.group) + "]"
      if (isPhysicalMachine.value == '0') {
        delete addTaskForm.config
      }
      if (titleDialog.value == '添加任务') {
        delete addTaskForm.id
        addTask(addTaskForm)
      } else {
        editTask(addTaskForm)
      }
      addTaskRuleFormRef.value.resetFields()
      dialogVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 删除
const handleDelete = (type, data) => {
  switch (type) {
    case 'task':
      if (data.state === 'running') {
        return ElMessage({
          message: '任务运行中，禁止删除！',
          type: 'warning',
          duration: 1000
        })
      }
      deleteTask(data.id)
      break
    default:
      break
  }
}

onMounted(async () => {
  await getD_group()
  await getTask(1)
  await getBuild()
  // await handle()
  await getTaskConfig()
  await getCase()
})

// 处理数据 - 表格 测试平台/更新时间 字段回显
const handle = () => {
  state.tableData.map((item, index) => {
    item.number = [].concat(item.counts, item.fail_cases)
    item.uptimeAfter = utc2beijing(item.uptime) // '2022-09-16T17:44:08Z' => '2022/9/16 16:43:40'
    // let groupData = item.group.replace(/\[|]/g, '').split(",") // 将 '[21,22,23]' => [21,22,23]
    item.groupAfter = [] // 成功的测试平台回显展示
    item.failGroupAfter = [] // 失败的测试平台回显展示
    item.group.map(it => {
      state.d_groupData.forEach((d_item, index) => {
        if (it == d_item.id) {
          item.groupAfter.push({
            value: d_item.id,
            label: d_item.name
          })
        }
      })
    })
    item.fail_group.map(it => {
      state.d_groupData.forEach((d_item, index) => {
        if (it == d_item.id) {
          item.failGroupAfter.push({
            value: d_item.id,
            label: d_item.name
          })
        }
      })
    })
  })
  tableLoading.value = false
}

// 任务管理 获取接口
const getTask = async page => {
  tableLoading.value = true
  let build = searchBuild.value
  let user = searchUser.value
  let res = await taskApi({ page, build, state: searchGroup.value, user })
  if (res.code == 1000) {
    tableLoading.value = false
    state.tableData = res.data
    taskTotal.value = res.total || 0
    handle()
  } else {
    tableLoading.value = false
    ElMessage({
      message: res.msg || '请求失败',
      type: 'error',
      duration: 2000
    })
  }
}

// 任务管理 添加接口
const addTask = async params => {
  let res = await addTaskApi(params)
  if (res?.code === 1000) {
    await getTask(1)
    await handle()
    ElMessage({
      message: '添加成功',
      type: 'success',
      duration: 1000
    })
  }
  physicalItems.value = []
}

// 任务管理 编辑接口
const editTask = async params => {
  let res = await editTaskApi(params)
  if (res.code === 1000) {
    await getTask(1)
    await handle()
    ElMessage({
      message: '编辑成功',
      type: 'success',
      duration: 1000
    })
  }
  physicalItems.value = []
}

// 任务管理 删除接口
const deleteTask = async id => {
  let params = {
    id: id
  }
  let res = await deleteTaskApi(params)
  if (res.code === 1000) {
    await getTask(1)
    await handle()
    ElMessage({
      message: res?.msg || '删除成功',
      type: 'success',
      duration: 1000
    })
  }
}

// 分组管理 获取接口
const getD_group = async () => {
  let group = await d_groupApi()
  state.d_groupData = group.data?.data
}

// 压测版本 获取接口
const getBuild = async () => {
  let res = await buildApi({ filetype: 'apvbuild' })
  state.buildData = res.data.map(item => ({ name: item }))
}

// 分组名称 下拉选择框
const getGroupDataId = value => {
  let items = []
  addTaskForm.group = value
  addTaskForm.group.map(item => {
    state.d_groupData.map(it => {
      if (item === it.id) {
        items.push(it)
      }
    })
  })
  if (physicalItems.value.length == 0) {
    items.map(item => {
      physicalItems.value.push({
        id: item.id,
        name: item.name,
        TipServer: '',
        TipPort: ''
        // TestPass: "",
      })
    })
  } else {
    items.forEach(item => {
      let isExit = false
      physicalItems.value.forEach(it => {
        if (item.id === it.id) {
          isExit = true
          return
        }
      })
      if (!isExit) {
        physicalItems.value.push({
          id: item.id,
          name: item.name,
          TipServer: '',
          TipPort: ''
          // TestPass: "",
        })
      }
    })
  }
  activeNames.value = [physicalItems.value[physicalItems.value.length - 1].name]
  console.log('physicalItems.value', items, physicalItems.value[physicalItems.value.length - 1].name)
  physicalNames.value = []
  physicalItems.value.map(item => {
    physicalNames.value.push(item.name)
  })
}

const deleteGroupDataId = value => {
  physicalItems.value = physicalItems.value.filter(item => item.id !== value)
  console.log('删一个', value, physicalItems.value)
}

// 测试平台 下拉选择框
const getTestPlatDataId = value => {
  addTestPlatForm.group = value
}

// 打开添加测试平台弹窗
const openTestPlatformDialog = data => {
  if (data.state === 'fail') {
    return ElMessage({
      message: '任务已失败，禁止修改测试平台！',
      type: 'warning',
      duration: 1000
    })
  }
  let group = []
  testPlatList.value = []
  addTestPlatForm.id = data.id
  state.tableData.map(item => {
    if (item.id === data.id) {
      // group = item.group.toString().replace(/\[|]/g, "").split(",") // 后端返回 '[21,22]' => 前端回显 ["21","22"]
      group = item.group
    }
  })
  state.d_groupDataAfter = JSON.parse(JSON.stringify(state.d_groupData))
  group.map(item => {
    state.d_groupDataAfter.map(it => {
      if (it.id == item) {
        it.disabled = true
        testPlatList.value.push({
          label: it.name,
          id: it.id
        })
      }
    })
  })
  platformDialog.value = true
}

// 添加测试平台
const onAddTestPlatForm = async (formEl: FormInstance | undefined) => {
  await formEl.validate(async (valid, fields) => {
    if (addTestPlatForm.group != '') {
      const params = {
        id: addTestPlatForm.id,
        group: addTestPlatForm.group
      }
      putTestPlat(params)
    } else {
      platformDialog.value = false
      console.log('error submit!', fields)
    }
  })
}

// 添加测试平台 api
const putTestPlat = async params => {
  let res = await putTestPlatApi(params)
  if (res.code === 1000) {
    await getTask(taskCurrentPage.value)
    await handle()
    platformDialog.value = false
    ElMessage({
      message: res?.msg || '添加成功',
      type: 'success',
      duration: 2500
    })
  } else {
    platformDialog.value = false
    ElMessage({
      message: res?.msg || '添加失败',
      type: 'error',
      duration: 3500,
      showClose: true
    })
  }
}

// 删除测试环境平台
const handleCloseTag = (data, id) => {
  ElMessageBox.confirm('确认删除该测试平台?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {
        id,
        group: data.id
      }
      deleteTestPlat(params)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 删除测试环境平台 api
const deleteTestPlat = async params => {
  let res = await deleteTestPlatApi(params)
  if (res.code === 1000) {
    ElMessage({
      message: res?.msg || '删除成功',
      type: 'success',
      duration: 1500
    })
  } else {
    ElMessage({
      message: res?.msg || '删除失败',
      type: 'error',
      duration: 1500
    })
  }
}

const reportDetailData = ref({})
// 任务进度
const taskProgress = async data => {
  showDetail.value = false
  textarea.value = ''
  // 获取对应的测试报告失败数/成功数/用例数
  await getReport(data)
}

// 任务启动/终止
const changeTaskStatus = (val, id) => {
  const params = {
    id,
    state: val
  }
  getTaskStatus(params)
}

// 任务start or stop api
const getTaskStatus = async params => {
  let res = await taskStatusApi(params)
  if (res?.code === 1000) {
    await getTask(taskCurrentPage.value)
    await handle()
    ElMessage({
      message: res?.msg || '任务已启动',
      type: 'success',
      duration: 1500
    })
  }
}

// 任务进度 接口
const getTaskRun = async id => {
  let res = await taskRunApi({ id })
  if (res?.code == 1000) {
    textarea.value += res.data.log || ''
  }
}

// 测试报告
const getReport = async data => {
  let res = await getReportApi({ id: data.id })
  await getTaskRun(data.id)
  showDetail.value = true
  taskProgressDialog.value = true
  reportDetailData.value = {
    counts: data.counts,
    success: 0,
    fail_cases: 0
  }
  if (res?.code === 1000) {
    reportDetailData.value = {
      counts: data.counts,
      success: res.data.pass,
      fail_cases: res.data.fail
    }
  }
}

const placeholderTipServer = ref('')
const placeholderTipPort = ref('')
const placeholderTestPass = ref('')
const placeholderTipModel = ref('')
// 获取物理机参数配置信息
const getTaskConfig = async () => {
  let res = await getTaskConfigApi()
  placeholderTipServer.value = res.data.TipServer || ''
  placeholderTipPort.value = res.data.TipPort || ''
  // placeholderTestPass.value = res.data.TestPass || ''
  // placeholderTipModel.value = res.data.model || ''
}

const runAgain = async (value, data) => {
  const params = {
    group: value,
    id: data.id
  }
  let res = await putTestPlatApi(params)
  if (res.code === 1000) {
    await getTask(taskCurrentPage.value)
    await handle()
    platformDialog.value = false
    ElMessage({
      message: res?.msg || '运行成功',
      type: 'success',
      duration: 1500
    })
  } else {
    platformDialog.value = false
    ElMessage({
      message: res?.msg || '运行失败',
      type: 'error',
      duration: 1500
    })
  }
}

const toDetail = id => {
  router.push({
    path: `/APVAuto/templateReport/failNumDetail`,
    query: {
      reportId: id
    }
  })
}

// 取消弹窗
const onResetTaskForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
  deviceTypeDialogVisible.value = false
  groupDialogVisible.value = false
  platformDialog.value = false
  addTestPlatForm.group = ''
  physicalItems.value = []
}

// 关闭弹窗
const handleClose = (done: () => void) => {
  dialogVisible.value = false
  deviceTypeDialogVisible.value = false
  groupDialogVisible.value = false
  taskProgressDialog.value = false
  addTaskRuleFormRef.value.resetFields()
  physicalItems.value = []
}

// 关闭测试平台弹窗
const handleTestPlatClose = (done: () => void) => {
  platformDialog.value = false
  addTestPlatForm.group = ''
  addTestPlatFormRef.value.resetFields()
}

// 关闭任务进度弹窗
const closeTaskProgressDialog = () => {
  platformDialog.value = false
  clearInterval(timer.value)
  timer.value = null
}

const onQuery = () => {}

const onResert = () => {}

const handleTaskSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleTaskCurrentChange = (val: number) => {
  taskCurrentPage.value = val
  getTask(taskCurrentPage.value)
}
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;

  span {
    color: red;
    font-size: 14px;
  }
}

:deep(.el-timeline-item__timestamp.is-top) {
  font-size: 15px;
  font-weight: 600;
  color: black;
  margin-bottom: 12px;
}

.wrapper {
  width: 60px;
  height: 35px;
  display: flex;
  justify-content: center;

  .circle {
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 50%;
    position: relative;
    box-shadow: 1px 2px 0px 0px #899599;
  }

  .small-circle {
    width: 25px;
    height: 25px;
    background: #99cc33;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.wrapper:hover {
  cursor: pointer;
}

.searchForm {
  .el-form-item {
    margin-bottom: 0px !important;
  }
}

.el-pagination {
  display: flex;
  justify-content: end;
  margin-top: 25px;
}

.status-point {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 3px;
}

.el-collapse {
  .el-input,
  .el-select {
    width: 450px;
  }

  .requiredTip {
    color: #f56c6c;
  }
}

.addDevice-form {
  .el-input,
  .el-select {
    width: 450px;
  }
}

.moreButton {
  display: flex;
  flex-direction: column;
}

.tagType {
  margin: 2px;
}

.tagType:hover {
  cursor: pointer;
}

.errorTagType:hover {
  cursor: pointer;
}

.dashboard {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 300px;
}

.platformDialog {
  .tagList {
    display: flex;
    align-items: center;
    height: 80px;
    font-size: 14px;
    margin-left: 20px;

    .title {
      width: 98px;
      margin-right: 12px;
    }

    .tagType {
      margin-right: 6px;
    }

    .el-input {
      width: 100px;
    }
  }
}

.hhh {
  // border-radius: 100%;
  webkit-animation: breathe 1500ms ease infinite;
  -moz-animation: breathe 1500ms ease infinite;
  -o-animation: breathe 1500ms ease infinite;
  animation: breathe 1500ms ease infinite;
}

@-webkit-keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

@-moz-keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

@-o-keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

@keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 10px rgba(255, 255, 255, 0.1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 1px 40px rgba(255, 107, 132, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 1px 80px #ff6b84;
  }
}

:deep(.el-table .cell) {
  padding: 0px;
}

:deep(.el-table td.el-table__cell) {
  padding: 20px 0px;
}

.search-wrap {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;

  .el-select {
    margin: 0 10px;
    width: 220px;
  }

  .el-input {
    width: 220px;
  }
}

.failNumStyle {
  color: rgb(64, 158, 255);
}

.failNumStyle:hover {
  cursor: pointer;
}

.preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px;

  .preview_item {
    margin-bottom: 10px;
    display: flex;
  }

  .left {
    display: inline-block;
    width: 140px;
    font-size: 16px;
    font-weight: 600;
  }

  .phy-items {
    display: flex;
    flex-direction: column;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>

<style lang="scss">
.morePopover {
  min-width: 0px !important;
  width: auto !important;

  .el-button {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0px;
      margin-left: 0px;
    }
  }
}

.platformDialog,
.taskProgressDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }
}

.addDevice-form {
  .el-cascader {
    width: 450px;

    .el-input {
      height: 32px;
    }
  }

  .casesProps-tree {
    .el-checkbox {
      margin-right: 5px !important;
    }
  }
}

.testStyle {
  .cell {
    display: flex !important;
    justify-content: center !important;
  }
}
</style>
