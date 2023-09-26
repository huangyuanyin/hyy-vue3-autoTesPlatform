<template>
  <div class="MirrorWarehouse-wrap">
    <div class="search-add">
      <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openMirrorDialog('add')"> 添加</el-button>
      <div class="search-wrap">
        <el-input
          v-model="keywords_name"
          class="w-50 m-2"
          placeholder="输入镜像名称进行搜索..."
          :prefix-icon="Search"
          @change="searchMirror"
          clearable
        />
      </div>
    </div>
    <el-table :data="mirrorTableData" border style="width: 100%" stripe v-loading="loadingTable">
      <el-table-column prop="name" label="镜像名称" align="center" fixed width="180"> </el-table-column>
      <el-table-column prop="tag" label="镜像标签" width="160" align="center"></el-table-column>
      <el-table-column prop="start_shell" label="启动脚本" align="center" width="180" />
      <el-table-column prop="network_mode" label="网络模式" align="center" width="120" />
      <el-table-column prop="ssh_username" label="ssh连接账户名" align="center" width="150" />
      <el-table-column prop="ssh_password" label="ssh连接密码" align="center" width="120" />
      <el-table-column prop="last_mod_time" label="更新时间" width="180" />
      <el-table-column prop="create_user" label="创建人" width="180" />
      <el-table-column prop="illustrate" label="说明" width="180" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="openMirrorDialog('edit', scope.row.id)"> 编辑 </el-button>
          <el-popconfirm
            title="确定删除该镜像?"
            trigger="click"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            @confirm="deletetMirror(scope.row.id)"
          >
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="mirrorCurrentPage"
      v-model:page-size="mirrorPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="mirrorTotal"
      @size-change="handleMirrorSizeChange"
      @current-change="handleMirrorCurrentChange"
    />

    <el-dialog
      v-model="dialogFormVisible"
      :title="MirrorTitle"
      :width="MirrorTitle === '添加镜像' ? '65%' : '45%'"
      :before-close="closeDialog"
    >
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-row v-if="MirrorTitle === '添加镜像'">
          <el-col :span="10">
            <el-form-item label="镜像名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="镜像标签" :label-width="formLabelWidth" prop="tag">
              <el-input v-model="form.tag" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="启动脚本" :label-width="formLabelWidth" prop="start_shell">
              <el-input v-model="form.start_shell" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="网络模式" :label-width="formLabelWidth" prop="network_mode">
              <el-radio-group v-model="form.network_mode" :disabled="disabled">
                <el-radio label="none">none 模式</el-radio>
                <el-radio label="bridge">bridge 模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="ssh连接账户名" :label-width="formLabelWidth">
              <el-input v-model="form.ssh_username" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="ssh连接密码" :label-width="formLabelWidth">
              <el-input v-model="form.ssh_password" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="说明" :label-width="formLabelWidth" prop="illustrate">
              <el-input class="remark-hh" v-model="form.illustrate" autocomplete="off" type="textarea" :rows="1" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="连接方式" :label-width="formLabelWidth">
              <el-radio-group v-model="formType">
                <el-radio label="文件上传">文件上传</el-radio>
                <el-radio label="远程连接">远程连接</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="镜像文件" :label-width="formLabelWidth" prop="upload_file" v-if="formType === '文件上传'">
              <el-upload
                ref="uploadFile"
                class="uploadFile-demo"
                drag
                action=""
                name="upload_file"
                :limit="1"
                accept=""
                with-credentials
                show-file-list
                :auto-upload="false"
                :on-exceed="handleExceed"
                :on-change="handleUpload"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">拖拽文件至此处或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="远程连接IP" :label-width="formLabelWidth" prop="client_ip" v-if="formType === '远程连接'">
              <el-input v-model="form.client_ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="远程连接名称" :label-width="formLabelWidth" prop="client_name" v-if="formType === '远程连接'">
              <el-input v-model="form.client_name" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="远程连接密码" :label-width="formLabelWidth" prop="client_password" v-if="formType === '远程连接'">
              <el-input v-model="form.client_password" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="远程镜像名称" :label-width="formLabelWidth" prop="image_name" v-if="formType === '远程连接'">
              <el-input v-model="form.image_name" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="远程镜像标签" :label-width="formLabelWidth" prop="image_tag" v-if="formType === '远程连接'">
              <el-input v-model="form.image_tag" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input class="remark-hh" v-model="form.remark" autocomplete="off" type="textarea" :rows="1" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="MirrorTitle === '编辑镜像'">
          <el-col :span="20">
            <el-form-item label="镜像名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="镜像标签" :label-width="formLabelWidth" prop="tag">
              <el-input v-model="form.tag" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="启动脚本" :label-width="formLabelWidth" prop="start_shell">
              <el-input v-model="form.start_shell" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="网络模式" :label-width="formLabelWidth" prop="network_mode">
              <el-radio-group v-model="form.network_mode" :disabled="disabled">
                <el-radio label="none">none 模式</el-radio>
                <el-radio label="bridge">bridge 模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="ssh连接账户名" :label-width="formLabelWidth">
              <el-input v-model="form.ssh_username" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="ssh连接密码" :label-width="formLabelWidth">
              <el-input v-model="form.ssh_password" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="说明" :label-width="formLabelWidth" prop="illustrate">
              <el-input class="remark-hh" v-model="form.illustrate" autocomplete="off" type="textarea" :rows="1" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input class="remark-hh" v-model="form.remark" autocomplete="off" type="textarea" :rows="1" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="width: 100%; display: flex; align-items: center; justify-content: center">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="上传镜像中，请耐心等待..."
            @click="submitForm(ruleFormRef)"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="networkConfigDialogFormVisible"
      :title="networkConfigDialogTitle"
      width="35%"
      :before-close="closeNetworkConfigDialog"
    >
      <el-form :model="networkForm" ref="networkRuleFormRef" :rules="networkFormRules">
        <el-form-item label="起始ip" :label-width="formLabelWidth" prop="start_ipaddress">
          <el-input v-model="networkForm.start_ipaddress" autocomplete="off" />
        </el-form-item>
        <el-form-item label="子网掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="networkForm.netmask" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网关名" :label-width="formLabelWidth" prop="bridge_name">
          <el-input v-model="networkForm.bridge_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网关IP" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="networkForm.gateway" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetNetworkConfigForm(networkRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitNetworkConfigForm(networkRuleFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer
      v-model="dockerImageDrawer"
      :title="dockerImageDrawerTitle"
      direction="rtl"
      :before-close="handleCloseDockerImageDrawer"
      size="60%"
    >
      <div>
        <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openImageDockerDialog('add')"> 添加镜像</el-button>
      </div>
      <el-table :data="dockerImageTableData" border style="width: 100%">
        <el-table-column prop="name" label="镜像名称" width="180" />
        <el-table-column prop="docker_full_name" label="镜像名称和版本全称" width="180" />
        <el-table-column prop="tag" label="镜像标签" width="130" />
        <el-table-column prop="remark" label="备注" min-width="120" />
        <el-table-column prop="update_user" label="更新人" width="120" />
        <el-table-column prop="last_mod_time" label="修改时间" width="180" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openImageDockerDialog('edit', scope.row.id)">编辑</el-button>
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#F56C6C"
              title="确认删除这个镜像?"
              @confirm="deleteDockerImage(scope.row.id)"
            >
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="dockerImageCurrentPage"
        v-model:page-size="dockerImagePageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, prev, pager, next, jumper"
        :total="dockerImageTotal"
        @size-change="handleDockerImageSizeChange"
        @current-change="handleDockerImageCurrentChange"
      />
    </el-drawer>
    <el-dialog
      v-model="addDockerImageDialog"
      :title="addDockerImageDialogTitle"
      width="40%"
      :before-close="closeaAdDockerImageDialog"
      custom-class="addDockerImageDialog"
    >
      <el-form :model="dockerImageForm" ref="dockerImageFormRef" :rules="dockerImageFormRules">
        <el-form-item label="镜像名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dockerImageForm.name" autocomplete="off" placeholder="请输入镜像名称" />
        </el-form-item>
        <el-form-item label="镜像标签" :label-width="formLabelWidth" prop="tag">
          <el-input v-model="dockerImageForm.tag" autocomplete="off" placeholder="请输入镜像标签" />
        </el-form-item>
        <el-form-item label="启动脚本地址" :label-width="formLabelWidth" prop="start_shell">
          <!-- <CodeMirror :code="dockerImageForm.start_shell" @onCodeChange="onCodeChange" :codeStyle="{ height: '30vh', width: '25vw' }" /> -->
          <el-input v-model="dockerImageForm.start_shell" autocomplete="off" placeholder="请输入启动脚本地址,例如：/opt/run.sh" />
        </el-form-item>
        <el-form-item label="网络模式" :label-width="formLabelWidth" prop="network_mode">
          <el-select v-model="dockerImageForm.network_mode" placeholder="请选择网络模式">
            <el-option label="none模式" value="none" />
            <el-option label="bridge模式" value="bridge" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="dockerImageForm.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetDockerImageForm(dockerImageFormRef)">取消</el-button>
          <el-button type="primary" @click="submitDockerImageForm(dockerImageFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules, UploadInstance } from 'element-plus'
import { ElMessage, genFileId } from 'element-plus'
import { CirclePlus, Search, CircleCloseFilled, UploadFilled } from '@element-plus/icons-vue'
import {
  getDockerImageApi,
  addDockerImageApi,
  editDockerImageApi,
  deleteDockerImageApi,
  getDockerDeviceImagesApi,
  addDockerDeviceImagesApi,
  editDockerDeviceImagesApi,
  deleteDockerDeviceImagesApi
} from '@/api/NetDevOps/index'
import { useDockerDeviceManage } from '@/hooks/useDockerDeviceManage'
import CodeMirror from '@/components/CodeMirror-5.vue'
import Termmail from '@/components/Termail2.vue'

const dialogFormVisible = ref(false)
const termailDialog = ref(false)
const termailDialogTitle = ref('')
const isShowFullScreen = ref(false)
const termmailInfo = ref({})
const termmailId = ref(null)
const isShowTermail = ref(false)
const networkConfigDialogFormVisible = ref(false)
const networkConfigDialogTitle = ref('')
const dockerImageDrawer = ref(false)
const dockerImageDrawerTitle = ref('')
const dockerImageDrawerId = ref('')
const addDockerImageDialog = ref(false)
const addDockerImageDialogTitle = ref('')
const dockerImageForm = reactive({
  docker_device_manage_id: '',
  docker_device_images_id: '',
  name: '',
  tag: '',
  start_shell: '',
  network_mode: '',
  remark: ''
})
const dockerImageFormRef = ref<FormInstance>()
const dockerImageFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入镜像名称', trigger: 'blur' }],
  start_shell: [{ required: true, message: '启动脚本地址不能为空', trigger: 'blur' }],
  network_mode: [{ required: true, message: '请选择网络模式', trigger: 'blur' }],
  tag: [{ required: true, message: '请输入镜像标签', trigger: 'blur' }]
})
const dockerImageTableData = ref([])
const dockerImageCurrentPage = ref(1)
const dockerImagePageSize = ref(10)
const dockerImageTotal = ref(0)
const editNetworkIndex = ref(-1)
const formLabelWidth = '140px'
const MirrorTitle = ref('')
const disabled = ref(false)
const loadingTable = ref(false)
const mirrorCurrentPage = ref(1)
const mirrorPageSize = ref(10)
const mirrorTotal = ref(0)
const formType = ref('文件上传')
const dockerImageId = ref(null)
const fullscreenLoading = ref(false)
const uploadFile = ref<UploadInstance>()
const form = reactive({
  name: '',
  tag: '',
  start_shell: '',
  network_mode: 'none',
  ssh_username: '',
  ssh_password: '',
  upload_file: '',
  client_ip: '',
  client_name: '',
  client_password: '',
  image_name: '',
  image_tag: '',
  illustrate: '',
  remark: ''
})
const ruleFormRef = ref<FormInstance>()
const networkForm = reactive({
  start_ipaddress: '',
  netmask: '',
  bridge_name: '',
  gateway: ''
})
const networkRuleFormRef = ref<FormInstance>()
const networkFormRules = reactive<FormRules>({
  start_ipaddress: [
    { required: true, message: '请输入起始ip', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && !iplist.test(value)) {
          callback(new Error('请输入正确的ip地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  netmask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }],
  bridge_name: [{ required: true, message: '请输入网关名', trigger: 'blur' }],
  gateway: [
    { required: true, message: '请输入网关IP', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && !iplist.test(value)) {
          callback(new Error('请输入正确的ip地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const keywords_name = ref('')

var iplist =
  /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))|\*)((\/([012]\d|3[012]|\d))?)(,((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))|\*)((\/([012]\d|3[012]|\d))?))*$/
var ipv6 =
  /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
const validateIp = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入ip地址'))
  } else {
    let iparr = value.trim().split(',')
    for (let i = 0; i < iparr.length; i++) {
      let ip4 = !iplist.test(iparr[i])
      let ip6 = !ipv6.test(iparr[i])
      if (ip4 && ip6) {
        callback(new Error('IP格式不正确'))
        return false
      }
    }
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入镜像名称', trigger: 'blur' }],
  tag: [{ required: true, message: '请输入镜像标签', trigger: 'blur' }],
  start_shell: [{ required: true, message: '请输入启动脚本', trigger: 'blur' }],
  ssh_username: [{ required: true, message: '请输入ssh连接账户名', trigger: 'blur' }],
  ssh_password: [{ required: true, message: '请输入ssh连接密码', trigger: 'blur' }],
  network_mode: [{ required: true, message: '请选择网络模式', trigger: 'change' }],
  client_ip: [{ required: true, message: '请输入远程连接IP', trigger: 'blur' }],
  client_name: [{ required: true, message: '请输入远程连接名称', trigger: 'blur' }],
  client_password: [{ required: true, message: '请输入远程连接密码', trigger: 'blur' }],
  image_name: [{ required: true, message: '请输入远程镜像名称', trigger: 'blur' }],
  image_tag: [{ required: true, message: '请输入远程镜像标签', trigger: 'blur' }],
  upload_file: [{ required: true, message: '请上传镜像文件', trigger: 'change' }],
  illustrate: [{ required: true, message: '请输入说明', trigger: 'blur' }]
})
const mirrorTableData = ref([])

const handleExceed = files => {
  uploadFile.value!.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadFile.value!.handleStart(file)
}

const handleUpload = async (file, fileList) => {
  form.upload_file = fileList[0].raw
  console.log(`form`, form)
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      MirrorTitle.value === '镜像详情' ? resetForm(ruleFormRef.value) : MirrorTitle.value === '添加镜像' ? addMirror() : editMirror()
    }
  })
}

const submitNetworkConfigForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      networkConfigDialogTitle.value === '添加网口'
        ? form.docker_network_config.push({
            start_ipaddress: networkForm.start_ipaddress,
            netmask: networkForm.netmask,
            bridge_name: networkForm.bridge_name,
            gateway: networkForm.gateway
          })
        : (form.docker_network_config[editNetworkIndex.value] = {
            start_ipaddress: networkForm.start_ipaddress,
            netmask: networkForm.netmask,
            bridge_name: networkForm.bridge_name,
            gateway: networkForm.gateway
          })
      resetNetworkConfigForm(networkRuleFormRef.value)
    }
  })
}

const submitDockerImageForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // if (dockerImageForm.start_shell === '') {
      //   return ElMessage.error('启动脚本不能为空')
      // }
      if (addDockerImageDialogTitle.value === '添加镜像') {
        dockerImageForm.docker_device_manage_id = dockerImageDrawerId.value
        delete dockerImageForm.docker_device_images_id
        addDockerDeviceImages(dockerImageForm)
      } else {
        delete dockerImageForm.docker_device_manage_id
        editDockerDeviceImages(dockerImageForm)
      }
    }
  })
}

const addDockerDeviceImages = async params => {
  const res = await addDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    resetDockerImageForm(dockerImageFormRef.value)
    dockerImageCurrentPage.value = 1
    getDockerDeviceImages()
  }
}

const editDockerDeviceImages = async params => {
  const res = await editDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    ElMessage.success('编辑成功')
    resetDockerImageForm(dockerImageFormRef.value)
    getDockerDeviceImages()
  }
}

const deleteDockerImage = async id => {
  const res = await deleteDockerDeviceImagesApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    dockerImageCurrentPage.value = 1
    getDockerDeviceImages()
  }
}

// 添加镜像接口
const addMirror = async () => {
  const fd = new FormData()
  switch (formType.value) {
    case '远程连接':
      delete form.upload_file
      break
    case '文件上传':
      deleteItem()
      fd.append('upload_file', form.upload_file)
      fd.append('name', form.name)
      fd.append('tag', form.tag)
      fd.append('start_shell', form.start_shell)
      fd.append('network_mode', form.network_mode)
      fd.append('ssh_username', form.ssh_username)
      fd.append('ssh_password', form.ssh_password)
      fd.append('illustrate', form.illustrate)
      fd.append('remark', form.remark)
      break
    default:
      break
  }
  fullscreenLoading.value = true
  const res = await addDockerImageApi(formType.value === '远程连接' ? form : fd)
  fullscreenLoading.value = false
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    mirrorCurrentPage.value = 1
    getMirror()
    resetForm(ruleFormRef.value)
  }
}

const deleteItem = () => {
  delete form.client_ip
  delete form.client_name
  delete form.client_password
  delete form.image_name
  delete form.image_tag
}

// 修改设备接口
const editMirror = async () => {
  // const fd = new FormData()
  // switch (formType.value) {
  //   case '远程连接':
  //     delete form.upload_file
  //     form.docker_image_deposit_id = dockerImageId.value
  //     break
  //   case '文件上传':
  //     deleteItem()
  //     fd.append('upload_file', form.upload_file)
  //     fd.append('name', form.name)
  //     fd.append('tag', form.tag)
  //     fd.append('start_shell', form.start_shell)
  //     fd.append('network_mode', form.network_mode)
  //     fd.append('ssh_username', form.ssh_username)
  //     fd.append('ssh_password', form.ssh_password)
  //     fd.append('remark', form.remark)
  //     fd.append('docker_image_deposit_id', dockerImageId.value)
  //     break
  //   default:
  //     break
  // }
  const params = {
    docker_image_deposit_id: dockerImageId.value,
    start_shell: form.start_shell,
    network_mode: form.network_mode,
    ssh_username: form.ssh_username,
    ssh_password: form.ssh_password,
    name: form.name,
    tag: form.tag,
    illustrate: form.illustrate,
    remark: form.remark
  }
  fullscreenLoading.value = true
  const res = await editDockerImageApi(params)
  if (res.code === 1000) {
    fullscreenLoading.value = false
    ElMessage.success('修改成功')
    mirrorCurrentPage.value = 1
    getMirror()
    resetForm(ruleFormRef.value)
  } else {
    fullscreenLoading.value = false
  }
}

const deletetMirror = async row => {
  loadingTable.value = true
  const res = await deleteDockerImageApi(row)
  loadingTable.value = false
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    mirrorCurrentPage.value = 1
    getMirror()
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dialogFormVisible.value = false
  form.ssh_password = ''
  form.ssh_username = ''
  formType.value = '文件上传'
  uploadFile.value!.clearFiles()
  formEl.resetFields()
}

const resetNetworkConfigForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  networkConfigDialogFormVisible.value = false
  formEl.resetFields()
  editNetworkIndex.value = -1
}

const resetDockerImageForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  addDockerImageDialog.value = false
  formEl.resetFields()
}

const searchMirror = () => {
  mirrorCurrentPage.value = 1
  getMirror()
}

const openMirrorDialog = (...args) => {
  args[0] === 'detail' ? (disabled.value = true) : (disabled.value = false)
  switch (args[0]) {
    case 'add':
      MirrorTitle.value = '添加镜像'
      break
    case 'edit':
      MirrorTitle.value = '编辑镜像'
      dockerImageId.value = args[1]
      formType.value = '文件上传'
      getQueryMirror({ docker_image_deposit_id: args[1] })
      break
    case 'detail':
      MirrorTitle.value = 'Docker设备详情'
      getQueryMirror({ docker_image_deposit_id: args[1] })
      break
  }
  dialogFormVisible.value = true
}

const openImageDockerDialog = (type, id?) => {
  addDockerImageDialog.value = true
  switch (type) {
    case 'add':
      addDockerImageDialogTitle.value = '添加镜像'
      break
    case 'edit':
      addDockerImageDialogTitle.value = '编辑镜像'
      dockerImageForm.docker_device_images_id = JSON.parse(JSON.stringify(id))
      getOneDockerDeviceImages(id)
    default:
      break
  }
}

// 关闭弹窗
const closeaAdDockerImageDialog = () => {
  addDockerImageDialog.value = false
  resetDockerImageForm(dockerImageFormRef.value)
}

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  formType.value = '文件上传'
  uploadFile.value!.clearFiles()
  resetForm(ruleFormRef.value)
}

const handleCloseDockerImageDrawer = () => {
  dockerImageDrawer.value = false
}

const closeNetworkConfigDialog = () => {
  networkConfigDialogFormVisible.value = false
  resetNetworkConfigForm(networkRuleFormRef.value)
}

const getQueryMirror = async val => {
  const res = await getDockerImageApi(val)
  if (res.code === 1000) {
    for (const key in res.data) {
      form['docker_device_manage_id'] = res.data.id
      if (form.hasOwnProperty(key)) {
        form[key] = res.data[key]
      }
    }
  }
}

const getMirror = async () => {
  loadingTable.value = true
  const params = {
    page: mirrorCurrentPage.value,
    page_size: mirrorPageSize.value,
    keywords_name: keywords_name.value
  }
  const res = await getDockerImageApi(params)
  loadingTable.value = false
  if (res.code === 1000) {
    mirrorTableData.value = res.data
    mirrorTotal.value = res.total || 0
  }
}

const getDockerDeviceImages = async () => {
  const params = {
    page: dockerImageCurrentPage.value,
    page_size: dockerImagePageSize.value,
    docker_device_manage_id: dockerImageDrawerId.value
  }
  let res = await getDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    dockerImageTableData.value = res.data
    dockerImageTotal.value = res.total || 0
  }
}

const getOneDockerDeviceImages = async id => {
  const params = {
    docker_device_images_id: id,
    docker_device_manage_id: dockerImageDrawerId.value
  }
  let res = await getDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    for (const key in res.data) {
      if (dockerImageForm.hasOwnProperty(key)) {
        dockerImageForm[key] = res.data[key]
      }
    }
  }
}

const handleMirrorSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleMirrorCurrentChange = (val: number) => {
  mirrorCurrentPage.value = val
  getMirror()
}

const handleDockerImageSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleDockerImageCurrentChange = (val: number) => {
  dockerImageCurrentPage.value = val
  getDockerDeviceImages()
}

onMounted(() => {
  getMirror()
})
</script>

<style lang="scss" scoped>
.MirrorWarehouse-wrap {
  margin: 15px 0 0 20px;
  .search-add {
    display: flex;
    justify-content: space-between;
    .search-wrap {
      .el-input {
        margin-right: 0px;
      }
      .el-select {
        margin-left: 20px;
      }
    }
  }
  .el-select {
    width: 400px;
  }
  .el-input {
    width: 400px;
  }
  .el-textarea {
    // width: 400px;
  }
  .remark-hh {
    width: 400px;
  }
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
  .item-ip {
    cursor: pointer;
    color: #409eff;
  }
}
.addDockerImageDialog {
  .el-input {
    width: 25vw !important;
  }
  .el-select {
    width: 25vw !important;
  }
}
:deep(.uploadFile-demo) {
  width: 400px;
}
</style>

<style lang="scss">
.termailDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }
  .my-header2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-icon {
      font-size: 18px;
      margin-left: 10px;
      cursor: pointer;
    }
    .el-icon:hover {
      color: #75c0f2;
    }
  }
}
</style>
