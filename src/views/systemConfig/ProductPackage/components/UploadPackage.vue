<template>
  <el-dialog v-model="dialogFormVisible" title="新增" width="40%">
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item label="包类别" label-width="140px" prop="region">
        <el-select v-model="form.region" placeholder="请选择包类别">
          <el-option label="基线包" value="beijing" />
          <el-option label="项目包" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传方式" label-width="140px">
        <el-radio-group v-model="uploadType">
          <el-radio label="fileType">手动上传</el-radio>
          <el-radio label="linkType">链接拉取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件上传" label-width="140px" v-if="uploadType === 'fileType'">
        <el-upload
          class="uploadFile-demo"
          style="width: 214px"
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
      <el-form-item label="拉取地址" label-width="140px" prop="url" v-if="uploadType === 'linkType'">
        <el-input v-model="form.url" autocomplete="off" placeholder="请输入包的拉取地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
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
const uploadType = ref('fileType')
const form = reactive({
  region: '',
  url: ''
})
const uploadFileList = ref([]) //文件列表
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  region: [{ required: true, message: '请选择包类别', trigger: 'change' }],
  url: [{ required: true, message: '请输入包的拉取地址', trigger: 'blur' }]
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
      if (uploadType.value === 'fileType' && uploadFileList.value.length <= 0) {
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

<style lang="scss" scoped>
:deep(.el-input) {
  width: 400px;
}
</style>
