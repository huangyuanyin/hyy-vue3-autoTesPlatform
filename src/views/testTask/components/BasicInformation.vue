<template>
  <div class="BasicInformation-wrap">
    <el-card shadow="never">
      <el-form ref="taskFormRef" :model="taskForm" :rules="taskRules" label-width="120px" class="demo-taskForm" size="default" status-icon>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="back">返回</el-button>
          <el-button type="primary" @click="submitForm(taskFormRef)"> 下一项 </el-button>
          <el-button @click="resetForm(taskFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['changeActive'])
const taskFormRef = ref<FormInstance>()
const taskForm = reactive({
  name: ''
})
const taskRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 3, max: 10, message: '名称在3-10个字符之间', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('changeActive', 1)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const back = () => {
  router.push('/testTask')
}
</script>

<style lang="scss" scoped>
.BasicInformation-wrap {
  margin-top: 20px;
}
</style>
