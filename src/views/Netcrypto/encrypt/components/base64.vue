<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef" label-width="80px" size="large">
      <el-form-item prop="plain">
        <el-input
          style="width: 95%"
          v-model="form.plain"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="待编码或解码数据"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="encodeHandle">编码</el-button>
        <el-button type="primary" @click="decodeHandle">解码</el-button>
      </el-form-item>
      <el-form-item>
        <el-input style="width: 95%" v-model="result" type="textarea" :autosize="{ minRows: 10, maxRows: 10 }" placeholder="编码或解码结果">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { base64Encode, base64Decode } from '@/api/Netcrypto/openssl'

// 表单
const form = reactive({
  plain: ''
})
const formRef = ref<FormInstance>(null)
const formRules = reactive<FormRules>({
  plain: [{ required: true, message: '请输入待编码或解码数据', trigger: 'blur' }]
})
// 结果数据
const result = ref('')

// base64编码
const encodeHandle = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let res = await base64Encode(form)
    let { code, msg, data } = res
    if (code == '1000') {
      result.value = data
      ElMessage.success(msg || '编码成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}

// base64解码
const decodeHandle = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let res = await base64Decode(form)
    let { code, msg, data } = res
    if (code == '1000') {
      result.value = data
      ElMessage.success(msg || '解码成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}
</script>
