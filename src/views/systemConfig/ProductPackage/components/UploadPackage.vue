<template>
  <el-dialog v-model="dialogFormVisible" title="上传包">
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item label="" label-width="140px">
        <el-upload
          class="upload-demo"
          style="width: 28%"
          drag
          action=""
          multiple
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件至此处或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="包类别" label-width="140px" prop="region">
        <el-select v-model="form.region" placeholder="请选择包类别">
          <el-option label="全量包" value="shanghai" />
          <el-option label="基线包" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 上传 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits(['cancel'])
const dialogFormVisible = ref(false)
const form = reactive({
  region: ''
})
const uploadFileList = ref([]) //文件列表
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  region: [{ required: true, message: '请选择包类别', trigger: 'change' }]
})

watch(
  () => props.dialog,
  () => {
    dialogFormVisible.value = props.dialog
  }
)

// 文件上传
const handleUpload = async (file, fileList) => {
  uploadFileList.value = fileList[0]
}

const handleExceed = (files, fileList) => {
  ElMessage.error('一次只能上传一个包！')
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (uploadFileList.value.length <= 0) {
        ElMessage.error('至少上传一个包！')
        return
      }
      const fd = new FormData()
      fd.append('file', uploadFileList.value)
      fd.append('region', form.region)
      uploadFileList.value.length = 0
      formEl.resetFields()
      emit('cancel', false)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const cancel = (formEl: FormInstance | undefined) => {
  formEl.resetFields()
  emit('cancel', false)
}
</script>

<style lang="scss" scoped></style>
