<template>
  <el-drawer
    v-model="ishowDrawer"
    direction="rtl"
    :before-close="cancelClick"
    custom-class="netSignProjectDeploy-drawer"
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
        class="netSignProjectDeploy-ruleForm"
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
              :model="item"
              :rules="deviceFormRules"
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
                <el-select v-model="item.serverName" placeholder="请选择设备" :key="index" @change="getDeviceInfo(item, index)">
                  <el-option
                    :label="it.ip"
                    :value="it.ip"
                    v-for="(it, index) in hasDeviceList"
                    :key="'hasDeviceList' + index"
                    :disabled="it.disabled"
                  >
                    <div style="display: flex; justify-content: space-between">
                      <span class="main-fileName"> {{ it.ip }}</span>
                      <div v-if="it.create_user">
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
              <el-form-item prop="pendingVersion" :required="true">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">可选版本</span>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="版本列表：产品包-主线、项目版本列表中所有可选包<br />
                              Tag:研发代码仓库Tag标签<br />
                              当版本列表选择后缀为.tgz的产品包，需要手动上传jar文件"
                      placement="top"
                      raw-content
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-radio-group v-model="item.pendingVersionOrigin" class="ml-4" @change="changePendingVersionOrigin(item, index)">
                  <el-radio label="auto" size="large">版本列表</el-radio>
                  <el-radio label="manual" size="large">Tag</el-radio>
                </el-radio-group>
                <el-input
                  class="input-width"
                  v-show="item.pendingVersionOrigin === 'manual'"
                  v-model="item.pendingVersion"
                  placeholder="请输入可选版本..."
                ></el-input>
                <el-select
                  v-show="item.pendingVersionOrigin === 'auto'"
                  v-model="item.pendingVersion"
                  placeholder="请选择版本"
                  :key="index"
                  filterable
                  @visible-change="selectProduct(item)"
                  @change="getProductInfo(item, index)"
                >
                  <el-option
                    :label="item.file_name"
                    :value="item.file_name"
                    v-for="(item, index) in selectProductList"
                    :key="'selectProductList' + index"
                  >
                    <div style="display: flex; justify-content: space-between">
                      <span class="main-fileName"> {{ item.file_name }}</span>
                      <div>
                        <span class="main-type" :style="{ color: item.type === 'project' ? '#67C23A' : '#e6a23c' }">
                          {{ item.type === 'project' ? '待测版本' : 'release版本' }}
                        </span>
                        <span class="main-create_user">{{ item.create_user }} </span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传文件" prop="jarList" :required="true" v-if="String(deviceList[0].packagePath).includes('tgz')">
                <el-upload
                  ref="uploadFile"
                  class="upload-demo"
                  v-model:file-list="item.jarList"
                  multiple
                  action=""
                  with-credentials
                  accept=".jar"
                  :on-change="handleChange"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <span class="file_name" v-if="item.jarList === undefined || item.jarList.length === 0">未选择文件</span>
                  <template #tip>
                    <div class="el-upload__tip">Tips：支持多个jar包上传</div>
                  </template>
                </el-upload>
              </el-form-item>
              <!-- <el-card class="config-card" shadow="never" :key="index">
                <template #header>
                  <div class="card-header">
                    <span>NetSign接口自动化代码配置</span>
                  </div>
                </template>
                <el-form-item label="代码分支" prop="branch" :required="true">
                  <el-select v-model="item.branch" placeholder="请选择代码分支" :key="index" @change="getProductInfo(item, index)">
                    <el-option :label="item.name" :value="item.name" v-for="(item, index) in branchList" :key="'branchList' + index" />
                  </el-select>
                </el-form-item>
                <el-form-item label="适用版本" prop="netsignVersion" :required="true">
                  <el-select v-model="item.netsignVersion" placeholder="请选择适用版本" :key="index" @change="getProductInfo(item, index)">
                    <el-option
                      :label="item.name"
                      :value="item.name"
                      v-for="(item, index) in netsignVersionList"
                      :key="'netsignVersionList' + index"
                    />
                  </el-select>
                </el-form-item>
              </el-card> -->
              <!-- <el-collapse class="collapseItem">
                <el-collapse-item name="1">
                  <template #title>
                    <el-button text type="primary"> 高级设置 </el-button>
                  </template>
                  <el-form-item prop="log" class="log-item">
                    <template #label>
                      <div class="config-item">
                        <span> 配置文件 </span>
                        <el-icon class="screen-icon" @click="handleFullscreen(item, index)"><FullScreen /></el-icon>
                      </div>
                    </template>
                    <CodeMirror :code="item.log" :codeStyle="{ height: '20vh', width: '100%' }" />
                  </el-form-item>
                </el-collapse-item>
              </el-collapse> -->
            </el-form>
          </div>
          <!-- <div class="device-space-item">
            <el-icon class="delete-icon" @click="deleteDevice(index)">
              <Delete />
            </el-icon>
          </div> -->
        </div>
        <span class="title">NetSign接口自动化代码配置</span>
        <div class="device-space" v-for="(item, index) in deviceList" :key="'deviceList' + index">
          <div class="device-space-item">
            <el-form
              ref="deviceFormRef2"
              :model="item"
              :rules="deviceFormRules"
              label-width="220px"
              class="device-ruleForm"
              size="default"
              label-position="top"
              status-icon
            >
              <el-form-item prop="netsignVersion" :required="true">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">适用版本</span>
                    <el-tooltip class="box-item" effect="dark" content="接口自动化代码适用的签名服务器主线版本" placement="top" raw-content>
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  v-model="item.netsignVersion"
                  placeholder="请选择适用版本"
                  :key="index"
                  @change="getProductInfo(item, index, 'version')"
                >
                  <el-option
                    :label="item.name"
                    :value="item.name"
                    v-for="(item, index) in netsignVersionList"
                    :key="'netsignVersionList' + index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="branch" :required="true">
                <template #label>
                  <div style="display: flex; align-items: center">
                    <span style="margin-right: 4px">代码分支</span>
                    <el-tooltip class="box-item" effect="dark" content="接口自动化代码可选分支" placement="top" raw-content>
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  v-model="item.branch"
                  placeholder="请选择代码分支"
                  :key="index"
                  @visible-change="getBranchList"
                  @change="getProductInfo(item, index)"
                >
                  <el-option :label="item.name" :value="item.name" v-for="(item, index) in branchList" :key="'branchList' + index" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="device-space-item">
            <el-icon class="delete-icon" @click="deleteDevice(index)">
              <Delete />
            </el-icon>
          </div> -->
        </div>
        <!-- <el-button type="primary" @click="addDeviceForm">+ 添加设备</el-button> -->
      </div>
      <el-dialog
        v-model="configFileDialog"
        :title="configFileDialogTitle"
        :modal="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        custom-class="configFileDialogStyle"
        width="70%"
      >
        <CodeMirror :code="configFileDialogLog" :codeStyle="{ height: '70vh', width: '100%' }" @onCodeChange="onCodeChange" />
      </el-dialog>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onMounted, watchEffect } from 'vue'
import { ElMessage, FormInstance, FormRules, genFileId, UploadInstance, UploadRawFile } from 'element-plus'
import { Delete, FullScreen, QuestionFilled } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import {
  getDeviceApi,
  getProductPackageApi,
  getMainProductPackageApi,
  getNetsignVersionApi,
  getNetsignBranchApi,
  getAllProductPackagApi,
  uploadSupplyJarApi
} from '@/api/NetDevOps/index'
import { disposeList } from '../../views/lane/data'
import CodeMirror from '@/components/CodeMirror.vue'
import { getInterfaceTestConfigurationFile } from '@/data/InterfaceTestConfigurationFile'

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

const configFileDialog = ref(false)
const uploadFile = ref<UploadInstance>()
const jarFile = ref(null)
const configFileDialogTitle = ref('')
const configFileDialogLog = ref('')
const configId = ref(null)
const netsign_code_version_id = ref(null)
const ishowDrawer = ref(false)
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  pendingVersion: [{ required: true, message: '请输入待测版本', trigger: 'blur' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  ifrs: [{ required: true, message: '是否重启服务为必填项', trigger: 'change' }]
})
const deviceList = ref(JSON.parse(JSON.stringify(disposeList['interfaceTest'])))
const cloneDeviceObj = ref(JSON.parse(JSON.stringify(disposeList['interfaceTest'][0])))
const deviceFormRef = ref([])
const deviceFormRef2 = ref([])
const deviceFormRules = reactive<FormRules>({
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  pendingVersion: [{ required: true, message: '待测版本不能为空', trigger: 'blur' }],
  jarList: [{ required: true, message: 'jar包不能为空', trigger: 'change' }],
  log: [{ required: true, message: '配置文件不能为空', trigger: 'change' }],
  branch: [{ required: true, message: '代码分支不能为空', trigger: 'change' }],
  netsignVersion: [{ required: true, message: '适用版本不能为空', trigger: 'change' }]
})
const selectDeviceList = ref([])
const selectProductList = ref([])
let currentFlows = ref(JSON.parse(localStorage.getItem('flows')))
const isPassVerification = ref(false)
const hasDeviceList = ref([])
const branchList = ref([])
const netsignVersionList = ref([])

watch(
  () => props.taskDetailDrawer,
  () => {
    ishowDrawer.value = props.taskDetailDrawer
    getNetsignVersion()
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
  async () => {
    nextTick(async () => {
      let currentDevice = []
      currentFlows.value.map(item => {
        item.task_stages.map(it => {
          it.task_details.map(i => {
            if (i.plugin === 'interfaceTest') {
              currentDevice.push(i.dispose[0].serverName)
            }
          })
        })
      })

      // @ts-ignore
      deviceList.value = props.taskDetailInfo
      hasDeviceList.value = []
      let isHasNetSignPrepare = ref(false)
      JSON.parse(localStorage.getItem('flows')).map(item => {
        item.task_stages.map(it => {
          it.task_details.map(i => {
            if (i.plugin === 'netSignPrepare' && i.dispose[0].serverName) {
              isHasNetSignPrepare.value = true
              hasDeviceList.value.push({ ip: i.dispose[0].serverName })
            }
          })
        })
      })
      console.log(`output->`, isHasNetSignPrepare, hasDeviceList.value)
      if (hasDeviceList.value.length === 0 && !isHasNetSignPrepare.value) {
        const params = {
          page: 1,
          page_size: 100
        }
        let res = await getDeviceApi(params)
        if (res.code === 1000) {
          hasDeviceList.value = res.data.filter(
            item =>
              item.using === false ||
              item.operate_user === null ||
              item.operate_user === JSON.parse(localStorage.getItem('userInfo')).username
          )
          currentDevice.map(item => {
            hasDeviceList.value.map(it => {
              if (item === it.ip) {
                hasDeviceList.value.map(i => {
                  if (i.ip === item) {
                    i.disabled = true
                  }
                })
              }
            })
          })
        }
      } else {
        hasDeviceList.value.map(item => {
          currentDevice.map(it => {
            if (item.ip == it) {
              item.disabled = true
            }
          })
        })
      }
    })
  }
)

const getNetsignVersion = async () => {
  const params = {
    page: 1,
    page_size: 100
  }
  let res = await getNetsignVersionApi(params)
  if (res.code === 1000) {
    netsignVersionList.value = res.data || []
  }
}

const getNetsignBranch = async id => {
  const params = {
    netsign_code_version_id: id
  }
  let res = await getNetsignBranchApi(params)
  if (res.code === 1000) {
    branchList.value = res.data || []
  }
}

let handleChangeTriggered = false // 标志变量
const handleChange = async (file, fileList) => {
  if (handleChangeTriggered) {
    return
  }
  handleChangeTriggered = true
  const formData = new FormData()
  formData.append('upload_file', file.raw)
  let res = await uploadSupplyJarApi(formData)
  if (res.code === 1000) {
    ElMessage.success({
      message: '上传成功',
      type: 'success',
      grouping: true
    })
    nextTick(() => {
      const newObj = {
        name: res.data.file_name || '',
        url: res.data.file_path || ''
      }
      if (deviceList.value[0].jarList) {
        deviceList.value[0].jarList.push(newObj)
        deviceList.value[0].jarList = deviceList.value[0].jarList
          .filter(item => item.url)
          .filter((obj, index, self) => index === self.findIndex(item => item.name === obj.name && item.url === obj.url))
      } else {
        deviceList.value[0].jarList = []
        deviceList.value[0].jarList.push(newObj)
        deviceList.value[0].jarList = deviceList.value[0].jarList
          .filter(item => item.url)
          .filter((obj, index, self) => index === self.findIndex(item => item.name === obj.name && item.url === obj.url))
      }
      handleChangeTriggered = false
    })
  }
}

const closeDrawer = (value?: any) => {
  deviceList.value = JSON.parse(JSON.stringify(disposeList['interfaceTest']))
  emit('closeDrawer', [false, value])
}

const cancelClick = async (done?: () => void) => {
  if (!taskDetailFormRef.value) return
  await taskDetailFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const forms = deviceFormRef.value
      const forms2 = deviceFormRef2.value
      const forms3 = forms.concat(forms2)
      let isAllFormsValid = true
      if (forms && forms2) {
        for (const item of forms3) {
          try {
            const result = await item.validate()
            if (!result) {
              isAllFormsValid = false
            }
          } catch (error) {
            isAllFormsValid = false
          }
        }
      }
      isPassVerification.value = isAllFormsValid
      for (const item of deviceList.value) {
        // item.deviceConfig.log = item.log
        // item.deviceConfig.ifrs = item.ifrs
      }
      // @ts-ignore
      deviceList.value.push(isPassVerification.value)
      // @ts-ignore
      deviceList.value.push(taskDetailForm.name)
      closeDrawer(deviceList.value)
      // done()
    } else {
      console.log('error submit!', fields)
      ElMessage.error('任务名称不能为空！')
    }
  })
}

const deleteTask = () => {
  emit('deleteTask')
}

const cloneObj = obj => {
  let ret
  if (Array.isArray(obj)) {
    //创建一个空数组
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

const selectDevice = async val => {
  // 循环currentFlows.value，判断哪个对象中的name包含'准备'，就取出该对象的task_stages
  let task_stages = []
  selectDeviceList.value = []
  for (let i = 0; i < currentFlows.value.length; i++) {
    if (currentFlows.value[i].name.includes('准备')) {
      task_stages = currentFlows.value[i].task_stages
    }
  }
  // 循环task_stages中的每个对象
  task_stages.map(item => {
    selectDeviceList.value.push({ ip: item.task_details[0].dispose[0].serverName })
  })
  // selectDeviceList.value去除重复的ip
  selectDeviceList.value = Array.from(new Set(selectDeviceList.value))
  // if (val) {
  //   const params = {
  //     page: 1,
  //     page_size: 100
  //   }
  //   let res = await getDeviceApi(params)
  //   if (res.code === 1000) {
  //     selectDeviceList.value = res.data.filter(item => item.using === false)
  //   }
  // }
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

    // deviceList.value[index].pendingVersion = ''
    deviceList.value[index].packagePath = ''
    deviceList.value[index].packageID = null

    // 修改配置文件
    // deviceList.value[index].log = getInterfaceTestConfigurationFile(
    //   res.data.ip,
    //   res.data.port,
    //   res.data.username,
    //   res.data.password,
    //   val.serverName
    // )
    console.log(`output->deviceList.value[index]`, deviceList.value[index].log)
  }
}

const selectProduct = async val => {
  selectProductList.value = []
  // currentFlows.value.map(item => {
  //   item.task_stages.map(it => {
  //     it.task_details.map(i => {
  //       if (i.plugin === 'netSignArrange') {
  //         selectProductList.value.push({ file_name: i.dispose[0].packageName, id: i.dispose[0].packageID })
  //       }
  //     })
  //   })
  // })

  // selectProductList.value = removeDuplicateObj(selectProductList.value)
  if (selectProductList.value.length === 0) {
    if (val.showServerConfig[1].value) {
      const params = {
        main_board_type: val.showServerConfig[1].value === 'x86' ? 'x86' : 'other'
      }
      let res = await getAllProductPackagApi(params)
      if (res.code === 1000) {
        selectProductList.value = selectProductList.value.concat(res.data['main'], res.data['project'])
      }
    }
  }
}

const removeDuplicateObj = arr => {
  let obj = {}
  arr = arr.reduce((newArr, next) => {
    obj[next.file_name] ? '' : (obj[next.file_name] = true && newArr.push(next))
    return newArr
  }, [])
  return arr
}

const getBranchList = val => {
  if (val) {
    if (deviceList.value[0].netsignVersion === '') {
      ElMessage.error('请先选择适用版本！')
    } else {
      getNetsignBranch(netsign_code_version_id.value)
    }
  }
}

const getProductInfo = async (val, index, type?) => {
  selectProductList.value.map(it => {
    if (it.file_name === val.pendingVersion) {
      deviceList.value[index].packagePath = it.file_path
      deviceList.value[index].packageID = it.id
    }
    if (val.pendingVersion.includes('.zip')) {
      deviceList.value[index].jarList = []
    }
  })
  if (type === 'version') {
    deviceList.value[0].branch = ''
    netsignVersionList.value.map(item => {
      if (item.name === val.netsignVersion) {
        netsign_code_version_id.value = item.id
      }
    })
  }
}

const handleFullscreen = (val, id) => {
  configFileDialog.value = true
  configFileDialogTitle.value = `【${val.serverName}】的配置文件`
  configFileDialogLog.value = val.log
  configId.value = id
}

const changePendingVersionOrigin = (val, index) => {
  deviceList.value[index].pendingVersion = ''
}

const onCodeChange = val => {
  deviceList.value.map((item, index) => {
    if (index === configId.value) {
      item.log = val
    }
  })
}
</script>

<style lang="scss">
.netSignProjectDeploy-drawer {
  width: 35% !important;
  .configFileDialogStyle {
    .el-dialog__body {
      padding: 0px !important;
    }
  }
  .log-item {
    .el-form-item__label {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .config-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0px;
      width: 100%;
      .screen-icon {
        color: #606266 !important;
        font-size: 20px;
        cursor: pointer;
      }
      .screen-icon:hover {
        color: #409eff !important;
      }
    }
  }

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
      width: 20px;
      height: 20px;
      text-align: center;
    }

    .changeDelete .grayDelete {
      color: #72767b;
      display: inline-block;
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

  .netSignProjectDeploy-ruleForm {
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
      justify-content: space-between;
      display: flex;
      padding: 20px;
      padding-bottom: 0px;
      margin-left: 20px;
      margin-bottom: 20px;
      position: relative;
      background-color: #f5f5f5;

      .device-ruleForm {
        .el-select {
          width: 400px;
        }
        .input-width {
          width: 400px;
        }
      }

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
      .config-card {
        width: 520px !important;
        .el-card__header {
          padding: 9px 14px;
        }
        .el-card__body {
          padding: 8px 15px 10px 15px;

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
        width: 112%;
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

<style lang="scss" scoped>
.upload-demo {
  min-width: 11vw;
  .el-upload__tip {
    color: #f56c6c !important;
  }
  .file_name {
    margin-left: 10px;
    display: inline-block;
  }
}
</style>
