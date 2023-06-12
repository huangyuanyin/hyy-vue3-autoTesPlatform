<template>
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="40%" :before-close="closeDialog">
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item label="包名称" label-width="140px" prop="type" v-if="!dialogTitle.includes('新增')">
        <el-input v-model="form.file_name" :disabled="!dialogTitle.includes('新增')"></el-input>
      </el-form-item>
      <el-form-item label="包类别" label-width="140px" prop="type">
        <el-select v-model="form.type" placeholder="请选择包类别">
          <el-option label="待测版本" value="project" />
          <el-option label="release版本" value="baseline" />
        </el-select>
      </el-form-item>
      <el-form-item label="标识" label-width="140px" prop="title" v-if="dialogTitle.includes('项目版本')">
        <el-select v-model="form.title" placeholder="请选择标识">
          <el-option label="信创" value="sar" />
          <el-option label="非信创" value="main" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传方式" label-width="140px" v-if="dialogTitle.includes('新增')">
        <el-radio-group v-model="form.upload_type">
          <el-radio label="hands">手动上传</el-radio>
          <el-radio label="url_pull" disabled>链接拉取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件上传" label-width="140px" v-if="form.upload_type === 'hands' && dialogTitle.includes('新增')">
        <el-upload
          ref="uploadFile"
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
          <template #tip>
            <div class="el-upload__tip text-red">Tips：一次只能上传一个文件,新文件将会覆盖旧文件</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="拉取地址"
        label-width="140px"
        prop="push_path"
        v-if="form.upload_type === 'url_pull' && dialogTitle.includes('新增')"
      >
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
import { genFileId } from 'element-plus'
import type { FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import {
  addProductPackageApi,
  editProductPackageApi,
  getProductPackageApi,
  addMainProductPackageApi,
  editMainProductPackageApi,
  getMainProductPackageApi
} from '@/api/NetDevOps/index'

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
const uploadFile = ref<UploadInstance>()
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

const handleExceed: UploadProps['onExceed'] = files => {
  uploadFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadFile.value!.handleStart(file)
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { file_name, ...params } = form
      if (form.upload_type === 'hands' && uploadFileList.value.length <= 0 && props.dialogTitle.includes('新增')) {
        ElMessage.error('至少上传一个包！')
        return
      }
      if (
        props.dialogTitle.includes('新增') &&
        !['application/x-zip-msdownload', 'application/x-zip-compressed', 'application/x-compressed'].includes(uploadFileList.value.type)
      ) {
        ElMessage.error('请上传zip或tgz格式的文件！')
        return
      }
      const fd = new FormData()
      fd.append('upload_file', uploadFileList.value instanceof Array ? uploadFileList.value[0] : uploadFileList.value)
      fd.append('type', form.type)
      fd.append('upload_type', form.upload_type)
      props.dialogTitle.includes('主线版本') ? '' : fd.append('title', form.title)
      if (props.dialogTitle.includes('新增')) {
        props.dialogTitle === '新增主线版本'
          ? addMainProductPackage(form.upload_type === 'hands' ? fd : params)
          : addProductPackage(form.upload_type === 'hands' ? fd : params)
      } else {
        props.dialogTitle === '编辑主线版本' ? delete params.title && editMainProductPackage(params) : editProductPackage(params)
      }
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
    cancel(ruleFormRef.value)
    ElMessage.success('新增成功！')
  }
}

const editProductPackage = async (data: any) => {
  data.product_package_id = props.dialogId
  const res = await editProductPackageApi(data)
  if (res.code === 1000) {
    form.push_path = ''
    cancel(ruleFormRef.value)
    ElMessage.success('编辑成功！')
  }
}

const addMainProductPackage = async (data: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: '文件上传中，请稍后...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const res = await addMainProductPackageApi(data)
  loading.close()
  if (res.code === 1000) {
    form.push_path = ''
    cancel(ruleFormRef.value)
    ElMessage.success('新增成功！')
  }
}

const editMainProductPackage = async (data: any) => {
  data.main_product_package_id = props.dialogId
  const res = await editMainProductPackageApi(data)
  if (res.code === 1000) {
    form.push_path = ''
    cancel(ruleFormRef.value)
    ElMessage.success('编辑成功！')
  }
}

const closeDialog = () => {
  cancel(ruleFormRef.value)
}

const cancel = (formEl: FormInstance | undefined) => {
  // uploadFile.value.clearFiles()
  uploadFileList.value = []
  if (props.dialogTitle.includes('新增')) {
    uploadFile.value.clearFiles()
  }
  ruleFormRef.value.resetFields()
  formEl.resetFields()
  emit('cancel', false)
}

const getProductPackage = async () => {
  const params = {
    product_package_id: props.dialogId
  }
  const res = await getProductPackageApi(params)
  if (res.code === 1000) {
    for (const key in res.data) {
      if (form.hasOwnProperty(key)) {
        form[key] = res.data[key]
      }
    }
  }
}

const getMainPackage = async () => {
  const params = {
    main_product_package_id: props.dialogId
  }
  const res = await getMainProductPackageApi(params)
  if (res.code === 1000) {
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
      props.dialogTitle === '编辑项目版本' ? getProductPackage() : getMainPackage()
    }
  }
)
</script>

<style lang="scss" scoped>
:deep(.el-input) {
  width: 400px;
}
.uploadFile-demo {
  width: auto !important;
  :deep(.el-upload) {
    width: 214px;
  }
  :deep(.el-upload-list__item-info, .el-upload-list) {
    width: auto;
  }
  :deep(.el-upload-list__item) {
    width: 110%;
  }
  :deep(.el-upload__tip) {
    color: #f56c6c;
  }
}
</style>
