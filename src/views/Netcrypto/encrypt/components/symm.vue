<template>
  <div>
    <el-form :model="symmForm" :rules="symmFormRules" ref="symmFormRef" label-width="130px" size="large">
      <el-form-item label="待加密/解密数据" prop="original">
        <el-input
          style="width: 95%"
          v-model="symmForm.original"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="待加密或解密数据"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="algs">
        <el-select v-model="symmForm.algs" @change="algsChange" placeholder="请选择算法">
          <el-option v-for="(item, index) in algsList" :key="index" :value="item.value" :label="item.label"> </el-option>
        </el-select>
        <el-select v-model="symmForm.algstype" v-show="symmForm.algs != 'RC4'" style="margin-left: 10px" placeholder="算法类型">
          <el-option v-for="(item, index) in algsTypes" :key="index" :value="item.value" :label="item.label"> </el-option>
        </el-select>
        <el-select v-model="symmForm.padding" style="margin-left: 10px" placeholder="填充模式">
          <el-option v-for="(item, index) in paddings" :key="index" :value="item.value" :label="item.label"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始化向量" prop="iv">
        <el-input v-model="symmForm.iv" placeholder="请输入初始化向量IV值" style="width: 95%"></el-input>
      </el-form-item>
      <el-form-item label="密钥值" prop="key">
        <el-input v-model="symmForm.key" style="width: 95%" placeholder="请输入密钥"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="encryHandle(symmFormRef)">加密</el-button>
        <el-button type="primary" @click="decryHandle(symmFormRef)">解密</el-button>
      </el-form-item>
      <el-form-item label="加密/解密结果">
        <el-input
          style="width: 95%"
          v-model="result"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="加密或解密后数据"
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
import { symmEncry, symmDecry } from '@/api/Netcrypto/openssl'
const symmForm = reactive({
  original: '',
  algs: '',
  algstype: '',
  padding: '',
  iv: '',
  key: ''
})
const symmFormRef = ref<FormInstance>()
const symmFormRules = reactive<FormRules>({
  original: [{ required: true, message: '请输入待加密或解密数据', trigger: 'blur' }],
  algs: [{ required: true, message: '请选择算法', trigger: 'change' }],
  iv: [{ required: true, message: '请输入初始化向量IV值', trigger: 'blur' }],
  key: [{ required: true, message: '请输入密钥Key值', trigger: 'blur' }]
})
const result = ref('') // 结果
// 对称算法列表
const algsList = [
  {
    value: 'SM4',
    label: 'SM4'
  },
  {
    value: 'DES',
    label: 'DES'
  },
  {
    value: '3DES',
    label: '3DES'
  },
  {
    value: 'AES',
    label: 'AES'
  },
  {
    value: 'RC2',
    label: 'RC2'
  },
  {
    value: 'RC4',
    label: 'RC4'
  }
]
// 填充模式
const paddings = [
  {
    value: 'NoPadding',
    label: 'NoPadding'
  },
  {
    value: 'PKCS7Padding',
    label: 'PKCS7Padding'
  }
]
// 算法类型
const algsTypes = ref([])

const algsChange = value => {
  symmForm.algstype = ''
  if (value == 'SM4') {
    algsTypes.value = [
      { value: 'ECB', label: 'ECB' },
      { value: 'CBC', label: 'CBC' },
      { value: 'CFB', label: 'CFB' },
      { value: 'OFB', label: 'OFB' },
      { value: 'CTR', label: 'CTR' }
    ]
  }
  if (value == 'DES' || value == '3DES' || value == 'RC2') {
    algsTypes.value = [
      { value: 'ECB', label: 'ECB' },
      { value: 'CBC', label: 'CBC' },
      { value: 'CFB', label: 'CFB' },
      { value: 'OFB', label: 'OFB' }
    ]
  }
  if (value == 'AES') {
    algsTypes.value = [
      { value: 'ECB_128', label: 'ECB_128' },
      { value: 'CBC_128', label: 'CBC_128' },
      { value: 'CFB_128', label: 'CFB_128' },
      { value: 'OFB_128', label: 'OFB_128' },
      { value: 'CTR_128', label: 'CTR_128' },
      { value: 'OCB_128', label: 'OCB_128' },
      { value: 'CBC_192', label: 'CBC_192' },
      { value: 'CFB_192', label: 'CFB_192' },
      { value: 'OFB_192', label: 'OFB_192' },
      { value: 'CTR_192', label: 'CTR_192' },
      { value: 'OCB_192', label: 'OCB_192' },
      { value: 'ECB_192', label: 'ECB_192' },
      { value: 'CBC_256', label: 'CBC_256' },
      { value: 'CFB_256', label: 'CFB_256' },
      { value: 'OFB_256', label: 'OFB_256' },
      { value: 'CTR_256', label: 'CTR_256' },
      { value: 'OCB_256', label: 'OCB_256' },
      { value: 'ECB_256', label: 'ECB_256' }
    ]
  }
}
// 加密
const encryHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await symmEncry(symmForm)
      if (res.code == '1000') {
        result.value = res.data
        ElMessage.success(res.msg || '加密成功')
      } else {
        ElMessage.error({
          message: res.msg,
          center: true
        })
      }
    }
  })
}
// 解密
const decryHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await symmDecry(symmForm)
      if (res.code == '1000') {
        result.value = res.data
        ElMessage.success(res.msg || '解密成功')
      } else {
        ElMessage.error({
          message: res.msg,
          center: true
        })
      }
    }
  })
}
</script>
