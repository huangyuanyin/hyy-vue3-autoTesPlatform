<template>
  <el-drawer
    v-model="ishowDrawer"
    direction="rtl"
    @close="cancelClick(taskDetailFormRef)"
    custom-class="taskDetail-drawer"
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
        class="taskDetail-ruleForm"
        size="default"
        label-position="top"
        status-icon
      >
        <el-form-item label="阶段名称" prop="name">
          <el-input v-model="taskDetailForm.name" placeholder="请输入阶段名称" />
        </el-form-item>
        <!-- <el-form-item label="可选设备" prop="name">
          <el-select v-model="taskDetailForm.serverName" placeholder="请选择设备">
            <el-option label="10.20.85.30" value="10.20.85.30" />
            <el-option label="10.20.85.31" value="10.20.85.31" />
          </el-select>
        </el-form-item>
        <el-form-item label="" v-if="taskDetailForm.serverName">
          <el-card class="box-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>设备信息展示</span>
              </div>
            </template>
            <ul>
              <li v-for="(item, index) in serverConfigList" :key="'serverConfigList' + index">
                <div>
                  {{ item.label }}<span>{{ item.value }}</span>
                </div>
              </li>
            </ul>
          </el-card>
        </el-form-item> -->
        <!-- <el-form-item label="主板类型" prop="main_bord_type">
          <el-select v-model="taskDetailForm.main_bord_type" placeholder="请选择主板类型">
            <el-option label="C4600" value="C4600" />
            <el-option label="x86" value="x86" />
          </el-select>
        </el-form-item>
        <el-form-item label="部署类型" prop="deployType">
          <el-select v-model="taskDetailForm.deployType" placeholder="请选择部署类型">
            <el-option label="全量基线" value="full" />
            <el-option label="项目基线" value="baseline" />
          </el-select>
        </el-form-item>
        <el-form-item label="全量基线版本列表" prop="deployVersion" v-if="taskDetailForm.deployType === 'full'">
          <el-select v-model="taskDetailForm.deployVersion" placeholder="请选择全量基线版本">
            <el-option label="netsign_5_6_2" value="netsign_5_6_2" />
            <el-option label="netsign_5_6_4" value="netsign_5_6_4" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目基线版本列表" prop="patchVersion" v-if="taskDetailForm.deployType === 'baseline'">
          <el-select v-model="taskDetailForm.patchVersion" placeholder="请选择项目基线版本">
            <el-option label="NS_5.5.40.12_u32.1" value="NS_5.5.40.12_u32.1" />
            <el-option label="NS_5.5.40.16_u2.0" value="NS_5.5.40.16_u2.0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否安装HA" prop="ifha">
          <el-radio-group v-model="taskDetailForm.ifha" class="ml-4">
            <el-radio label="y">是</el-radio>
            <el-radio label="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否安装人行模块" prop="ispbc">
          <el-radio-group v-model="taskDetailForm.ispbc" class="ml-4">
            <el-radio label="y">是</el-radio>
            <el-radio label="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否安装农信银模块" prop="isrbc">
          <el-radio-group v-model="taskDetailForm.isrbc" class="ml-4">
            <el-radio label="y">是</el-radio>
            <el-radio label="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="WatchDog是否使用新数据类型" prop="useNewDataType">
          <el-radio-group v-model="taskDetailForm.useNewDataType" class="ml-4">
            <el-radio label="y">是</el-radio>
            <el-radio label="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否生产部门安装" prop="ifback" v-if="taskDetailForm.deployType === 'baseline'">
          <el-radio-group v-model="taskDetailForm.ifback" class="ml-4">
            <el-radio label="y">是</el-radio>
            <el-radio label="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否重启服务" prop="ifrs" v-if="taskDetailForm.deployType === 'baseline'">
          <el-radio-group v-model="taskDetailForm.ifrs" class="ml-4">
            <el-radio label="y">是</el-radio>
            <el-radio label="n">否</el-radio>
          </el-radio-group>
        </el-form-item> 
        <el-form-item
          label="开机自启中间件"
          prop="startMidwareType"
          v-if="taskDetailForm.main_bord_type && taskDetailForm.main_bord_type !== 'x86'"
        >
          <el-select v-model="taskDetailForm.startMidwareType" placeholder="请选择开机自启中间件">
            <el-option label="Tomcat" value="Tomcat" />
            <el-option label="Tongweb" value="Tongweb" />
          </el-select>
        </el-form-item>-->
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
                      <div>
                        {{ item.label }}<span>{{ item.value }}</span>
                      </div>
                    </li>
                  </ul>
                </el-card>
              </el-form-item>
              <el-form-item label="主板类型" prop="main_bord_type">
                <el-select v-model="item.main_bord_type" placeholder="请选择主板类型" :key="index">
                  <el-option label="C4600" value="C4600" />
                  <el-option label="x86" value="x86" />
                </el-select>
              </el-form-item>
              <el-form-item label="部署类型" prop="deployType">
                <el-select v-model="item.deployType" placeholder="请选择部署类型" :key="index">
                  <el-option label="全量基线" value="full" />
                  <el-option label="项目基线" value="baseline" />
                </el-select>
              </el-form-item>
              <el-form-item label="全量基线版本列表" prop="deployVersion" v-if="item.deployType === 'full'">
                <el-select v-model="item.deployVersion" placeholder="请选择全量基线版本" :key="index">
                  <el-option label="netsign_5_6_2" value="netsign_5_6_2" />
                  <el-option label="netsign_5_6_4" value="netsign_5_6_4" />
                </el-select>
              </el-form-item>
              <el-form-item label="项目基线版本列表" prop="patchVersion" v-if="item.deployType === 'baseline'">
                <el-select v-model="item.patchVersion" placeholder="请选择项目基线版本" :key="index">
                  <el-option label="NS_5.5.40.12_u32.1" value="NS_5.5.40.12_u32.1" />
                  <el-option label="NS_5.5.40.16_u2.0" value="NS_5.5.40.16_u2.0" />
                </el-select>
              </el-form-item>
              <el-form-item label="开机自启中间件" prop="startMidwareType" v-if="item.main_bord_type && item.main_bord_type !== 'x86'">
                <el-select v-model="item.startMidwareType" placeholder="请选择开机自启中间件" :key="index">
                  <el-option label="Tomcat" value="Tomcat" />
                  <el-option label="Tongweb" value="Tongweb" />
                </el-select>
              </el-form-item>
              <el-collapse class="collapseItem">
                <el-collapse-item title="更多设置" name="1">
                  <el-form-item label="是否安装HA" prop="ifha">
                    <el-radio-group v-model="item.ifha" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否安装人行模块" prop="ispbc">
                    <el-radio-group v-model="item.ispbc" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否安装农信银模块" prop="isrbc">
                    <el-radio-group v-model="item.isrbc" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="WatchDog是否使用新数据类型" prop="useNewDataType">
                    <el-radio-group v-model="item.useNewDataType" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否生产部门安装" prop="ifback" v-if="item.deployType === 'baseline'">
                    <el-radio-group v-model="item.ifback" class="ml-4" :key="index">
                      <el-radio label="y">是</el-radio>
                      <el-radio label="n">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否重启服务" prop="ifrs" v-if="item.deployType === 'baseline'">
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
  }
})

const emit = defineEmits(['closeDrawer', 'deleteTask'])
const ishowDrawer = ref(false)
const serverConfigList = [
  { label: '设备IP：', value: '10.20.85.30' },
  { label: '用户名：', value: 'root' },
  { label: '端口：', value: '22' },
  { label: '设备型号：', value: '3500' },
  { label: '设备编码：', value: 'Z213NAJ' },
  { label: '密码卡：', value: '国密' }
]
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: ''
  // serverName: '',
  // main_bord_type: '',
  // deployType: '',
  // deployVersion: '',
  // patchVersion: '',
  // ifha: 'y',
  // ispbc: 'y',
  // useNewDataType: 'y',
  // isrbc: 'y',
  // ifback: 'y',
  // ifrs: 'y',
  // startMidwareType: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  serverName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  main_bord_type: [{ required: true, message: '请选择主板类型', trigger: 'change' }],
  deployType: [{ required: true, message: '请选择部署类型', trigger: 'change' }],
  deployVersion: [{ required: true, message: '请选择全量基线版本', trigger: 'change' }],
  patchVersion: [{ required: true, message: '请选择项目基线版本', trigger: 'change' }],
  ifback: [{ required: true, message: '是否生产部门安装项', trigger: 'change' }],
  ispbc: [{ required: true, message: '是否安装人行模块为必填项', trigger: 'change' }],
  useNewDataType: [{ required: true, message: 'WatchDog是否使用新数据类型为必填项', trigger: 'change' }],
  isrbc: [{ required: true, message: '是否安装农信银模块为必填项', trigger: 'change' }],
  ifha: [{ required: true, message: '是否安装HA为必填项', trigger: 'change' }],
  ifrs: [{ required: true, message: '是否重启服务为必填项', trigger: 'change' }],
  startMidwareType: [{ required: true, message: '请选择开机自启中间件', trigger: 'change' }]
})
const deviceList = ref([
  {
    serverName: '',
    main_bord_type: '',
    deployType: '',
    deployVersion: '',
    patchVersion: '',
    ifha: 'y',
    ispbc: 'y',
    useNewDataType: 'y',
    isrbc: 'y',
    ifback: 'y',
    ifrs: 'y',
    startMidwareType: ''
  }
])
const cloneDeviceObj = ref({
  serverName: '',
  main_bord_type: '',
  deployType: '',
  deployVersion: '',
  patchVersion: '',
  ifha: 'y',
  ispbc: 'y',
  useNewDataType: 'y',
  isrbc: 'y',
  ifback: 'y',
  ifrs: 'y',
  startMidwareType: ''
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

const closeDrawer = (value?: any) => {
  deviceList.value = [
    {
      serverName: '',
      main_bord_type: '',
      deployType: '',
      deployVersion: '',
      patchVersion: '',
      ifha: 'y',
      ispbc: 'y',
      useNewDataType: 'y',
      isrbc: 'y',
      ifback: 'y',
      ifrs: 'y',
      startMidwareType: ''
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
      deviceList.value.push(taskDetailForm.name)
      console.log(`保存`, deviceList.value)
      closeDrawer(taskDetailForm)
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
.taskDetail-drawer {
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
                color: #67c23a;
              }
            }
          }
        }
      }
      .collapseItem {
        border: none;
        width: 520px;
      }
      .el-collapse .el-collapse-item {
        background-color: #f5f5f5 !important;
        border: none;
      }
      .el-collapse .el-collapse-item__header {
        border: none;
        color: #606266;
        font-size: 14px;
        background-color: #f5f5f5 !important;
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
    }
  }
  span {
    font-weight: 500;
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>
