<template>
  <el-drawer
    v-model="ishowDrawer"
    direction="rtl"
    :before-close="cancelClick"
    custom-class="ExecuteCommand-drawer"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div class="header">
        <span class="header-edit">编辑</span>
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
        class="ExecuteCommand-ruleForm"
        size="default"
        label-position="top"
        status-icon
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskDetailForm.name" placeholder="请输入阶段名称" />
        </el-form-item>
        <el-form-item label="构建集群" prop="builCluster">
          <el-select v-model="taskDetailForm.builCluster" placeholder="请选择构建集群" @change="getBuilClusterInfo">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in builClusterList" :key="'builClusterList' + index" />
          </el-select>
        </el-form-item>
        <el-form-item label="下载流水线源" prop="dowloadPipelineSource">
          <el-select v-model="taskDetailForm.dowloadPipelineSource" placeholder="请选择下载流水线源" @change="getDowloadPipelineSourceInfo">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in dowloadPipelineSourceList"
              :key="'pipelineSourceList' + index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流水线源" prop="pipelineSource" v-if="taskDetailForm.dowloadPipelineSource === '下载部分流水线源'">
          <el-select v-model="taskDetailForm.pipelineSource" placeholder="请选择流水线源" @change="getPipelineSourceInfo">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in pipelineSourceList"
              :key="'pipelineSourceList' + index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="taskSteps">
              <span>任务步骤</span>
              <div class="taskSteps-icon">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-icon><CirclePlusFilled /></el-icon>添加步骤
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>执行命令</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <ExecuteCommand />
          </template>
        </el-form-item>
        <el-form-item label="任务插件">
          <template #label>
            <div class="taskPlugin">
              <span>任务插件</span>
              <div class="taskPlugin-icon">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-icon><CirclePlusFilled /></el-icon>添加插件
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>邮件通知插件</el-dropdown-item>
                      <el-dropdown-item>企业微信机器人通知插件</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { CirclePlusFilled, CaretRight, CaretBottom, RemoveFilled, Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import CodeMirror from '../CodeMirror.vue'
import ExecuteCommand from './taskStep/ExecuteCommandStep.vue'
import { disposeList } from '@/views/lane/data'

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
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['closeDrawer', 'deleteTask'])

const ishowDrawer = ref(false)
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: '',
  builCluster: '',
  dowloadPipelineSource: '',
  pipelineSource: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  builCluster: [{ required: true, message: '请选择构建集群', trigger: 'blur' }],
  dowloadPipelineSource: [{ required: true, message: '请选择下载流水线源', trigger: 'blur' }],
  pipelineSource: [{ required: true, message: '请选择流水线源', trigger: 'blur' }]
})
const builClusterList = reactive([
  {
    label: '云效北京构建集群',
    value: '云效北京构建集群'
  },
  {
    label: '云效上海构建集群',
    value: '云效上海构建集群'
  }
])
const dowloadPipelineSourceList = reactive([
  {
    label: '下载全部流水线源',
    value: '下载全部流水线源'
  },
  {
    label: '不下载流水线源',
    value: '不下载流水线源'
  },
  {
    label: '下载部分流水线源',
    value: '下载部分流水线源'
  }
])
const pipelineSourceList = reactive([])
const deviceList = ref([])

watch(
  () => props.taskDetailName,
  () => {
    taskDetailForm.name = props.taskDetailName
  }
)

watch(
  () => props.taskDetailDrawer,
  () => {
    console.log(`output->props.taskDetailDrawer`, props.taskDetailDrawer)
    ishowDrawer.value = props.taskDetailDrawer
  }
)

watch(
  () => props.taskDetailInfo,
  () => {
    // @ts-ignore
    deviceList.value = props.taskDetailInfo
    taskDetailForm.builCluster = (props.taskDetailInfo[0] && props.taskDetailInfo[0].builCluster) || ''
    taskDetailForm.dowloadPipelineSource = (props.taskDetailInfo[0] && props.taskDetailInfo[0].dowloadPipelineSource) || ''
    taskDetailForm.pipelineSource = (props.taskDetailInfo[0] && props.taskDetailInfo[0].pipelineSource) || ''
  }
)

const closeDrawer = (value?: any) => {
  deviceList.value = JSON.parse(JSON.stringify(disposeList['netSignArrange']))
  emit('closeDrawer', [false, value])
}

const cancelClick = async (done: () => void) => {
  if (!taskDetailFormRef.value) return
  await taskDetailFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // const forms = deviceFormRef.value
      // if (forms) {
      //   for (const item of forms) {
      //     try {
      //       const result = await item.validate()
      //       if (!result) {
      //         return
      //       }
      //     } catch (error) {
      //       ElMessage.error('该任务有待完善的内容！')
      //       return
      //     }
      //   }
      // }
      // for (const item of deviceList.value) {
      //   item.deviceConfig.ifback = item.ifback
      //   item.deviceConfig.ifrs = item.ifrs
      // }
      deviceList.value = [].concat(taskDetailForm, taskDetailForm.name)
      closeDrawer(deviceList.value)
      done()
    } else {
      console.log('error submit!', fields)
      ElMessage.error('该任务有待完善的内容！')
    }
  })
}

const deleteTask = () => {
  emit('deleteTask')
}

const getBuilClusterInfo = (value: string) => {
  console.log(`output->value`, value)
}

const getDowloadPipelineSourceInfo = (value: string) => {
  console.log(`output->value`, value)
}

const getPipelineSourceInfo = (value: string) => {
  console.log(`output->value`, value)
}
</script>

<style lang="scss">
.ExecuteCommand-drawer {
  width: 35% !important;
  .ExecuteCommand-ruleForm {
    .el-input {
      width: 32vw;
    }
  }
  .el-drawer__header {
    font-size: 14px;
    border-bottom: 1px solid #dbdbdb !important;
    padding: 0px 10px 0 32px;
    height: 60px;
    margin-bottom: 0px;

    svg:hover {
      cursor: pointer;
    }

    .header-edit {
      margin-right: 10px;
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
  .taskSteps,
  .taskPlugin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    margin-bottom: 0px;
    .taskSteps-icon,
    .taskPlugin-icon {
      display: flex;
      align-items: center;
      color: #1890ff;
      cursor: pointer;
      .el-icon {
        font-size: 20px;
        color: #1890ff;
        margin-right: 5px;
      }
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
  .taskSteps-collapse {
    margin-top: 20px;
    .el-collapse-item__arrow {
      display: none;
    }
    .el-collapse-item__header {
      display: flex;
      justify-content: space-between;
      .right-1 {
        font-size: 22px;
        color: #b1b8bf;
      }
      .right-1:hover {
        color: #f56c6c;
      }
    }
    .taskSteps-collapse-icon {
      margin-right: 8px;
    }
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
    .executeCommandForm-wrap {
      padding: 8px 20px 0;
      .executeCommand-item {
        margin-top: 15px;
      }
      .environmentVariable-wrap {
        margin-top: 10px;
        .el-form-item__label {
          display: flex;
          justify-content: flex-start;
          padding-right: 0px;
          .environmentVariable-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 30vw;
            .environmentVariable-label-icon {
              color: #4080c0;
              display: flex;
              align-items: center;
              cursor: pointer;
              .el-icon {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
