<template>
  <div class="rootKey">
    <h5>根密钥</h5>
    <el-card shadow="never">
      <!-- <el-form :model="rootKeyForm" :rules="rootKeyFormRules" ref="rootKeyFormRef" label-width="130px" size="default" :inline="true">
        <el-form-item label="自定义根密钥" prop="certfile">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="myfile"
            drag
            :on-change="handleRootKeyChange"
            :limit="1"
            :on-exceed="handleRootKeyExceed"
            accept=".pem,.pfx"
            :file-list="fileRootKeyList"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button size="default" type="primary" @click="UploadRootKey">提交</el-button>
          <el-button size="default">选回默认证书</el-button>
        </el-form-item>
      </el-form> -->
      <el-form
        :model="rootKeyDNForm"
        :rules="rootKeyDNFormRules"
        ref="rootKeyDNFormRef"
        class="rootKeyDNForm"
        label-width="130px"
        size="default"
      >
        <el-form-item label="根证书DN" prop="rootKeyDN">
          <el-input
            v-model="rootKeyDNForm.rootKeyDN"
            placeholder="（假数据）C=cn,O=INFOSEC Technologies SHA256ID,CN=appSHA256ID"
            style="width: 30vw"
            disabled
          />
          <el-button type="primary" style="margin-left: 20px">下载根证</el-button>
          <el-upload
            ref="upload"
            class="uploadDN"
            action="myfile"
            :on-change="handleRootKeyChange"
            :limit="1"
            :on-exceed="handleRootKeyExceed"
            accept=".pem,.pfx"
            :file-list="fileRootKeyList"
            :auto-upload="false"
          >
            <el-button type="primary" style="margin-left: 20px">自定义根证</el-button>
          </el-upload>
          <el-button size="default" style="margin-left: 20px">选回默认证书</el-button>
        </el-form-item>
        <el-form-item label="说明：" class="illustrate">
          <span class="illustrate">可根据需要自定义根证书，否则将使用默认根证签名，请知晓！</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="numberCer">
    <h5>生成证书数量</h5>
    <el-card shadow="never">
      <el-form :model="numberCerForm" :rules="numberCerFormRules" ref="numberCerFormRef" label-width="130px" size="large">
        <el-form-item label="证书个数" prop="filenum">
          <el-input v-model="numberCerForm.filenum" placeholder="请输入证书个数" style="width: 250px" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="informationCer">
    <h5>证书信息设置</h5>
    <el-card shadow="never">
      <el-form :model="informationCerForm" :rules="informationCerFormRules" ref="informationCerFormRef" label-width="130px" size="large">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="证书类型" prop="certype">
              <el-radio-group v-model="informationCerForm.certype" style="width: 250px" @change="changeCertype">
                <el-radio label="RSA">RSA</el-radio>
                <el-radio label="SM2">SM2</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="证书文件">
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
            </el-form-item> -->
            <!-- <el-form-item label="证书文件密码" prop="passwd">
              <el-input v-model="informationCerForm.passwd" placeholder="请输入证书文件密码" style="width: 250px" />
            </el-form-item> -->
            <el-form-item label="生成文件类型" prop="outfiletype">
              <el-select v-model="informationCerForm.outfiletype" placeholder="请选择生成文件类型" style="width: 250px">
                <el-option label="pfx" value="pfx" />
                <el-option label="cer" value="cer" />
                <!-- <el-option label="der" value="der" />
                <el-option label="pem" value="pem" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="证书密钥长度" prop="keyLen">
              <el-select v-model="informationCerForm.keyLen" placeholder="请选择证书密钥长度" style="width: 250px">
                <el-option v-for="item in keyLenOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="序列号长度" prop="serialNumber">
              <el-select v-model="informationCerForm.serialNumber" placeholder="请选择序列号长度" style="width: 250px">
                <el-option label="16" value="16" />
                <el-option label="32" value="32" />
              </el-select>
            </el-form-item>
            <el-form-item label="添加扩展">
              <el-radio-group v-model="addExtstrlist" style="width: 250px" :disabled="informationCerForm.dntype ? true : false">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书时间" prop="time">
              <el-date-picker
                v-model="informationCerForm.time"
                type="datetimerange"
                start-placeholder="请选择证书开始时间"
                end-placeholder="请选择证书结束时间"
                size="large"
                style="max-width: 400px"
                :default-time="defaultTime"
                :shortcuts="shortcuts"
              />
            </el-form-item>
            <el-form-item label="证书密钥口令" prop="outfilepassw">
              <el-input v-model="informationCerForm.outfilepassw" placeholder="请设置生成证书密钥口令" style="width: 250px" />
            </el-form-item>
            <el-form-item label="签名算法" prop="digetType">
              <el-select v-model="informationCerForm.digetType" placeholder="请选择签名算法" style="width: 250px">
                <el-option
                  v-for="(item, index) in digetTypeList"
                  :key="'digetTypeList' + index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用者DN" prop="dntype">
              <el-checkbox v-model="informationCerForm.dntype" label="自定义编码格式" size="large" />
              <!-- <el-select v-model="informationCerForm.dntype" placeholder="请选择使用者DN类型" style="width: 250px" @change="changeDNType">
                <el-option label="数组类型" value="group" />
                <el-option label="字符串类型" value="string" />
              </el-select> -->
              <el-input v-if="!informationCerForm.dntype" v-model="informationCerForm.subjName" placeholder="" style="width: 30vw" />
              <el-form
                v-else
                :model="informationCerForm.subjName"
                ref="subjNameFormRef"
                label-width="80px"
                size="large"
                class="subjNameForm"
                :rules="subjNameFormRules"
              >
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="C：" prop="C">
                      <el-input v-model="informationCerForm.subjName[name]" style="width: 250px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="编码格式" prop="encodingFormat">
                      <el-select v-model="informationCerForm.outfiletype" placeholder="请选择编码格式" style="width: 250px">
                        <el-option label="UTF-8" value="UTF-8" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" style="margin-top: 20px; margin-bottom: 20px">
                  <el-col :span="12">
                    <el-form-item label="O：" prop="O">
                      <el-input v-model="informationCerForm.subjName[name]" style="width: 250px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="编码格式" prop="encodingFormat">
                      <el-select v-model="informationCerForm.outfiletype" placeholder="请选择编码格式" style="width: 250px">
                        <el-option label="UTF-8" value="UTF-8" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="CN：" prop="CN">
                      <el-input v-model="informationCerForm.subjName[name]" style="width: 250px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="编码格式" prop="encodingFormat">
                      <el-select v-model="informationCerForm.outfiletype" placeholder="请选择编码格式" style="width: 250px">
                        <el-option label="UTF-8" value="UTF-8" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-form-item>
            <!-- <el-form-item label="使用者DN" prop="subjName">
              <el-input v-model="informationCerForm.subjName" :rows="3" type="textarea" placeholder="请输入使用者DN" style="width: 350px" />
            </el-form-item> -->
            <el-form-item label="是否产生crl文件" prop="produceCrlFile">
              <el-select v-model="informationCerForm.produceCrlFile" placeholder="" style="width: 250px">
                <el-option label="是" value="1" disabled />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <!-- <el-form
              :model="informationCerForm.extstrlist"
              ref="extstrlistFormRef"
              v-if="addExtstrlist == '1'"
              label-width="130px"
              size="large"
              class="extstrlistForm"
            >
              <el-row :gutter="24" v-for="(item, index) in informationCerForm.extstrlist" :key="'extstrlist' + index">
                <el-col :span="8">
                  <el-form-item
                    :label="`扩展项${index + 1}(OID)`"
                    :prop="'item[' + index + '].name'"
                    :rules="{ required: false, message: '扩展项不能为空', trigger: 'blur' }"
                  >
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
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
                <el-col :span="3" v-if="informationCerForm.extstrlist.length !== 1">
                  <el-button @click="removeExtstrlistFormForm(item)" :icon="Delete" size="large" circle> </el-button>
                </el-col>
              </el-row>
            </el-form> -->
          </el-col>
        </el-row>
        <el-form-item label="" style="margin-left: 25%" v-if="addExtstrlist === '0'">
          <el-button size="large" type="primary" @click="generateCer()">生成证书</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="extstrlist" v-if="addExtstrlist === '1'">
    <h5>扩展项</h5>
    <el-card shadow="never">
      <el-form
        :model="informationCerForm.extstrlist"
        ref="extstrlistFormRef"
        v-if="addExtstrlist == '1'"
        label-width="130px"
        size="large"
        class="extstrlistForm"
      >
        <el-row :gutter="24" v-for="(item, index) in informationCerForm.extstrlist" :key="'extstrlist' + index">
          <el-col :span="8">
            <el-form-item
              :label="`扩展项${index + 1}(OID)`"
              :prop="'item[' + index + '].name'"
              :rules="{ required: false, message: '扩展项不能为空', trigger: 'blur' }"
            >
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="3" v-if="informationCerForm.extstrlist.length !== 1">
            <el-button @click="removeExtstrlistFormForm(item)" :icon="Delete" size="large" circle> </el-button>
          </el-col>
        </el-row>
        <el-form-item label="" style="margin-left: 25%">
          <el-button size="large" type="primary" @click="generateCer()">生成证书</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="download" v-if="resultUrl !== ''">
    <h5>批量证书生成状态</h5>
    <span class="status">成功！</span>
    <el-button size="large" type="primary" @click="toDownFile">点击下载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElDatePicker } from 'element-plus'
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { BatchMakeCer, GencertUpload } from '@/api/Netcrypto/openssl'

const files = ref([])
const filesRootKey = ref([])
const fileList = ref([]) // 上传文件
const fileRootKeyList = ref([])
const addExtstrlist = ref('0')
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)] // '12:00:00', '08:00:00'
const shortcuts = [
  {
    text: '最近六个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
      return [start, end]
    }
  },
  {
    text: '最近一年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
      return [start, end]
    }
  },
  {
    text: '最近三年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1080)
      return [start, end]
    }
  }
]
const resultUrl = ref('')
const digetTypeList = ref([])
const keyLenOptions = ref([
  { label: 'rsa:1024', value: '1024' },
  { label: 'rsa:2048', value: '2048' },
  { label: 'rsa:4096', value: '4096' },
  { label: 'sm2:256', value: '256' }
])
const rootKeyDN = ref('')
const rootKeyForm = reactive({
  certfile: 'upload'
})
const rootKeyFormRef = ref<FormInstance>()
const rootKeyFormRules = reactive<FormRules>({
  certfile: [{ required: true, message: '请选择证书文件', trigger: 'blur' }]
})
const numberCerForm = reactive({
  filenum: ''
})
const numberCerFormRef = ref<FormInstance>()
const numberCerFormRules = reactive<FormRules>({
  filenum: [{ required: true, message: '请输入证书个数', trigger: 'blur' }]
})
const informationCerForm = reactive({
  filenum: '',
  certype: '',
  passwd: '',
  time: '',
  dntype: false,
  subjName: '',
  outfiletype: '',
  digetType: '',
  keyLen: '',
  outfilepassw: '',
  serialNumber: '',
  produceCrlFile: '0',
  extstrlist: [{ name: '', variable: '' }]
})
const informationCerFormRef = ref<FormInstance>()
const informationCerFormRules = reactive<FormRules>({
  certype: [{ required: true, message: '请选择证书类型', trigger: 'change' }],
  passwd: [{ required: true, message: '请输入证书文件密码', trigger: 'blur' }],
  time: [{ required: true, message: '请选择证书时间', trigger: 'blur' }],
  dntype: [{ required: true, message: '请选择使用者DN类型', trigger: 'blur' }],
  subjName: [{ required: false, message: '请输入使用者DN', trigger: 'blur' }],
  outfiletype: [{ required: true, message: '请选择证书格式', trigger: 'change' }],
  digetType: [{ required: true, message: '请选择签名算法', trigger: 'change' }],
  keyLen: [{ required: true, message: '请选择证书密钥长度', trigger: 'blur' }],
  outfilepassw: [{ required: true, message: '请设置生成证书密钥口令', trigger: 'blur' }],
  produceCrlFile: [{ required: true, message: '请选择是否生成CRL文件', trigger: 'blur' }],
  serialNumber: [{ required: true, message: '请选择序列号长度', trigger: 'blur' }]
})
const extstrlistFormRef = ref<FormInstance>()
const subjNameFormRef = ref<FormInstance>()
const subjNameFormRules = reactive<FormRules>({
  C: [{ required: true, message: '请输入根证书DN', trigger: 'blur' }],
  O: [{ required: true, message: '请输入根证书DN', trigger: 'blur' }],
  CN: [{ required: true, message: '请输入根证书DN', trigger: 'blur' }]
})
const rootKeyDNForm = reactive({
  rootKeyDN: ''
})
const rootKeyDNFormRef = ref<FormInstance>()
const rootKeyDNFormRules = reactive<FormRules>({
  rootKeyDN: [{ required: true, message: '请输入根证书DN', trigger: 'blur' }]
})

// 监听上传文件数目，此处限制1个
const handleExceed = (files, fileList) => {
  // ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
  ElMessage.warning(`一次只能上传1 个文件`)
}

const handleRootKeyExceed = (files, fileList) => {
  // ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
  ElMessage.warning(`一次只能上传1 个文件`)
}

const handleChange = (file, fileList) => {
  files.value.push(file.raw)
}

const handleRootKeyChange = (file, fileList) => {
  fileRootKeyList.value = []
  fileRootKeyList.value.push(file.raw)
}

const addExtstrlistForm = () => {
  informationCerForm.extstrlist.push({
    name: '',
    variable: ''
  })
}

const removeExtstrlistFormForm = item => {
  var index = informationCerForm.extstrlist.indexOf(item)
  if (index !== -1) {
    informationCerForm.extstrlist.splice(index, 1)
  }
}

const changeDNType = it => {
  if (it === 'string') {
    addExtstrlist.value = '0'
  }
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
  numberCerFormRef.value.validate(async valid => {
    if (!valid) return
    // if (addExtstrlist.value == '1') {
    //   extstrlistFormRef.value.validate(async valid => {
    //     if (!valid) return
    //     generateCer2()
    //   })
    // } else {
    //   generateCer2()
    // }
    generateCer2()
  })
}

// 生成证书
const generateCer2 = () => {
  informationCerFormRef.value.validate(async valid => {
    if (!valid) return
    // if (files.value.length == 0) {
    //   return ElMessage.error('请上传证书文件')
    // }
    let extstrlistFormArray = []
    informationCerForm.extstrlist.map(item => {
      let res = []
      res[0] = item.name
      res[1] = item.variable
      extstrlistFormArray.push(res)
    })
    let formData = new FormData()
    for (var i in files.value) {
      formData.append('caPfxFile', files.value[i])
    }
    formData.append('filenum', numberCerForm.filenum)
    formData.append('certype', informationCerForm.certype)
    formData.append('passwd', informationCerForm.passwd)
    formData.append('dntype', informationCerForm.dntype ? 'true' : 'false')
    formData.append('subjName', informationCerForm.subjName)
    formData.append('startTime', String(new Date(informationCerForm.time[0]).getTime() / 1000))
    formData.append('endTime', String(new Date(informationCerForm.time[1]).getTime() / 1000))
    formData.append('outfiletype', informationCerForm.outfiletype)
    formData.append('digetType', informationCerForm.digetType)
    formData.append('keyLen', informationCerForm.keyLen)
    formData.append('outfilepassw', informationCerForm.outfilepassw)
    formData.append('serialNumber', informationCerForm.serialNumber)
    addExtstrlist.value == '1' ? formData.append('extstrlist', JSON.stringify(extstrlistFormArray)) : formData.append('extstrlist', '[]')
    let res = await BatchMakeCer(formData)
    let { code, msg, url } = res
    if (code == '1000') {
      resultUrl.value = url
      ElMessage.success(msg || '批量生成证书成功')
    } else {
      ElMessage.error({
        message: msg,
        center: true
      })
    }
  })
}

// 提交根密钥
const UploadRootKey = () => {
  rootKeyFormRef.value.validate(async valid => {
    if (!valid) return
    if (fileRootKeyList.value.length == 0) {
      return ElMessage.error('未选择文件')
    }
    let formData = new FormData()
    for (var i in fileRootKeyList.value) {
      formData.append('files', fileRootKeyList.value[i])
    }
    let res = await GencertUpload(formData)
    let { code, msg, url } = res
    if (code == '1000') {
      // resultUrl.value = url
      ElMessage.success(msg || '上传根证成功')
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
.rootKey {
  .illustrate {
    font-weight: 600;
  }
  .uploadDN {
    display: flex;
  }
}
.upload-demo {
  display: flex;
  flex-direction: column;
  :deep(.el-upload-list) {
    min-width: 200px;
  }
  :deep(.el-upload-dragger) {
    width: 300px;
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

<style lang="scss">
.illustrate .el-form-item__label {
  font-weight: 600;
  color: #303133;
}

.extstrlistForm {
  .el-input__wrapper {
    width: 100px;
  }
}
</style>
