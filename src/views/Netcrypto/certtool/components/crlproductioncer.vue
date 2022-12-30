<template>
  <div class="numberCer">
    <h5>生成CRL文件数量</h5>
    <el-form :model="numberCRLForm" :rules="numberCRLFormRules" ref="numberCRLFormRef" label-width="130px" size="large">
      <el-form-item label="文件数量" prop="filenum">
        <el-input v-model="numberCRLForm.filenum" placeholder="请输入文件数量" style="width: 250px" />
      </el-form-item>
    </el-form>
  </div>
  <div class="informationCer">
    <h5>证书信息设置</h5>
    <el-form :model="informationCRLForm" :rules="informationCRLFormRules" ref="informationCRLFormRef" label-width="130px" size="large">
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
      <el-form-item label="证书文件密码" prop="pfxpass">
        <el-input v-model="informationCRLForm.pfxpass" placeholder="请输入证书文件密码" style="width: 250px" />
      </el-form-item>
      <el-form-item label="有效期（秒）" prop="time">
        <el-date-picker
          v-model="informationCRLForm.time"
          type="date"
          placeholder="请选择有效期（至）"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="证书起始序列号" prop="certserial">
        <el-input v-model="informationCRLForm.certserial" placeholder="" style="width: 250px" />
      </el-form-item>
      <el-form-item label="证书个数" prop="cersercount">
        <el-input v-model="informationCRLForm.cersercount" placeholder="请输入证书个数" style="width: 250px" />
      </el-form-item>
      <el-form-item label="CRL文件序号" prop="crlnumberfile">
        <el-input v-model="informationCRLForm.crlnumberfile" placeholder="" style="width: 250px" />
      </el-form-item>
      <el-form-item label="签名算法" prop="digetType">
        <el-select v-model="informationCRLForm.digetType" placeholder="请选择签名算法" style="width: 250px">
          <el-option label="sm3" value="sm3" />
          <el-option label="sha1" value="sha1" />
          <el-option label="sha256" value="sha256" />
          <el-option label="sha384" value="sha384" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加扩展">
        <el-radio-group v-model="addExtstrlist" style="width: 250px">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form :model="informationCRLForm.extstrlist" ref="extstrlistFormRef" v-if="addExtstrlist == '1'" label-width="130px" size="large">
        <el-row :gutter="24" v-for="(item, index) in informationCRLForm.extstrlist" :key="'extstrlist' + index">
          <el-col :span="6">
            <el-form-item
              :label="`扩展项${index + 1}(OID)`"
              :prop="'item[' + index + '].name'"
              :rules="{ required: false, message: '扩展项不能为空', trigger: 'blur' }"
            >
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :label="`扩展项值${index + 1}(value)`"
              :prop="'item[' + index + '].variable'"
              :rules="{ required: false, message: '扩展项值不能为空', trigger: 'blur' }"
            >
              <el-input v-model="item.variable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-button @click="addExtstrlistForm" size="large" :icon="CirclePlus" circle></el-button>
          </el-col>
          <el-col :span="3" v-if="informationCRLForm.extstrlist.length !== 1">
            <el-button @click="removeExtstrlistFormForm(item)" :icon="Delete" size="large" circle> </el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form-item label="">
        <el-button size="large" type="primary" @click="generateCer()">生成CRL</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="download" v-if="resultUrl !== ''">
    <h5>CRL文件生成状态</h5>
    <span class="status">成功！</span>
    <el-button size="large" type="primary" @click="toDownFile">点击下载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElDatePicker } from 'element-plus'
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { CrlMakeCer } from '@/api/Netcrypto/openssl'
import { computer } from '@/utils/util'

const files = ref([])
const fileList = ref([]) // 上传文件
const addExtstrlist = ref('0')
const resultUrl = ref('')
const numberCRLForm = reactive({
  filenum: ''
})
const numberCRLFormRef = ref<FormInstance>()
const numberCRLFormRules = reactive<FormRules>({
  filenum: [{ required: true, message: '请输入文件数量', trigger: 'blur' }]
})
const informationCRLForm = reactive({
  crlfilecount: '',
  pfxpass: '',
  time: '',
  certserial: '',
  crlnumberfile: '',
  cersercount: '',
  digetType: '',
  extstrlist: [{ name: '', variable: '' }]
})
const informationCRLFormRef = ref<FormInstance>()
const informationCRLFormRules = reactive<FormRules>({
  pfxpass: [{ required: true, message: '请输入证书文件密码', trigger: 'blur' }],
  time: [{ required: true, message: '请选择有效期（至）', trigger: 'blur' }],
  certserial: [{ required: true, message: '请输入证书序列号', trigger: 'blur' }],
  cersercount: [{ required: true, message: '请输入证书个数', trigger: 'blur' }],
  crlnumberfile: [{ required: true, message: '请选择CRL文件序号', trigger: 'change' }],
  digetType: [{ required: true, message: '请选择签名算法', trigger: 'change' }]
})
const extstrlistFormRef = ref<FormInstance>()

// 监听上传文件数目，此处限制1个
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}

const handleChange = (file, fileList) => {
  files.value.push(file.raw)
}

const addExtstrlistForm = () => {
  informationCRLForm.extstrlist.push({
    name: '',
    variable: ''
  })
}

const removeExtstrlistFormForm = item => {
  var index = informationCRLForm.extstrlist.indexOf(item)
  if (index !== -1) {
    informationCRLForm.extstrlist.splice(index, 1)
  }
}

const toDownFile = () => {
  location.href = resultUrl.value
}

const generateCer = () => {
  numberCRLFormRef.value.validate(async valid => {
    if (!valid) return
    generateCer2()
  })
}

// 生成证书
const generateCer2 = () => {
  informationCRLFormRef.value.validate(async valid => {
    if (!valid) return
    if (files.value.length == 0) {
      return ElMessage.error('请上传证书文件')
    }
    let extstrlistFormArray = []
    informationCRLForm.extstrlist.map(item => {
      let res = []
      res[0] = item.name
      res[1] = item.variable
      extstrlistFormArray.push(res)
    })
    let formData = new FormData()
    for (var i in files.value) {
      formData.append('pfxfile', files.value[i])
    }
    formData.append('crlfilecount', numberCRLForm.filenum)
    formData.append('pfxpass', informationCRLForm.pfxpass)
    formData.append('crldays', String(computer(new Date(informationCRLForm.time).getTime()).day))
    formData.append('crlhours', String(computer(new Date(informationCRLForm.time).getTime()).h))
    formData.append('crlmin', String(computer(new Date(informationCRLForm.time).getTime()).m))
    formData.append('crlsec', String(computer(new Date(informationCRLForm.time).getTime()).s))
    formData.append('digetType', informationCRLForm.digetType)
    formData.append('certserial', informationCRLForm.certserial)
    formData.append('cersercount', informationCRLForm.cersercount)
    formData.append('crlnumberfile', informationCRLForm.crlnumberfile)
    addExtstrlist.value == '1' ? formData.append('extstrlist', JSON.stringify(extstrlistFormArray)) : formData.append('extstrlist', '[]')
    let res = await CrlMakeCer(formData)
    let { code, msg, url } = res
    if (code == '1000') {
      resultUrl.value = url
      ElMessage.success(msg || '生成CRL证书成功')
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
