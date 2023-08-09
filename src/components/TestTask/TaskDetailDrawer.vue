<template>
  <el-drawer
    v-model="ishowDrawer"
    direction="rtl"
    :before-close="cancelClick"
    custom-class="taskDetail-drawer"
    :modal="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div class="header">
        <div>
          <h4 class="edit-h4" style="display: inline-block">编辑</h4>
          <div class="changeDelete" @click="deleteTask">
            <svg-icon class="grayDelete" iconName="icon-changyonggoupiaorenshanchu"></svg-icon>
            <svg-icon class="redDelete" iconName="icon-changyonggoupiaorenshanchu-copy"></svg-icon>
          </div>
        </div>
        <div @click="cancelClick()" class="complete-edit">
          <h4 class="edit-h4" style="display: inline-block; color: #409eff; font-weight: bold">完成</h4>
        </div>
      </div>
    </template>
    <template #default>
      <el-form
        ref="taskDetailFormRef"
        :model="taskDetailForm"
        :rules="taskDetailFormRules"
        label-width="220px"
        class="taskDetail-ruleForm"
        size="default"
        label-position="top"
        status-icon
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskDetailForm.name" placeholder="请输入阶段名称" />
        </el-form-item>
      </el-form>
      <div class="addButton">
        <span class="title">设备配置</span>
        <div class="device-space" v-for="(item, index) in deviceList" :key="'deviceList' + index">
          <div class="device-space-item">
            <el-form
              ref="deviceFormRef"
              :rules="deviceFormRules"
              :model="item"
              label-width="220px"
              class="device-ruleForm"
              size="default"
              label-position="top"
              status-icon
            >
              <el-form-item prop="serverName" :required="true">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">可选设备</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="未占用 — 设备未被任何任务使用，支持配置，支持使用<br />
                              占用中 — 设备被其他任务占用，但占用任务未执行，在本任务中可支持配置，支持使用<br />
                              其他任务占用，且该任务处于运行中，该设备支持配置，但配置后该任务无法马上执行"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  v-model="item.serverName"
                  placeholder="请选择设备"
                  :key="index"
                  @visible-change="selectDevice"
                  @change="getDeviceInfo(item, index)"
                >
                  <el-option
                    :label="it.ip"
                    :value="it.ip"
                    :disabled="it.disabled"
                    v-for="(it, index) in selectDeviceList"
                    :key="'selectDeviceList' + index"
                  >
                    <div style="display: flex; justify-content: space-between">
                      <span class="main-fileName"> {{ it.ip }}</span>
                      <div>
                        <span class="main-type" :style="{ color: it.using ? '#F56C6C' : '#409EFF' }">
                          {{ it.using ? '占用中' : '未占用' }}
                        </span>
                        <span class="main-create_user">{{ it.operate_user }} </span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" v-if="item.serverName">
                <el-card class="box-card" shadow="never" :key="index">
                  <template #header>
                    <div class="card-header">
                      <span>设备信息展示</span>
                    </div>
                  </template>
                  <ul>
                    <template v-for="(it, index) in item.showServerConfig" :key="'showServerConfig' + index">
                      <li>
                        <div class="detail">
                          {{ it.label }}
                          <el-tooltip class="box-item" effect="dark" :content="it.value" placement="top">
                            <span>{{ it.value }}</span>
                          </el-tooltip>
                        </div>
                      </li>
                    </template>
                  </ul>
                </el-card>
              </el-form-item>
              <el-form-item prop="deployType" :required="true">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">部署类型</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="全量基线：仅安装主线产品包<br />
                               项目基线：安装新硬件补丁后，再安装所选择项目包"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select v-model="item.deployType" placeholder="请选择部署类型" :key="index" style="display: block">
                  <el-option label="全量基线" value="full" />
                  <el-option label="项目基线" value="baseline" />
                </el-select>
              </el-form-item>
              <el-form-item prop="deployVersion" v-if="item.deployType === 'full'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">全量基线版本列表</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="产品包-主线版本列表中所有版本 （release 、待测版本）"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  v-model="item.deployVersion"
                  placeholder="请选择全量基线版本"
                  :key="index"
                  filterable
                  @visible-change="selectDeployVersion('full', item)"
                  @change="getDeployVersion('full', item, index)"
                >
                  <el-option
                    :label="it.file_name"
                    :value="it.file_name"
                    v-for="(it, index) in deployVersionFullList"
                    :key="'deployVersionFullList' + index"
                  >
                    <div style="display: flex; justify-content: space-between">
                      <span class="main-fileName"> {{ it.file_name }}</span>
                      <div>
                        <span class="main-type" :style="{ color: it.type === 'project' ? '#67C23A' : '#e6a23c' }">
                          {{ it.type === 'project' ? '待测版本' : 'release版本' }}
                        </span>
                        <span class="main-create_user">{{ it.create_user }} </span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="packageName" v-if="item.deployType === 'baseline'">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">项目基线版本列表</span>
                    <el-tooltip class="box-item" effect="dark" content="产品包-项目版本列表中所有release版本" placement="top" raw-content>
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  v-model="item.packageName"
                  placeholder="请选择项目基线版本"
                  :key="index"
                  filterable
                  @visible-change="selectDeployVersion('project', item)"
                  @change="getDeployVersion('project', item, index)"
                >
                  <el-option
                    :label="it.file_name"
                    :value="it.file_name"
                    v-for="(it, index) in deployVersionList"
                    :key="'deployVersionList' + index"
                  >
                    <div style="display: flex; justify-content: space-between">
                      <span class="main-fileName"> {{ it.file_name }}</span>
                      <div>
                        <span class="main-type" :style="{ color: it.type === 'project' ? '#67C23A' : '#e6a23c' }">
                          {{ it.type === 'project' ? '待测版本' : 'release版本' }}
                        </span>
                        <span class="main-create_user">{{ it.create_user }} </span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目包路径" prop="packagePath" v-show="false">
                <el-input v-model="item.packagePath" placeholder="" />
              </el-form-item>
              <el-form-item label="项目包ID" prop="packageID" v-show="false">
                <el-input v-model="item.packageID" placeholder="" />
              </el-form-item>
              <!-- <el-form-item prop="startMidwareType" v-if="`${item.showServerConfig[1].value}` !== 'x86' && item.serverName !== ''"> -->
              <el-form-item prop="startMidwareType">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">开机自启中间件</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="信创环境进行基线部署，需要选择自启中间件<br/>
                                  1. Tomcat：默认端口8443<br/>
                                  2. TongWeb: 默认端口8444"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select v-model="item.startMidwareType" placeholder="请选择开机自启中间件" :key="index">
                  <el-option label="Tomcat" value="Tomcat" />
                  <el-option label="Tongweb" value="Tongweb" />
                </el-select>
              </el-form-item>
              <el-form-item prop="sysRest">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">是否需要进行系统还原</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="是：环境部署过程先进行系统还原操作，将会清空所有非母盘文件，流水线任务执行过程中无法停止<br/>
                              否：环境部署过程不会进行系统还原操作，流水线任务执行过程中可以停止"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-radio-group v-model="item.sysRest" class="ml-4">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="reboot">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">是否需要进行设备重启</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="是：基线安装完成后，系统将进行重启<br />
                              否：基线安装完成后，系统不会进行重启"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-radio-group v-model="item.reboot" class="ml-4">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-collapse class="collapseItem">
                <el-collapse-item name="1">
                  <template #title>
                    <el-button text type="primary"> 高级设置 </el-button>
                  </template>
                  <el-form-item prop="ifha">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span style="margin-right: 4px">是否安装HA</span>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="是：基线安装时，将会安装HA程序<br />
                                  否：基线安装时，不会安装HA程序"
                          placement="top"
                          raw-content
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-radio-group v-model="item.ifha" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="ispbc">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span style="margin-right: 4px">是否安装人行模块</span>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="是：基线安装时，将会安装人行模块<br />
                                  否：基线安装时，不会安装人行模块"
                          placement="top"
                          raw-content
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-radio-group v-model="item.ispbc" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="isrbc">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span style="margin-right: 4px">是否安装农信银模块</span>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="是：基线安装时，将会安装农信银模块<br />
                                  否：基线安装时，不会安装农信银模块"
                          placement="top"
                          raw-content
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-radio-group v-model="item.isrbc" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="useNewDataType">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span style="margin-right: 4px">WatchDog是否使用新数据类型</span>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="是：基线安装时，WatchDog将会使用新数据类型<br />
                                  否：基线安装时，WatchDog不会使用新数据类型"
                          placement="top"
                          raw-content
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-radio-group v-model="item.useNewDataType" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="ifback" v-if="item.deployType === 'baseline'">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span style="margin-right: 4px">是否生产部门安装</span>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="是：安装完成后，会对升级后的环境进行备份，作为出厂环境<br />  
                                  否：安装完成后，不会对升级后的环境进行备份"
                          placement="top"
                          raw-content
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-radio-group v-model="item.ifback" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="ifrs" v-if="item.deployType === 'baseline'">
                    <template #label>
                      <div style="display: flex; align-items: center">
                        <span style="margin-right: 4px">是否重启服务</span>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="是：基线安装完成，将会重启服务进程<br />
                                  否：基线安装完成，不会重启服务进程"
                          placement="top"
                          raw-content
                        >
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <el-radio-group v-model="item.ifrs" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </div>
          <div class="device-space-item">
            <el-icon class="delete-icon" @click="deleteDevice(index)"><Delete /></el-icon>
          </div>
        </div>
        <!-- <el-button type="primary" @click="addDeviceForm">+ 添加设备</el-button> -->
      </div>
    </template>
    <!-- <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick(taskDetailFormRef)">取消</el-button>
        <el-button type="primary" @click="confirmClick(taskDetailFormRef)">保存</el-button>
      </div>
    </template> -->
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Delete, QuestionFilled } from '@element-plus/icons-vue'
import { getDeviceApi, getDeployVersionApi, getProductPackageApi, getMainProductPackageApi } from '@/api/NetDevOps'
import { disposeList } from '../../views/lane/data'

const props = defineProps({
  taskDetailDrawer: {
    type: Boolean,
    default: () => false
  },
  taskDetailName: {
    type: String,
    default: () => ''
  },
  taskDetailInfo: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['closeDrawer', 'deleteTask'])
const ishowDrawer = ref(false)
const isShowToolTip = ref(false)
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  main_bord_type: [{ required: true, message: '请选择主板类型', trigger: 'change' }],
  deployType: [{ required: true, message: '请选择部署类型', trigger: 'change' }],
  deployVersion: [{ required: true, message: '请选择全量基线版本', trigger: 'change' }],
  packageName: [{ required: true, message: '请选择项目基线版本', trigger: 'change' }],
  ifback: [{ required: true, message: '是否生产部门安装项', trigger: 'change' }],
  ispbc: [{ required: true, message: '是否安装人行模块为必填项', trigger: 'change' }],
  useNewDataType: [{ required: true, message: 'WatchDog是否使用新数据类型为必填项', trigger: 'change' }],
  isrbc: [{ required: true, message: '是否安装农信银模块为必填项', trigger: 'change' }],
  ifha: [{ required: true, message: '是否安装HA为必填项', trigger: 'change' }],
  ifrs: [{ required: true, message: '是否重启服务为必填项', trigger: 'change' }],
  startMidwareType: [{ required: true, message: '请选择开机自启中间件', trigger: 'change' }],
  reboot: [{ required: true, message: '请选择是否需要进行设备重启', trigger: 'change' }],
  sysRest: [{ required: true, message: '请选择是否需要进行系统还原', trigger: 'change' }]
})
const deviceList = ref(JSON.parse(JSON.stringify(disposeList['netSignPrepare'])))
const cloneDeviceObj = ref(JSON.parse(JSON.stringify(disposeList['netSignPrepare'][0])))
const deviceFormRef = ref([])
const deviceFormRules = reactive<FormRules>({
  serverName: [{ required: true, message: '请选择设备', trigger: 'change' }],
  deployType: [{ required: true, message: '请选择部署类型', trigger: 'change' }],
  deployVersion: [{ required: true, message: '请选择全量基线版本', trigger: 'change' }],
  packageName: [{ required: true, message: '请选择项目基线版本', trigger: 'change' }],
  startMidwareType: [{ required: true, message: '请选择开机自启中间件', trigger: 'change' }]
})
const selectDeviceList = ref([])
const deployVersionList = ref([])
const deployVersionFullList = ref([])
const isPassVerification = ref(true)
const hasDeviceList = ref([])

watch(
  () => props.taskDetailDrawer,
  () => {
    ishowDrawer.value = props.taskDetailDrawer
  }
)

watch(
  () => props.taskDetailName,
  () => {
    taskDetailForm.name = props.taskDetailName
  }
)

watch(
  () => props.taskDetailInfo,
  () => {
    // @ts-ignore
    deviceList.value = props.taskDetailInfo
    hasDeviceList.value = []
    JSON.parse(localStorage.getItem('flows')).map(item => {
      item.task_stages.map(it => {
        it.task_details.map(i => {
          if (i.plugin === 'netSignPrepare') {
            hasDeviceList.value.push(i.dispose[0].serverName)
          }
        })
      })
    })
  }
)

const closeDrawer = (value?: any) => {
  deviceList.value = JSON.parse(JSON.stringify(disposeList['netSignPrepare']))
  emit('closeDrawer', [false, value])
}

const cancelClick = async (done?: () => void) => {
  if (!taskDetailFormRef.value) return
  // formEl.resetFields()
  // closeDrawer()
  await taskDetailFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const forms = deviceFormRef.value
      if (forms) {
        for (const item of forms) {
          try {
            const result = await item.validate()
            if (!result) {
              return
            }
            isPassVerification.value = true
          } catch (error) {
            isPassVerification.value = false
          }
        }
      }
      // 遍历deviceList，将ifback和ifrs加入到deviceConfig中
      for (const item of deviceList.value) {
        item.deviceConfig.ifha = item.ifha
        item.deviceConfig.ispbc = item.ispbc
        item.deviceConfig.isrbc = item.isrbc
        item.deviceConfig.useNewDataType = item.useNewDataType
        item.deviceConfig.ifback = item.ifback
        item.deviceConfig.ifrs = item.ifrs
        item.deviceConfig.startMidwareType = item.startMidwareType
        item.deviceConfigString = Object.entries(item.deviceConfig)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      }
      deviceList.value.map(item => {
        if (item.deployType === 'baseline') {
          item.deployVersion = 'netsign_x10_x11'
        }
      })
      // @ts-ignore
      deviceList.value.push(isPassVerification.value)
      // @ts-ignore
      deviceList.value.push(taskDetailForm.name)
      console.log(`保存`, deviceList.value)
      closeDrawer(deviceList.value)
      // done()
    } else {
      ElMessage.error('任务名称不能为空！')
    }
  })
}

const confirmClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const forms = deviceFormRef.value
      if (forms) {
        for (const item of forms) {
          const result = await item.validate()
          if (!result) return
        }
      }
      // @ts-ignore
      deviceList.value.push(taskDetailForm.name)
      console.log(`保存`, deviceList.value)
      closeDrawer(deviceList.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const deleteTask = () => {
  // let isHasCount = 0
  // JSON.parse(localStorage.getItem('flows')).map(item => {
  //   item.task_stages.map(it => {
  //     it.task_details.map(i => {
  //       if (i.plugin === 'netSignArrange') {
  //         isHasCount++
  //       }
  //     })
  //   })
  // })
  // if (isHasCount !== 0) {
  //   ElMessage.error('环境部署必须在环境准备之后，请先删除环境部署任务！')
  //   return
  // } else {
  //   emit('deleteTask')
  // }
  emit('deleteTask')
}

const cloneObj = obj => {
  let ret
  if (Array.isArray(obj)) {
    ret = []
    for (let i = 0; i < obj.length; i++) {
      ret[i] = cloneObj(obj[i])
    }
    return ret
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    ret = {}
    for (let i in obj) {
      ret[i] = cloneObj(obj[i])
    }
    return ret
  } else {
    return obj
  }
}

const addDeviceForm = () => {
  let arr = cloneObj(cloneDeviceObj.value)
  deviceList.value.push(arr)
  console.log('arr', deviceList.value)
}

const deleteDevice = (id: number) => {
  if (deviceList.value.length === 1) return ElMessage.error('至少保留一个设备配置！')
  deviceList.value.splice(id, 1)
}

const onMouseenter = e => {
  const parentWidth = e.target.offsetWidth
  const contentWidth = e.target.scrollWidth
  isShowToolTip.value = contentWidth < parentWidth
}

const selectDevice = async val => {
  if (val) {
    const params = {
      page: 1,
      page_size: 100
    }
    let res = await getDeviceApi(params)
    if (res.code === 1000) {
      // 过滤掉using为true的设备
      selectDeviceList.value = res.data.filter(
        item =>
          item.using === false || item.operate_user === null || item.operate_user === JSON.parse(localStorage.getItem('userInfo')).username
      )
      // 遍历hasDeviceList，将已经选择的设备增加字段disabled为true
      hasDeviceList.value.map(item => {
        selectDeviceList.value.map(it => {
          if (item === it.ip) {
            it.disabled = true
          }
        })
      })
    }
  }
}

const getDeviceInfo = async (val, index) => {
  let res = await getDeviceApi({ device_manage_ip: val.serverName })
  if (res.code === 1000) {
    deviceList.value[index].showServerConfig[0].value = res.data.ip
    deviceList.value[index].showServerConfig[1].value = res.data.main_board_type
    deviceList.value[index].showServerConfig[2].value = res.data.machine_type
    deviceList.value[index].showServerConfig[3].value = res.data.mode_code
    deviceList.value[index].showServerConfig[4].value = res.data.config_code
    deviceList.value[index].showServerConfig[5].value = res.data.cavium_card_type
    deviceList.value[index].showServerConfig[6].value = res.data.gm_card_type
    deviceList.value[index].showServerConfig[7].value = res.data.machine_sn
    deviceList.value[index].showServerConfig[8].value = res.data.product_id
    if (deviceList.value[index].showServerConfig[9]) {
      deviceList.value[index].showServerConfig[9].value = res.data.kernel || '未知'
    }
    if (deviceList.value[index].showServerConfig[10]) {
      deviceList.value[index].showServerConfig[10].value = res.data.operating_system || '未知'
    }
    deviceList.value[index].serverConfig.serverIP = res.data.ip
    deviceList.value[index].serverConfig.serverPasswd = res.data.password
    deviceList.value[index].serverConfig.userName = res.data.username
    deviceList.value[index].serverConfig.machineType = res.data.machine_type
    deviceList.value[index].serverConfig.modelCode = res.data.mode_code
    deviceList.value[index].serverConfig.configCode = res.data.config_code
    deviceList.value[index].serverConfig.machineSN = res.data.machineSN
    deviceList.value[index].serverConfig.productID = res.data.productID

    deviceList.value[index].packageName = ''
    deviceList.value[index].packagePath = ''
    deviceList.value[index].packageID = null
    deviceList.value[index].deployVersion = ''

    hasDeviceList.value = []
    JSON.parse(localStorage.getItem('flows')).map(item => {
      item.task_stages.map(it => {
        it.task_details.map(i => {
          if (i.plugin === 'netSignPrepare') {
            hasDeviceList.value.push(i.dispose[0].serverName)
          }
        })
      })
    })
  }
}

const selectDeployVersion = async (type, val) => {
  if (type === 'project') {
    const params = {
      deploy_type: val.deployType,
      device_manage_ip: val.serverName
    }
    let res = await getDeployVersionApi(params)
    if (res.code === 1000) {
      deployVersionList.value = res.data
    }
  } else {
    getMainProductPackage()
  }
}

const getMainProductPackage = async () => {
  const params = {
    page: 1,
    page_size: 100
  }
  let res = await getMainProductPackageApi(params)
  if (res.code === 1000) {
    deployVersionFullList.value = res.data
  }
}

const getDeployVersion = async (type, val, index) => {
  deployVersionList.value.map(it => {
    if (it.file_name === val.packageName) {
      if (type === 'full') {
        deviceList.value[index].deployVersion = it.deploy_version
      } else {
        deviceList.value[index].deployVersion = 'netsign_x10_x11'
        deviceList.value[index].packagePath = it.file_path
        deviceList.value[index].packageID = it.id
      }
    }
  })
}
</script>

<style lang="scss">
.main-type {
  color: #e6a23c;
  margin-left: 15px;
  display: inline-block;
  // width: 80px;
}
.main-create_user {
  color: #acafb4;
  font-size: 13px;
  display: inline-block;
  width: 90px;
  max-width: 90px;
  margin-left: 10px;
}
.taskDetail-drawer {
  width: 35% !important;
  .el-drawer__header {
    font-size: 14px;
    border-bottom: 1px solid #dbdbdb !important;
    padding: 0px 10px 0 32px;
    height: 60px;
    margin-bottom: 0px;
    .header {
      display: flex;
      justify-content: space-between;
      padding-right: 15px;
    }
    .edit-h4 {
      display: inline-block;
      margin-right: 8px;
    }
    .complete-edit:hover {
      cursor: pointer;
      h4 {
        background: #ebeef5;
      }
    }
    svg:hover {
      cursor: pointer;
    }
    .changeDelete {
      display: inline-block;
    }
    .changeDelete .grayDelete {
      display: inline-block;
      color: #72767b;
    }
    .changeDelete .redDelete {
      display: none;
    }
    .changeDelete:hover .grayDelete {
      display: none;
    }
    .changeDelete:hover .redDelete {
      display: inline-block;
    }
  }
  .taskDetail-ruleForm {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .text {
      font-size: 14px;
    }
    .item {
      margin-bottom: 18px;
    }
    .box-card {
      width: 520px;
      .el-card__header {
        padding: 9px 14px;
      }
      .el-card__body {
        padding: 0px 15px;
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            width: 45%;

            span {
              color: #67c23a;
            }
          }
        }
      }
    }
  }
  .addButton {
    .title {
      display: block;
      margin-bottom: 10px;
      color: #606266;
      font-size: 14px;
      margin-left: 10px;
    }
    .device-space {
      .el-form-item__label {
        display: flex !important;
        justify-content: flex-start !important;
        align-items: center !important;
        .el-icon {
          cursor: pointer;
        }
      }
      justify-content: space-between;
      display: flex;
      padding: 20px 20px 0;
      margin-left: 20px;
      margin-bottom: 20px;
      position: relative;
      background-color: #f5f5f5;
      .delete-icon {
        cursor: pointer;
      }
      .box-card {
        width: 520px;
        .el-card__header {
          padding: 9px 14px;
        }
        .el-card__body {
          padding: 0px 15px;
          ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            li {
              width: 45%;
              span {
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 130px;
                overflow: hidden;
                color: #67c23a;
              }
            }
          }
        }
      }
      .collapseItem {
        border: none;
        width: 520px;
        margin-bottom: 20px;
      }
      .el-collapse .el-collapse-item {
        background-color: #f5f5f5 !important;
        // border: none;
      }
      .el-collapse .el-collapse-item__header {
        border: none;
        color: #606266;
        font-size: 14px;
        background-color: #f5f5f5 !important;
        .el-button {
          padding-left: 0px;
          padding-right: 0px;
          span {
            font-weight: 600;
          }
        }
        .el-collapse-item__arrow {
          margin-left: 3px;
          color: #409eff;
        }
      }
      .el-collapse .el-collapse-item__wrap {
        background-color: #f5f5f5 !important;
      }
      .el-collapse-item__header {
        height: 22px;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding-bottom: 0px;
      }
    }
  }
  span {
    font-weight: 500;
    font-size: 14px;
    margin-right: 10px;
  }
}

.detail {
  display: flex !important;
  white-space: nowrap !important;
}
</style>
