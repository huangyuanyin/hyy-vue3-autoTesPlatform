<template>
  <el-collapse class="taskSteps-collapse" v-model="taskStepsActiveNames" @change="handleTaskStepsChange">
    <el-collapse-item name="1">
      <template #title>
        <div class="left-1">
          <el-icon color="#8b8b8b" class="taskSteps-collapse-icon-up" v-if="!isShow">
            <CaretRight />
          </el-icon>
          <el-icon color="#8b8b8b" class="taskSteps-collapse-icon-down" v-else>
            <CaretBottom />
          </el-icon>
          执行命令
        </div>
        <div class="right-1">
          <el-popconfirm
            width="220"
            confirm-button-text="确认"
            cancel-button-text="取消"
            :icon="CircleCloseFilled"
            icon-color="#F56C6C"
            title="确认删除步骤?"
          >
            <template #reference>
              <el-icon @click.stop="openDeleteStepsDialog"><RemoveFilled /></el-icon>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <div class="executeCommandForm-wrap">
        <el-form
          ref="executeCommandFormRef"
          :model="executeCommandForm"
          :rules="executeCommandFormRules"
          label-width="220px"
          class="executeCommand-ruleForm"
          size="default"
          label-position="top"
          status-icon
        >
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="executeCommandForm.name" placeholder="请输入步骤名称" />
          </el-form-item>
          <el-form-item label="执行命令" prop="name" class="executeCommand-item">
            <CodeMirror :code="codeMirrorInput" :codeStyle="{ height: '30vh', width: '30vw' }" />
          </el-form-item>
          <el-form-item class="environmentVariable-wrap">
            <template #label>
              <div class="environmentVariable-label">
                <span>环境变量</span>
                <div class="environmentVariable-label-icon">
                  <el-dropdown @command="addEnvironment">
                    <span class="el-dropdown-link">
                      <el-icon><Plus /></el-icon>
                      <span>添加</span>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="a">自定义参数</el-dropdown-item>
                        <el-dropdown-item disabled>上游任务 制品/镜像 下载地址</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-form-item>
          <div class="environmentVariableList" v-for="(item, index) in environmentVariableList" :key="'environmentVariableList' + index">
            <el-form ref="environmentVariableFormRef" :model="item" :rules="environmentVariableRules">
              <div style="display: flex; margin-bottom: 15px">
                <el-form-item :key="index" prop="userName">
                  <el-input class="item-name" v-model="item.userName" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input class="item-value" v-model="item.password" placeholder="请输入值"></el-input>
                </el-form-item>
                <el-button type="danger" @click="removeEnvironmentVariable(index)">删除</el-button>
              </div>
            </el-form>
          </div>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { CirclePlusFilled, CaretRight, CaretBottom, RemoveFilled, Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import { FormRules } from 'element-plus'
import CodeMirror from '@/components/CodeMirror.vue'

const taskStepsActiveNames = ref<string[]>(['1'])
const isShow = ref<boolean>(true)
const executeCommandForm = reactive({
  name: ''
})
const executeCommandFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入执行命令', trigger: 'blur' }]
})
const codeMirrorInput = ref('# input your command  here \necho hello,world!')
const environmentVariableList = reactive([])
const environmentVariableFormRef = ref()
const environmentVariableRules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入值', trigger: 'blur' }]
})

const handleTaskStepsChange = (value: string[]) => {
  console.log(`output->value`, value)
  isShow.value = !isShow.value
}

const openDeleteStepsDialog = () => {
  console.log('openDeleteStepsDialog')
}

const addEnvironment = (command: string | number | object) => {
  console.log(`output->a`, command)
  switch (command) {
    case 'a':
      environmentVariableList.push({
        userName: '',
        password: ''
      })
      break
    default:
      break
  }
}

const removeEnvironmentVariable = index => {
  environmentVariableList.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.environmentVariableList {
  .item-name {
    width: 200px !important;
    margin-right: 20px !important;
  }
  .item-value {
    width: 250px !important;
    margin-right: 20px !important;
  }
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #4080c0;
}
</style>
