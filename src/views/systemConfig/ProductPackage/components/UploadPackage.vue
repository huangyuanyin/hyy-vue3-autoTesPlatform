<template>
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="40%" :before-close="closeDialog" v-loading="isLoading">
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item label="包名称" label-width="140px" prop="type" v-if="dialogTitle !== '新增'">
        <el-input v-model="form.file_name" :disabled="dialogTitle !== '新增'"></el-input>
      </el-form-item>
      <el-form-item label="包类别" label-width="140px" prop="type">
        <el-select v-model="form.type" placeholder="请选择包类别" :disabled="dialogTitle !== '新增'">
          <el-option label="待测版本" value="baseline" />
          <el-option label="release版本" value="project" />
        </el-select>
      </el-form-item>
      <el-form-item label="标识" label-width="140px" prop="title">
        <el-select v-model="form.title" placeholder="请选择标识">
          <el-option label="信创" value="sar" />
          <el-option label="非信创" value="main" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传方式" label-width="140px" v-if="dialogTitle === '新增'">
        <el-radio-group v-model="form.upload_type">
          <el-radio label="hands">手动上传</el-radio>
          <el-radio label="url_pull">链接拉取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件上传" label-width="140px" v-if="form.upload_type === 'hands' && dialogTitle === '新增'">
        <el-upload
          class="uploadFile-demo"
          style="width: 214px"
          drag
          action=""
          accept=".zip,.tgz"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件至此处或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="拉取地址" label-width="140px" prop="push_path" v-if="form.upload_type === 'url_pull' && dialogTitle === '新增'">
        <el-input v-model="form.push_path" autocomplete="off" placeholder="请输入包的拉取地址" />
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
import { ElMessage, ElLoading } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { addProductPackageApi, editProductPackageApi, getProductPackageApi } from '@/api/NetDevOps/index'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: () => false
  },
  dialogTitle: {
    type: String,
    default: () => ''
  },
  dialogId: {
    type: Number,
    default: () => null
  }
})
const emit = defineEmits(['cancel'])

const dialogFormVisible = ref(false)
const form = reactive({
  file_name: '',
  type: '',
  upload_type: 'hands',
  push_path: '',
  title: ''
})
const uploadFileList = ref([]) //文件列表
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择包类别', trigger: 'change' }],
  push_path: [{ required: true, message: '请输入包的拉取地址', trigger: 'blur' }],
  title: [{ required: true, message: '请输入包的标识', trigger: 'blur' }]
})

watch(
  () => props.dialog,
  () => {
    dialogFormVisible.value = props.dialog
  }
)

// 文件上传
const handleUpload = async (file, fileList) => {
  uploadFileList.value = fileList[0].raw
  console.log(`output->uploadFileList.value`, uploadFileList.value)
}

const handleExceed = (files, fileList) => {
  ElMessage.error('一次只能上传一个包！')
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      delete form.file_name
      if (form.upload_type === 'hands' && uploadFileList.value.length <= 0 && props.dialogTitle === '新增') {
        ElMessage.error('至少上传一个包！')
        return
      }
      const fd = new FormData()
      fd.append('upload_file', uploadFileList.value instanceof Array ? uploadFileList.value[0] : uploadFileList.value)
      fd.append('type', form.type)
      fd.append('upload_type', form.upload_type)
      fd.append('title', form.title)
      props.dialogTitle === '新增' ? addProductPackage(form.upload_type === 'hands' ? fd : form) : editProductPackage(form)
    }
  })
}

const addProductPackage = async (data: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: '文件上传中，请稍后...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const res = await addProductPackageApi(data)
  loading.close()
  if (res.code === 1000) {
    form.push_path = ''
    ruleFormRef.value.resetFields()
    emit('cancel', false)
    ElMessage.success('新增成功！')
  }
}

const editProductPackage = async (data: any) => {
  data.product_package_id = props.dialogId
  const res = await editProductPackageApi(data)
  if (res.code === 1000) {
    form.push_path = ''
    ruleFormRef.value.resetFields()
    emit('cancel', false)
    ElMessage.success('编辑成功！')
  }
}

const closeDialog = () => {
  ruleFormRef.value.resetFields()
  emit('cancel', false)
}

const cancel = (formEl: FormInstance | undefined) => {
  uploadFileList.value = []
  formEl.resetFields()
  emit('cancel', false)
}

const getProductPackage = async () => {
  const params = {
    product_package_id: props.dialogId
  }
  const res = await getProductPackageApi(params)
  if (res.code === 1000) {
    // 循环res.data，将数据赋值给form
    for (const key in res.data) {
      if (form.hasOwnProperty(key)) {
        form[key] = res.data[key]
      }
    }
  }
}

watch(
  () => props.dialogId,
  () => {
    if (props.dialogId) {
      getProductPackage()
    }
  }
)
</script>

<style lang="scss" scoped>
:deep(.el-input) {
  width: 400px;
}
</style>
