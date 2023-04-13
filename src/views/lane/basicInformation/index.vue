<template>
  <div class="basicInformation-wrap">
    <el-card shadow="never">
      <div class="header">
        <span>任务信息</span>
      </div>
      <div class="content">
        <el-form
          ref="basicInformationFormRef"
          :model="basicInformationForm"
          :rules="basicInformationRules"
          label-width="120px"
          class="basicInformation-ruleForm"
          size="default"
          status-icon
        >
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="basicInformationForm.name"
              :disabled="isDisabled"
              placeholder="请输入任务名称..."
              @change="submitForm(basicInformationFormRef)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" v-if="!isDisabled" @click="dialogVisible = true">删除任务</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>

  <!--确认删除弹窗-->
  <el-dialog title="提示" v-model="dialogVisible" width="30%" :before-close="handleClose">
    <span style="color: red; font-size: 16px; font-weight: 600">确认删除该流水线任务？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmDelete(basicInformationFormRef)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRefs } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { deleteTaskInfoApi } from '@/api/NetDevOps'

const emit = defineEmits(['submitName'])
const props = defineProps({
  taskName: {
    type: String,
    default: ''
  }
})
const { taskName } = toRefs(props)

const route = useRoute()
const router = useRouter()
const isDisabled = route.query.type === 'detail' ? true : false
const dialogVisible = ref(false)
const basicInformationForm = reactive({
  name: ''
})
const basicInformationFormRef = ref<FormInstance>()
const basicInformationRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称...', trigger: 'blur' }]
})

watch(
  taskName,
  val => {
    if (taskName) {
      basicInformationForm.name = val
      emit('submitName', basicInformationForm.name)
    }
  },
  { immediate: true }
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('submitName', basicInformationForm.name)
    } else {
      emit('submitName', basicInformationForm.name)
    }
  })
}

const handleClose = (done: any) => {
  done()
}

const handleConfirmDelete = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  deleteTaskInfo(route.query.id)
  formEl.resetFields()
}

const deleteTaskInfo = async id => {
  let res = await deleteTaskInfoApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.basicInformation-wrap {
  background-color: #f2f5f7;
  height: calc(100vh - 207px);
  max-width: 100%;
  padding: 20px 120px 0 120px;
  :deep(.el-card__body) {
    padding: 0px;
  }
  .el-card {
    width: 80%;
    margin: 0 auto;
    height: calc(100% - 20px);
  }
  .header {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e9edf0;
    span {
      padding-left: 17px;
      font-size: 16px;
      color: #292929;
      font-weight: 500;
    }
  }
  .content {
    padding: 30px 40px 0 0px;
  }
}
</style>
