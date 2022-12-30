<template>
  <div class="informationCer">
    <el-form :model="informationCerForm" :rules="informationCerFormRules" ref="informationCerFormRef" label-width="110px" size="large">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="证书类型" prop="certype">
            <el-radio-group v-model="informationCerForm.certype" style="width: 250px" @change="changeCertype">
              <el-radio label="RSA">RSA</el-radio>
              <el-radio label="SM2">SM2</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证书文件">
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
              style="width: 100vw"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="P10证书">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="myfile"
              drag
              :on-change="handleChangeP10"
              :limit="1"
              :on-exceed="handleExceedP10"
              accept=".pem,.pfx"
              :file-list="fileListP10"
              :auto-upload="false"
              style="width: 100vw"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="证书文件密码" prop="passwd">
            <el-input v-model="informationCerForm.passwd" placeholder="请输入证书文件密码" style="width: 250px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证书时间" prop="time">
            <el-date-picker
              v-model="informationCerForm.time"
              type="datetimerange"
              start-placeholder="请选择证书开始时间"
              end-placeholder="请选择证书结束时间"
              size="large"
              style="max-width: 350px"
              :default-time="defaultTime"
            />
          </el-form-item>
          <el-form-item label="证书序列号">
            <el-input v-model="informationCerForm.serialNumber" placeholder="" style="width: 250px" />
          </el-form-item>
          <el-form-item label="使用者DN" prop="subGroup">
            <el-input v-model="informationCerForm.subGroup" :rows="3" type="textarea" placeholder="请输入使用者DN" style="width: 400px" />
          </el-form-item>
          <el-form-item label="签名算法" prop="digetType">
            <el-select v-model="informationCerForm.digetType" placeholder="请选择生成文件类型" style="width: 250px">
              <el-option
                v-for="(item, index) in digetTypeList"
                :key="'digetTypeList' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="" style="margin-left: 20%">
        <el-button size="large" type="primary" @click="generateCer()">生成证书</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="download" v-if="resultUrl !== ''">
    <h5>证书生成状态</h5>
    <span class="status">成功！</span>
    <el-button size="large" type="primary" @click="toDownFile">点击下载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElDatePicker } from 'element-plus'
import { P10MakeCer } from '@/api/Netcrypto/openssl'

const files = ref([])
const fileList = ref([]) // 上传文件
const filesP10 = ref([])
const fileListP10 = ref([])
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)] // '12:00:00', '08:00:00'
const resultUrl = ref('')
const digetTypeList = ref([])
const informationCerForm = reactive({
  certype: '',
  passwd: '',
  time: '',
  subGroup: '',
  digetType: '',
  serialNumber: ''
})
const informationCerFormRef = ref<FormInstance>()
const informationCerFormRules = reactive<FormRules>({
  certype: [{ required: true, message: '请选择证书类型', trigger: 'change' }],
  passwd: [{ required: true, message: '请输入证书文件密码', trigger: 'blur' }],
  time: [{ required: true, message: '请选择证书时间', trigger: 'blur' }],
  subGroup: [{ required: false, message: '请输入使用者DN', trigger: 'blur' }],
  digetType: [{ required: true, message: '请选择生成文件类型', trigger: 'change' }]
})

// 监听上传文件数目，此处限制1个
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}
const handleExceedP10 = (files, fileList) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}

const handleChange = (file, fileList) => {
  files.value.push(file.raw)
}

const handleChangeP10 = (file, fileList) => {
  filesP10.value.push(file.raw)
}

const changeCertype = it => {
  if (it == 'SM2') {
    digetTypeList.value = [{ label: 'sm3', value: 'sm3' }]
  } else {
    digetTypeList.value = [
      { label: 'sha1', value: 'sha1' },
      { label: 'sha256', value: 'sha256' },
      { label: 'sha384', value: 'sha384' }
    ]
  }
}

const toDownFile = () => {
  location.href = resultUrl.value
}

const generateCer = () => {
  generateCer2()
}

// 生成证书
const generateCer2 = () => {
  informationCerFormRef.value.validate(async valid => {
    if (!valid) return
    if (files.value.length == 0) {
      return ElMessage.error('请上传证书文件')
    }
    if (filesP10.value.length == 0) {
      return ElMessage.error('请上传P10证书文件')
    }
    let formData = new FormData()
    for (var i in files.value) {
      formData.append('caPfxFile', files.value[i])
    }
    for (var i in filesP10.value) {
      formData.append('userP10Txt', filesP10.value[i])
    }
    formData.append('certype', informationCerForm.certype)
    formData.append('passwd', informationCerForm.passwd)
    formData.append('subGroup', informationCerForm.subGroup)
    formData.append('startTime', String(new Date(informationCerForm.time[0]).getTime() / 1000))
    formData.append('endTime', String(new Date(informationCerForm.time[1]).getTime() / 1000))
    formData.append('digetType', informationCerForm.digetType)
    formData.append('serialNumber', informationCerForm.serialNumber)
    let res = await P10MakeCer(formData)
    let { code, msg, url } = res
    if (code == '1000') {
      resultUrl.value = url
      ElMessage.success(msg || '生成证书成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.upload-demo {
  display: flex;
  :deep(.el-upload-list) {
    min-width: 200px;
  }
}
.download {
  .status {
    display: inline-block;
    margin-left: 80px;
    color: #67c23a;
  }
}
</style>
