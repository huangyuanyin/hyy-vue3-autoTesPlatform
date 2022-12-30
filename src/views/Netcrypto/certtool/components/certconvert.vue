<template>
  <div>
    <el-form :model="convertForm" :rules="convertFormRules" ref="convertFormRef" label-width="130px" size="large">
      <el-form-item label="源格式" prop="Sourceformat">
        <el-radio-group v-model="convertForm.Sourceformat" @change="changeHandler">
          <el-radio label="PEM">PEM</el-radio>
          <el-radio label="PFX">PFX</el-radio>
          <el-radio label="DER">DER</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="目标格式" prop="Targetformat" @change="changeTargetformat">
        <el-radio-group v-model="convertForm.Targetformat">
          <span v-if="convertForm.Sourceformat == 'PEM'">
            <el-radio label="DER">DER</el-radio>
            <el-radio label="P7B">P7B</el-radio>
            <el-radio label="PFX">PFX</el-radio>
            <el-radio label="JKS" disabled>JKS</el-radio>
          </span>
          <span v-else>
            <el-radio label="DER" disabled>DER</el-radio>
            <el-radio label="P7B" disabled>P7B</el-radio>
            <el-radio label="PFX" disabled>PFX</el-radio>
            <el-radio label="JKS" disabled>JKS</el-radio>
          </span>
          <span v-if="convertForm.Sourceformat == 'PEM'" style="margin-left: 30px">
            <el-radio label="PEM" disabled>PEM</el-radio>
          </span>
          <span v-else style="margin-left: 30px">
            <el-radio label="PEM">PEM</el-radio>
          </span>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="证书文件" prop="certfile">
        <el-select v-model="convertForm.certfile" placeholder="请选择" style="width: 80px" v-if="convertForm.Targetformat == 'DER'">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-select v-model="convertForm.certfile" placeholder="请选择" style="width: 80px" v-else>
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <span v-if="convertForm.certfile === 'upload'">
          <el-upload
            class="upload-demo"
            action="myfile"
            accept=".pem,.pfx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :file-list="fileList"
            ref="upload"
            :on-change="handleChange"
            :auto-upload="false"
          >
            <el-button size="large" type="primary">选择文件</el-button>
          </el-upload>
        </span>
      </el-form-item>
      <el-form-item label="" v-if="convertForm.certfile === 'paste'">
        <el-input
          style="width: 60vw; margin-left: 0px"
          v-model="convertForm.certpaste"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="证书内容"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="证书链文件1:" prop="certchainone" v-if="convertForm.Targetformat == 'P7B'">
        <el-select v-model="convertForm.certchainone" placeholder="请选择" style="width: 80px">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <span v-if="convertForm.certchainone == 'paste'">
          <el-form-item>
            <el-input
              style="width: 60%; margin-left: 50px"
              v-model="convertForm.certchainonepaste"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="证书内容"
            >
            </el-input>
          </el-form-item>
        </span>
        <span v-else>
          <el-upload
            class="upload-demo"
            action="myfile"
            accept=".pem,.pfx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove1"
            :file-list="fileList"
            ref="upload"
            :on-change="handleChange1"
            :auto-upload="false"
          >
            <el-button size="large" type="primary">选择文件</el-button>
          </el-upload>
        </span>
      </el-form-item>

      <el-form-item label="证书链文件2:" prop="certchaintwo" v-if="convertForm.Targetformat == 'P7B'">
        <el-select v-model="convertForm.certchaintwo" placeholder="请选择" style="width: 80px">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <span v-if="convertForm.certchaintwo == 'paste'">
          <el-form-item>
            <el-input
              style="width: 60%; margin-left: 50px"
              v-model="convertForm.certchaintwopaste"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="证书内容"
            >
            </el-input>
          </el-form-item>
        </span>
        <span v-else>
          <el-upload
            class="upload-demo"
            action="myfile"
            accept=".pem,.pfx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove2"
            :file-list="fileList"
            ref="upload"
            :on-change="handleChange2"
            :auto-upload="false"
          >
            <el-button size="large" type="primary">选择文件</el-button>
          </el-upload>
        </span>
      </el-form-item>

      <el-form-item label="私钥文件:" prop="Privatekeyfile" v-if="convertForm.Targetformat == 'PFX' || convertForm.Targetformat == 'JKS'">
        <el-select v-model="convertForm.Privatekeyfile" placeholder="请选择" style="width: 80px">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <span v-if="convertForm.Privatekeyfile == 'paste'">
          <el-form-item>
            <el-input
              style="width: 60%; margin-left: 50px"
              v-model="convertForm.Privatekeyfilepaste"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="证书内容"
            >
            </el-input>
          </el-form-item>
        </span>
        <span v-else>
          <el-upload
            class="upload-demo"
            action="myfile"
            accept=".pem,.pfx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove3"
            :file-list="fileList"
            ref="upload"
            :on-change="handleChange3"
            :auto-upload="false"
          >
            <el-button size="large" type="primary">选择文件</el-button>
          </el-upload>
        </span>
      </el-form-item>
      <el-form-item label="PFX证书密码:" prop="PFXcertpass" v-if="convertForm.Targetformat == 'PFX' || convertForm.Sourceformat == 'PFX'">
        <el-input v-model="convertForm.PFXcertpass" style="width: 25%" placeholder="请设置6位以上密码,请记住输入的密码,非常重要">
        </el-input>
      </el-form-item>
      <el-form-item label="JKS证书密码:" prop="JKScertpass" v-if="convertForm.Targetformat == 'JKS'">
        <el-input v-model="convertForm.JKScertpass" style="width: 25%" placeholder="请设置6位以上密码,请记住输入的密码,非常重要">
        </el-input>
      </el-form-item>
      <el-form-item label="证书别名:" prop="certalias" v-if="convertForm.Targetformat == 'PFX' || convertForm.Targetformat == 'JKS'">
        <el-input v-model="convertForm.certalias" style="width: 25%" placeholder="默认值为证书域名,支持自定义别名,不支持中文"> </el-input>
      </el-form-item>
      <el-form-item label="证书链文件:" prop="certchain" v-if="convertForm.Targetformat == 'PFX' || convertForm.Targetformat == 'JKS'">
        <el-select v-model="convertForm.certchain" placeholder="请选择" style="width: 80px">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <span v-if="convertForm.certchain == 'paste'">
          <el-form-item>
            <el-input
              style="width: 60%; margin-left: 50px"
              v-model="convertForm.certchainpaste"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="证书内容"
            >
            </el-input>
          </el-form-item>
        </span>
        <span v-else>
          <el-upload
            class="upload-demo"
            action="myfile"
            accept=".pem,.pfx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove4"
            :file-list="fileList"
            ref="upload"
            :on-change="handleChange4"
            :auto-upload="false"
          >
            <el-button size="large" type="primary">选择文件</el-button>
          </el-upload>
        </span>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-button style="height: 39px" type="danger" @click="converttolHandle">转换证书格式</el-button>
      </el-form-item>
      <el-form-item label="证书转换状态:" v-if="result">
        <span style="margin-right: 10px">证书文件格式转换成功</span>
        <el-button size="large" type="primary" @click="toDownFile">点击下载</el-button>
        <!-- <el-input v-model="result" style="width: 25%" 
            placeholder="至少指定证书和源格式，目标格式！">
        </el-input> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { convert, downFile } from '@/api/Netcrypto/openssl'

// const certfile = ref([]) // 转换数据表单
const fileList = ref([]) // 上传文件
const files = ref([])
const upload_certchainone = ref([])
const upload_certchaintwo = ref([])
const upload_Privatekeyfile = ref([])
const upload_certchain = ref([])
// const type = ref('upload')
const convertForm = reactive({
  certfile: 'upload',
  Sourceformat: 'PEM',
  Targetformat: 'DER',
  certchainone: 'upload',
  certchaintwo: 'upload',
  Privatekeyfile: 'upload',
  PFXcertpass: '',
  JKScertpass: '',
  certalias: '',
  certchain: 'upload',
  certpaste: '',
  certchainonepaste: '',
  certchaintwopaste: '',
  Privatekeyfilepaste: '',
  certchainpaste: ''
})
const convertFormRef = ref<FormInstance>()
const convertFormRules = reactive<FormRules>({
  Sourceformat: [{ required: true, message: '', trigger: 'blur' }],
  Targetformat: [{ required: true, message: '', trigger: 'blur' }],
  certfile: [{ required: true, message: '', trigger: 'blur' }],
  Privatekeyfile: [{ required: true, message: '', trigger: 'blur' }],
  PFXcertpass: [{ required: true, message: '', trigger: 'blur' }],
  JKScertpass: [{ required: true, message: '', trigger: 'blur' }]
})
const options = [
  {
    value: 'upload',
    label: '上传'
  },
  {
    value: 'paste',
    label: '粘贴'
  }
]
const option = [
  {
    value: 'upload',
    label: '上传'
  }
]
// const value = ref('')
const result = ref('') // 结果

onMounted(() => {
  // getFilesList()
})

const changeHandler = value => {
  convertForm.certfile = 'upload'
  if (value != 'PEM') {
    convertForm.Targetformat = 'PEM'
  } else {
    convertForm.Targetformat = 'DER'
  }
}
const changeTargetformat = value => {
  convertForm.certfile = 'upload'
}
// 转换
const converttolHandle = async () => {
  let formData = new FormData()
  for (var i in files.value) {
    formData.append('certfile', files.value[i])
  }
  for (var i in upload_certchainone.value) {
    formData.append('upload_certchainone', upload_certchainone.value[i])
  }
  for (var i in upload_certchaintwo.value) {
    formData.append('upload_certchaintwo', upload_certchaintwo.value[i])
  }
  for (var i in upload_Privatekeyfile.value) {
    formData.append('upload_Privatekeyfile', upload_Privatekeyfile.value[i])
  }
  for (var i in upload_certchain.value) {
    formData.append('upload_certchain', upload_certchain.value[i])
  }
  formData.append('certpaste', convertForm.certpaste)
  formData.append('certchainonepaste', convertForm.certchainonepaste)
  formData.append('certchaintwopaste', convertForm.certchaintwopaste)
  formData.append('Privatekeyfilepaste', convertForm.Privatekeyfilepaste)
  formData.append('certchainpaste', convertForm.certchainpaste)
  formData.append('Sourceformat', convertForm.Sourceformat)
  formData.append('Targetformat', convertForm.Targetformat)
  formData.append('certchainone', convertForm.certchainone)
  formData.append('certchaintwo', convertForm.certchaintwo)
  formData.append('Privatekeyfile', convertForm.Privatekeyfile)
  formData.append('PFXcertpass', convertForm.PFXcertpass)
  formData.append('JKScertpass', convertForm.JKScertpass)
  formData.append('certalias', convertForm.certalias)
  formData.append('certchain', convertForm.certchain)
  let res = await convert(formData)
  let { code, msg, url } = res
  if (code == '1000') {
    result.value = url
    ElMessage.success(msg || '转换成功')
  } else {
    ElMessage.error({
      message: msg,
      center: true
    })
  }
}
const toDownFile = async () => {
  let res = await downFile()
  let { code, msg, url } = res
  if (code == '1000') {
    var iframe = document.createElement('iframe')
    iframe.src = url
    iframe.style.display = 'none'
    iframe.onload = function () {
      console.debug('start downloading...')
      document.body.removeAttribute(iframe)
    }
    document.body.appendChild(iframe)
    result.value = url
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
const handleChange1 = (file, fileList) => {
  upload_certchainone.value.push(file.raw)
}
const handleChange2 = (file, fileList) => {
  upload_certchaintwo.value.push(file.raw)
}
const handleChange3 = (file, fileList) => {
  upload_Privatekeyfile.value.push(file.raw)
}
const handleChange4 = (file, fileList) => {
  upload_certchain.value.push(file.raw)
}
const handleRemove = (file, fileList) => {
  files.value.shift()
}
const handleRemove1 = (file, fileList) => {
  upload_certchainone.value.shift()
}
const handleRemove2 = (file, fileList) => {
  upload_certchaintwo.value.shift()
}
const handleRemove3 = (file, fileList) => {
  upload_Privatekeyfile.value.shift()
}
const handleRemove4 = (file, fileList) => {
  upload_certchain.value.shift()
}
</script>

<style lang="scss" scoped>
.upload-demo {
  margin-left: 50px;
  height: 24px;
  line-height: 24px;
}
:deep(.el-upload-list) {
  margin-left: 100px;
  margin-top: -24px;
}
:deep(.el-form-item__content) {
  align-items: flex-start;
}
</style>
