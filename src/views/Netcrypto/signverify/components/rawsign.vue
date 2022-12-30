<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef" size="large">
      <el-form-item label="证书类型" prop="certype">
        <el-radio-group v-model="form.certype">
          <el-radio label="rsa">RSA证书</el-radio>
          <el-radio label="sm2">国密证书</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="证书方式" prop="method">
        <el-radio-group v-model="form.method">
          <el-radio label="base64">base64证书</el-radio>
          <el-radio label="upload">本地上传</el-radio>
          <el-radio label="local">平台证书</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.method == 'base64'" prop="base64Data">
        <el-input
          style="width: 95%"
          v-model="form.base64Data"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="签名所需base64证书"
        >
        </el-input>
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
          accept=".pem,.pfx"
          :file-list="fileList"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="私钥口令" v-if="form.method == 'upload' || form.method == 'local'">
        <el-input v-model="form.pwd" style="width: 20%" placeholder="请输入私钥口令"></el-input>
      </el-form-item>
      <el-form-item prop="plain">
        <el-input style="width: 95%" v-model="form.plain" type="textarea" :autosize="{ minRows: 10, maxRows: 10 }" placeholder="签名原文">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="signHandle">签名</el-button>
        <el-button type="primary" @click="verifyHandle">验签</el-button>
      </el-form-item>
      <el-form-item>
        <el-input style="width: 95%" v-model="result" type="textarea" :autosize="{ minRows: 10, maxRows: 10 }" placeholder="签名结果">
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
import { rawSign, rawVerify } from '@/api/Netcrypto/openssl'

const certfiles = ref([]) // 文件数据列表
const fileList = ref([]) // 上传文件
const files = ref([])
const result = ref('') // 结果数据
const form = reactive({
  certype: '',
  method: '',
  base64Data: '',
  certpath: '',
  pwd: '',
  plain: ''
})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  certype: [{ required: true, message: '请选择使用证书类型', trigger: 'blur' }],
  method: [{ required: true, message: '请选择使用证书方式', trigger: 'blur' }],
  base64Data: [{ required: true, message: '请输入Base64编码证书', trigger: 'blur' }],
  certpath: [{ required: true, message: '请选择平台已有证书', trigger: 'change' }],
  plain: [{ required: true, message: '请输入签名原文', trigger: 'blur' }]
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

// 签名
const signHandle = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let formData = new FormData()
    for (var i in files.value) {
      formData.append('files', files.value[i])
    }
    formData.append('certype', form.certype)
    formData.append('method', form.method)
    formData.append('base64Data', form.base64Data)
    formData.append('certpath', form.certpath)
    formData.append('pwd', form.pwd)
    formData.append('plain', form.plain)
    let res = await rawSign(formData)
    let { code, msg, data } = res
    if (code == '1000') {
      result.value = data
      ElMessage.success(msg || '签名成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}

// 解密
const verifyHandle = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let formData = new FormData()
    for (var i in files.value) {
      formData.append('files', files.value[i])
    }
    formData.append('certype', form.certype)
    formData.append('method', form.method)
    formData.append('base64Data', form.base64Data)
    formData.append('certpath', form.certpath)
    formData.append('plain', form.plain)
    formData.append('signdata', result.value)
    let res = await rawVerify(formData)
    let { code, msg } = res
    if (code == '1000') {
      ElMessage.success('验签成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}
</script>
