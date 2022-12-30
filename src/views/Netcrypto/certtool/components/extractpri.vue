<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef" size="large" label-width="100px">
      <el-form-item label="证书类型" prop="certype">
        <el-radio-group v-model="form.cerType">
          <el-radio label="rsa">RSA证书</el-radio>
          <el-radio label="sm2">国密证书</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="证书方式" prop="method">
        <el-radio-group v-model="form.method">
          <el-radio label="upload">本地上传</el-radio>
          <el-radio label="local">平台证书</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择证书" v-if="form.method == 'local'" prop="certpath">
        <el-cascader v-model="form.certpath" :options="certfiles" :show-all-levels="false"> </el-cascader>
      </el-form-item>
      <el-form-item v-if="form.method == 'upload'">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="myfile"
          drag
          :on-change="handleChange"
          :limit="1"
          :on-exceed="handleExceed"
          accept=".pri,.pfx"
          :file-list="fileList"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="私钥口令" prop="pwd">
        <el-input v-model="form.pwd" style="width: 25%" placeholder="请输入私钥口令"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickHandle">提取私钥</el-button>
      </el-form-item>
      <el-form-item>
        <el-input style="width: 95%" v-model="result" type="textarea" :autosize="{ minRows: 10, maxRows: 10 }" placeholder="私钥数据">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getPlain } from '@/api/Netcrypto/pressure'
import { getPriKey } from '@/api/Netcrypto/openssl'

const certfiles = ref([]) // 文件数据列表
const fileList = ref([]) // 上传文件
const files = ref([])
const result = ref('') // 私钥数据
// 表单
const form = reactive({
  cerType: '',
  method: 'upload',
  certpath: '',
  pwd: ''
})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  certype: [{ required: true, message: '请选择使用证书类型', trigger: 'blur' }],
  method: [{ required: true, message: '请选择使用证书方式', trigger: 'blur' }],
  certpath: [{ required: true, message: '请选择平台已有证书', trigger: 'change' }],
  pwd: [{ required: true, message: '请输入私钥口令', trigger: 'blur' }]
})

onMounted(() => {
  getFilesList()
})

// 获取数据列表
const getFilesList = async () => {
  let res = await getPlain(null)
  let { msg, code, data } = res
  if (code == '1000') {
    certfiles.value = data
  } else {
    ElMessage.error({
      message: msg,
      center: true
    })
  }
}

// 监听上传文件数目，此处限制1个
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}

const handleChange = (file, fileList) => {
  files.value.push(file.raw)
}

// 提取私钥
const clickHandle = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let formData = new FormData()
    for (var i in files.value) {
      formData.append('files', files.value[i])
    }
    formData.append('certype', form.cerType)
    formData.append('method', form.method)
    formData.append('certpath', form.certpath)
    formData.append('pwd', form.pwd)
    let res = await getPriKey(formData)
    let { code, msg, data } = res
    if (code == '1000') {
      result.value = data
      ElMessage.success(msg || '提取成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}
</script>
