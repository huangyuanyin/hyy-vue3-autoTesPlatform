<template>
  <div>
    <el-form :model="hashForm" :rules="hashFormRules" ref="hashFormRef" label-width="70px" size="large">
      <el-form-item prop="plain">
        <el-input
          style="width: 95%"
          v-model="hashForm.plain"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="原文数据"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="algHandle('SM3')">SM3</el-button>
        <el-button type="primary" @click="algHandle('SHA1')">SHA1</el-button>
        <el-button type="primary" @click="algHandle('SHA256')">SHA256</el-button>
        <el-button type="primary" @click="algHandle('SHA512')">SHA512</el-button>
        <el-button type="primary" @click="algHandle('SHA224')">SHA224</el-button>
        <el-button type="primary" @click="algHandle('SHA384')">SHA384</el-button>
        <el-button type="primary" @click="algHandle('MD5')">MD5</el-button>
        <el-button type="primary" @click="algHandle('MD4')">MD4</el-button>
        <el-select v-model="hashForm.base" style="float: right; margin-left: 10px">
          <el-option v-for="(item, index) in bases" :key="index" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          style="width: 95%"
          v-model="hashForm.hash"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="哈希数据"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { dataHash } from '@/api/Netcrypto/openssl'

// 表单
const hashForm = reactive({
  plain: '',
  hash: '',
  base: 'hex'
})
const hashFormRef = ref<FormInstance>(null)
const hashFormRules = reactive<FormRules>({
  plain: [{ required: true, message: '请输入原文数据', trigger: 'blur' }]
})
// 加密值类型
const bases = [
  {
    label: '16进制',
    value: 'hex'
  },
  {
    label: 'BASE64',
    value: 'base64'
  }
]

const algHandle = alg => {
  hashFormRef.value.validate(async valid => {
    if (!valid) return
    let params = {
      message: hashForm.plain,
      alg: alg,
      base: hashForm.base
    }
    let res = await dataHash(params)
    let { code, msg, data } = res
    if (code == '1000') {
      hashForm.hash = data
      ElMessage.success(msg || '哈希成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}
</script>
