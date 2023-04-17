<template>
  <el-drawer
    v-model="ishowDrawer"
    direction="rtl"
    @close="cancelClick(taskDetailFormRef)"
    custom-class="netSignProjectDeploy-drawer"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div class="header">
        <span class="">编辑</span>
        <div class="changeDelete">
          <svg-icon class="grayDelete" @click="deleteTask" iconName="icon-changyonggoupiaorenshanchu"></svg-icon>
          <svg-icon class="redDelete" @click="deleteTask" iconName="icon-changyonggoupiaorenshanchu-copy"></svg-icon>
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
              :rules="deviceFormRules"
              label-width="220px"
              class="device-ruleForm"
              size="default"
              label-position="top"
              status-icon
            >
              <el-form-item label="可选设备" prop="name">
                <el-select v-model="item.serverName" placeholder="请选择设备" :key="index">
                  <el-option label="10.20.85.30" value="10.20.85.30" />
                  <el-option label="10.20.85.31" value="10.20.85.31" />
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
                    <li v-for="(item, index) in serverConfigList" :key="'serverConfigList' + index">
                      <div class="detail">
                        {{ item.label }}
                        <el-tooltip class="box-item" effect="dark" :content="item.value" placement="top">
                          <span>{{ item.value }}</span>
                        </el-tooltip>
                      </div>
                    </li>
                  </ul>
                </el-card>
              </el-form-item>
              <el-form-item label="项目包" prop="packageName">
                <el-select v-model="item.packageName" placeholder="请选择项目包" :key="index">
                  <el-option label="SongJiang1.1_NetSignServer5.6.50.4-full.zip" value="SongJiang1.1_NetSignServer5.6.50.4-full.zip" />
                  <!-- <el-option label="SongJiang1.1_NetSignServer5.6.50.4-full.zip" value="SongJiang1.1_NetSignServer5.6.50.4-full.zip" /> -->
                </el-select>
              </el-form-item>
              <el-collapse class="collapseItem">
                <el-collapse-item name="1">
                  <template #title>
                    <el-button text type="primary"> 高级设置 </el-button>
                  </template>
                  <el-form-item label="是否生产部门安装" prop="ifback">
                    <el-radio-group v-model="item.ifback" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否重启服务" prop="ifrs">
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
        <el-button type="primary" @click="addDeviceForm">+ 添加设备</el-button>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick(taskDetailFormRef)">取消</el-button>
        <el-button type="primary" @click="confirmClick(taskDetailFormRef)">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

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
const serverConfigList = [
  { label: '设备IP：', value: '10.20.85.30' },
  { label: '主板类型:', value: 'x86' },
  { label: '设备型号：', value: '3500' },
  { label: '设备编码：', value: 'Z213NAJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ' },
  { label: 'cavium卡：', value: 'cavium卡' },
  { label: '国密卡：', value: '国密卡' }
]
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  packageName: [{ required: true, message: '请选择项目包', trigger: 'change' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  ifback: [{ required: true, message: '是否生产部门为必填项', trigger: 'change' }],
  ifrs: [{ required: true, message: '是否重启服务为必填项', trigger: 'change' }]
})
const deviceList = ref([
  {
    serverName: '',
    packageName: '',
    main_bord_type: '',
    deployType: '',
    ifback: 'n',
    ifrs: 'y'
  }
])
const cloneDeviceObj = ref({
  serverName: '',
  packageName: '',
  main_bord_type: '',
  deployType: '',
  ifback: 'n',
  ifrs: 'y'
})
const deviceFormRules = reactive<FormRules>({})
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
    console.log(`output->dev`, deviceList.value)
  }
)

const closeDrawer = (value?: any) => {
  deviceList.value = [
    {
      serverName: '',
      packageName: '',
      main_bord_type: '',
      deployType: '',
      ifback: 'n',
      ifrs: 'y'
    }
  ]
  emit('closeDrawer', [false, value])
}

const cancelClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  closeDrawer()
}

const confirmClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
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
</script>

<style lang="scss">
.netSignProjectDeploy-drawer {
  width: 35% !important;
  .el-drawer__header {
    font-size: 14px;
    border-bottom: 1px solid #dbdbdb !important;
    padding: 0px 10px 0 32px;
    height: 60px;
    margin-bottom: 0px;
    svg:hover {
      cursor: pointer;
    }
    .changeDelete {
      display: inline-block;
    }
    .changeDelete .grayDelete {
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
