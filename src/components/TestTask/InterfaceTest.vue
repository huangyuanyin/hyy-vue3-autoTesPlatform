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
              <el-form-item label="可选设备" prop="serverName" :required="true">
                <el-select v-model="item.serverName" placeholder="请选择设备" :key="index" @change="getDeviceInfo(item, index)">
                  <el-option :label="item.ip" :value="item.ip" v-for="(item, index) in hasDeviceList" :key="'hasDeviceList' + index" />
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
                    <li v-for="(it, index) in item.showServerConfig" :key="'serverConfigList' + index">
                      <div class="detail">
                        {{ it.label }}
                        <el-tooltip class="box-item" effect="dark" :content="it.value" placement="top">
                          <span>{{ it.value }}</span>
                        </el-tooltip>
                      </div>
                    </li>
                  </ul>
                </el-card>
              </el-form-item>
              <el-form-item label="待测版本" prop="packageName" :required="true">
                <el-select
                  v-model="item.packageName"
                  placeholder="请选择待测版本"
                  :key="index"
                  @visible-change="selectProduct(item)"
                  @change="getProductInfo(item, index)"
                >
                  <el-option
                    :label="item.file_name"
                    :value="item.file_name"
                    v-for="(item, index) in selectProductList"
                    :key="'selectProductList' + index"
                  />
                </el-select>
              </el-form-item>
              <el-collapse class="collapseItem">
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
              </el-collapse>
            </el-form>
          </div>
          <div class="device-space-item">
            <el-icon class="delete-icon" @click="deleteDevice(index)">
              <Delete />
            </el-icon>
          </div>
        </div>
        <el-button type="primary" @click="addDeviceForm">+ 添加设备</el-button>
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
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Delete, FullScreen } from '@element-plus/icons-vue'
import { getDeviceApi, getProductPackageApi } from '@/api/NetDevOps/index'
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
const configFileDialogTitle = ref('')
const configFileDialogLog = ref('')
const configId = ref(null)
const ishowDrawer = ref(false)
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  packageName: [{ required: true, message: '请选择项目包', trigger: 'blur' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  ifrs: [{ required: true, message: '是否重启服务为必填项', trigger: 'change' }]
})
const deviceList = ref(JSON.parse(JSON.stringify(disposeList['interfaceTest'])))
const cloneDeviceObj = ref(JSON.parse(JSON.stringify(disposeList['interfaceTest'][0])))
const deviceFormRef = ref([])
const deviceFormRules = reactive<FormRules>({
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  packageName: [{ required: true, message: '请选择项目包', trigger: 'blur' }],
  log: [{ required: true, message: '配置文件不能为空', trigger: 'change' }]
})
const selectDeviceList = ref([])
const selectProductList = ref([])
let currentFlows = ref(JSON.parse(localStorage.getItem('flows')))
const isPassVerification = ref(false)
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
    let isHasNetSignPrepare = false
    JSON.parse(localStorage.getItem('flows')).map(item => {
      item.task_stages.map(it => {
        it.task_details.map(i => {
          if (i.plugin === 'netSignPrepare') {
            isHasNetSignPrepare = true
          }
          if (i.plugin === 'netSignPrepare' && i.dispose[0].serverName) {
            hasDeviceList.value.push({ ip: i.dispose[0].serverName })
          }
        })
      })
    })
    if (hasDeviceList.value.length === 0 && !isHasNetSignPrepare) {
      const params = {
        page: 1,
        page_size: 100
      }
      getDeviceApi(params).then(res => {
        if (res.code === 1000) {
          // 过滤掉using为true的设备
          hasDeviceList.value = res.data.filter(item => item.using === false)
        }
      })
    }
  }
)

const closeDrawer = (value?: any) => {
  deviceList.value = JSON.parse(JSON.stringify(disposeList['interfaceTest']))
  emit('closeDrawer', [false, value])
}

const cancelClick = async (done?: () => void) => {
  if (!taskDetailFormRef.value) return
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
    deviceList.value[index].showServerConfig[4].value = res.data.cavium_card_type
    deviceList.value[index].showServerConfig[5].value = res.data.gm_card_type

    deviceList.value[index].serverConfig.serverIP = res.data.ip
    deviceList.value[index].serverConfig.serverPasswd = res.data.password
    deviceList.value[index].serverConfig.userName = res.data.username
    deviceList.value[index].serverConfig.machineType = res.data.machine_type
    deviceList.value[index].serverConfig.modelCode = res.data.mode_code
    deviceList.value[index].serverConfig.configCode = res.data.config_code

    deviceList.value[index].packageName = ''
    deviceList.value[index].packagePath = ''
    deviceList.value[index].packageID = null

    // 修改配置文件
    deviceList.value[index].log = getInterfaceTestConfigurationFile(
      res.data.ip,
      res.data.port,
      res.data.username,
      res.data.password,
      val.serverName
    )
    console.log(`output->deviceList.value[index]`, deviceList.value[index].log)
  }
}

const selectProduct = async val => {
  selectProductList.value = []
  if (val.showServerConfig[1].value) {
    const params = {
      main_board_type: val.showServerConfig[1].value === 'x86' ? 'x86' : 'other'
    }
    let res = await getProductPackageApi(params)
    if (res.code === 1000) {
      // 过滤掉file_name不包含.zip的
      selectProductList.value = res.data.filter(item => item.file_name.includes('.zip'))
    }
  }
}

const getProductInfo = async (val, index) => {
  selectProductList.value.map(it => {
    if (it.file_name === val.packageName) {
      deviceList.value[index].packagePath = it.file_path
      deviceList.value[index].packageID = it.id
    }
  })
}

const handleFullscreen = (val, id) => {
  configFileDialog.value = true
  configFileDialogTitle.value = `【${val.serverName}】的配置文件`
  configFileDialogLog.value = val.log
  configId.value = id
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
      padding: 20px 20px 0;
      margin-left: 20px;
      margin-bottom: 20px;
      position: relative;
      background-color: #f5f5f5;

      .device-ruleForm {
        .el-select {
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
