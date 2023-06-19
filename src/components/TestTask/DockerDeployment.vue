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
        <span class="title">Docker配置</span>
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
                <el-select v-model="item.serverName" placeholder="请选择设备" :key="index" @change="selectDevice">
                  <el-option
                    :label="item.ip"
                    :value="item.ip"
                    v-for="(item, index) in hasDeviceList"
                    :key="'hasDeviceList' + index"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="容器数量" prop="number" :required="true">
                <el-input v-model="item.number" placeholder="请输入容器数量" :maxlength="5" @input="limitNumericInput" />
              </el-form-item>
              <el-form-item label="文件上传">
                <el-upload
                  ref="uploadFile"
                  class="uploadFile-demo"
                  v-model="item.file_name"
                  drag
                  action=""
                  accept=""
                  :limit="1"
                  with-credentials
                  :show-file-list="false"
                  :on-change="handleChange"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">拖拽文件至此处或<em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip" style="color: red">Tips：一次只能上传一个文件,新文件将会覆盖旧文件</div>
                    <div v-if="item.file_name" style="display: flex; align-items: center; justify-content: space-between">
                      <div>{{ item.file_name }}</div>
                      <el-icon class="clearFile" @click="clearFile"><CloseBold /></el-icon>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="shell脚本" class="executeCommand-item">
                <CodeMirror :code="item.shell" :codeStyle="{ height: '30vh', width: '29vw' }" @onCodeChange="onShellChange" />
              </el-form-item>
            </el-form>
          </div>
        </div>
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
import { ElMessage, FormInstance, FormRules, UploadProps, UploadRawFile, genFileId, UploadInstance } from 'element-plus'
import { CloseBold, FullScreen, UploadFilled } from '@element-plus/icons-vue'
import { getDockerDeviceManageApi, getProductPackageApi, uploadSupplyJarApi } from '@/api/NetDevOps/index'
import { disposeList } from '../../views/lane/data'
import CodeMirror from '@/components/CodeMirror.vue'

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
  pendingVersion: [{ required: true, message: '请输入待测版本', trigger: 'blur' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  ifrs: [{ required: true, message: '是否重启服务为必填项', trigger: 'change' }]
})
const deviceList = ref(JSON.parse(JSON.stringify(disposeList['dockerDeployment'])))
const deviceFormRef = ref([])
const deviceFormRules = reactive<FormRules>({
  number: [{ required: true, message: '容器数量不能为空', trigger: 'blur' }],
  shell: [{ required: true, message: 'shell脚本不能为空', trigger: 'blur' }],
  file_name: [{ required: true, message: '文件不能为空', trigger: 'change' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  pendingVersion: [{ required: true, message: '待测版本不能为空', trigger: 'blur' }]
})
let currentFlows = ref(JSON.parse(localStorage.getItem('flows')))
const isPassVerification = ref(false)
const hasDeviceList = ref([])
const uploadFile = ref<UploadInstance>()

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
  async () => {
    let currentDevice = []
    currentFlows.value.map(item => {
      item.task_stages.map(it => {
        it.task_details.map(i => {
          if (i.plugin === 'dockerDeployment') {
            currentDevice.push(i.dispose[0].serverName)
          }
        })
      })
    })

    // @ts-ignore
    deviceList.value = props.taskDetailInfo
    hasDeviceList.value = []
    if (hasDeviceList.value.length === 0) {
      const params = {
        page: 1,
        page_size: 100
      }
      let res = await getDockerDeviceManageApi(params)
      if (res.code === 1000) {
        hasDeviceList.value = res.data
        // 遍历currentDevice和hasDeviceList，如果currentDevice中的设备在hasDeviceList中，则将其置为不可选
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
          if (item.ip === it) {
            item.disabled = true
          }
        })
      })
    }
  }
)

const selectDevice = val => {
  hasDeviceList.value.map(item => {
    if (item.ip === val) {
      deviceList.value[0].serverConfig = {
        ip: item.ip,
        port: item.port,
        username: item.username,
        password: item.password
      }
      deviceList.value[0].showServerConfig[0].value = item.ip
      deviceList.value[0].showServerConfig[1].value = item.username
      deviceList.value[0].showServerConfig[2].value = item.port
    }
  })
}

const limitNumericInput = val => {
  deviceList.value[0].number = val.replace(/\D/g, '')
}

const clearFile = () => {
  deviceList.value[0].file_name = ''
  deviceList.value[0].file_path = ''
}

// 文件上传
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
      deviceList.value[0].file_name = res.data.file_name
      deviceList.value[0].file_path = res.data.file_path
      handleChangeTriggered = false
    })
  }
}

const closeDrawer = (value?: any) => {
  deviceList.value = JSON.parse(JSON.stringify(disposeList['dockerDeployment']))
  emit('closeDrawer', [false, value])
}

const cancelClick = async (done?: () => void) => {
  if (!taskDetailFormRef.value) return
  await taskDetailFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const forms = deviceFormRef.value
      let isAllFormsValid = true
      if (forms) {
        for (const item of forms) {
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
      // @ts-ignore
      deviceList.value.push(isPassVerification.value)
      // @ts-ignore
      deviceList.value.push(taskDetailForm.name)
      console.log(`output->devdeviceList.value`, deviceList.value)
      closeDrawer(deviceList.value)
    } else {
      console.log('error submit!', fields)
      ElMessage.error('任务名称不能为空！')
    }
  })
}

const deleteTask = () => {
  emit('deleteTask')
}

const onCodeChange = val => {
  deviceList.value.map((item, index) => {
    if (index === configId.value) {
      item.log = val
    }
  })
}

const onShellChange = val => {
  deviceList.value[0].shell = val
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
    :deep(.el-input) {
      width: 30vw !important;
    }
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
      margin-left: 20px;
      margin-bottom: 20px;
      position: relative;
      background-color: #f5f5f5;

      .device-ruleForm {
        .el-select {
          width: 400px;
        }
        .el-input {
          width: 400px;
        }
        .input-width {
          width: 400px;
        }
        .uploadFile-demo {
          width: 29vw;
          .el-upload-dragger {
            background: #f5f5f5;
          }
          .clearFile:hover {
            cursor: pointer;
            color: red;
          }
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
