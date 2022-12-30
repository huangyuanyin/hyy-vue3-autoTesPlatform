<template>
  <div>
    <el-card class="task-card">
      <div class="title">
        <el-icon @click="onCancel(taskRuleFormRef)">
          <Back />
        </el-icon>
        <span>创建任务</span>
      </div>
      <el-form :inline="false" :model="taskForm" ref="taskRuleFormRef" :rules="taskFormRules" class="task-form" label-width="80px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskForm.taskName" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="版本" prop="userName">
          <el-input v-model="taskForm.userName" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="脚本" prop="userName">
          <el-input v-model="taskForm.userName" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="仪器" prop="status">
          <el-select v-model="taskForm.status" placeholder="请选择...">
            <el-option label="状态一" value="shanghai" />
            <el-option label="状态二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="status">
          <el-select v-model="taskForm.status" placeholder="请选择...">
            <el-option label="状态一" value="shanghai" />
            <el-option label="状态二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="status">
          <el-select v-model="taskForm.status" placeholder="请选择...">
            <el-option label="状态一" value="shanghai" />
            <el-option label="状态二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item class="button-wrap">
          <el-button @click="onCancel(taskRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="onAddTaskDorm(taskRuleFormRef)">创建任务</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { instrumentManagementData } from './data.js'
import { Back } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {
    Back
  },
  setup() {
    const router = useRouter()
    const tableData = ref(instrumentManagementData)
    const taskForm = reactive({
      taskName: '',
      userName: '',
      password: '',
      interface: '',
      status: ''
    })
    const taskRuleFormRef = ref<FormInstance>()
    const taskFormRules = reactive<FormRules>({
      taskName: [{ required: true, message: 'ip不能为空', trigger: 'blur' }],
      userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      interface: [{ required: true, message: '请填写设备接口情况', trigger: 'blur' }],
      status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
    })
    const onCancel = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      router.go(-1)
    }
    const onAddTaskDorm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!', fields)
        }
      })
    }
    return {
      router,
      tableData,
      taskForm,
      onAddTaskDorm,
      onCancel,
      taskRuleFormRef,
      taskFormRules
    }
  }
})
</script>

<style lang="scss" scoped>
.task-card {
  height: 100%;

  .title {
    .el-icon {
      font-size: 24px;
      vertical-align: bottom;
      margin-right: 10px;
      cursor: pointer;
    }

    span {
      font-weight: 800;
      line-height: 24px;
    }
  }

  .task-form {
    margin-top: 20px;
    width: 20%;

    :deep(.el-select) {
      width: 245px;
    }

    .button-wrap {
      margin-top: 30px;

      :deep(.el-form-item__content) {
        margin-left: 0px !important;
        justify-content: end;
      }
    }
  }
}
</style>
