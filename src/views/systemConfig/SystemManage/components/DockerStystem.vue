<template>
  <div class="DockerStystem-wrap">
    <div class="search-add">
      <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openDockerDialog('add')"> 添加</el-button>
      <div class="search-wrap">
        <el-input
          v-model="keywords_ip"
          class="w-50 m-2"
          placeholder="输入设备IP进行搜索..."
          :prefix-icon="Search"
          @change="searchLinux('gm_card_type')"
          clearable
        />
      </div>
    </div>
    <el-table :data="dockerTableData" border style="width: 100%" stripe v-loading="loadingTable">
      <el-table-column prop="ip" label="设备IP" align="center" fixed width="180">
        <template #default="scope">
          <span class="item-ip" @click="openDockerDialog('detail', scope.row.id)">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="150" />
      <el-table-column prop="port" label="端口" align="center" width="120" />
      <el-table-column prop="container_num" label="容器总数" align="center" width="120" />
      <el-table-column prop="bridge_names" label="网口名称列表" align="center" width="200" />
      <el-table-column prop="start_ipaddress" label="起始ip" align="center" width="150" />
      <el-table-column prop="netmask" label="子网掩码" align="center" width="120" />
      <el-table-column prop="gateway" label="网关" align="center" width="150" />
      <el-table-column prop="remark" label="备注" width="200">
        <template #default="scope">
          <span v-if="scope.row.remark !== null">{{ scope.row.operate_user }}</span>
          <el-tag type="info" v-else>暂无备注</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_mod_time" label="更新时间" width="180" />
      <el-table-column fixed="right" label="操作" align="center" width="150">
        <template #default="scope">
          <el-button link type="primary" size="small" :disabled="scope.row.using" @click="openDockerDialog('edit', scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该设备?"
            trigger="click"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            @confirm="deletetDevice(scope.row.id)"
          >
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="systemCurrentPage"
      v-model:page-size="systemPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="systemTotal"
      @size-change="handlesystemSizeChange"
      @current-change="handlesystemCurrentChange"
    />

    <el-dialog v-model="dialogFormVisible" :title="DockerTitle" width="70%" :before-close="closeDialog">
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备ip" :label-width="formLabelWidth" prop="ip">
              <el-input v-model="form.ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="form.username" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="form.password" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
              <el-input v-model="form.port" autocomplete="off" :disabled="disabled" maxlength="5" @input="limitNumericInput" />
            </el-form-item>
            <el-form-item label="容器总数" :label-width="formLabelWidth" prop="container_num">
              <el-input v-model="form.container_num" autocomplete="off" :disabled="disabled" maxlength="6" @input="limitNumericInput" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网口名称列表" :label-width="formLabelWidth">
              <el-button type="primary" :icon="CirclePlus" @click="openNetworkConfigDialog('add')">新增</el-button>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" prop="docker_network_config">
              <el-table :data="form.docker_network_config" border style="width: 100%">
                <el-table-column prop="start_ipaddress" label="起始ip" width="140" />
                <el-table-column prop="netmask" label="子网掩码" width="120" />
                <el-table-column prop="gateway" label="网关" width="120" />
                <el-table-column fixed="right" label="操作" align="center">
                  <template #default="scope">
                    <el-button link type="primary" size="small" :disabled="disabled" @click="openNetworkConfigDialog('edit', scope.row)">
                      编辑
                    </el-button>
                    <el-popconfirm
                      title="确定删除该网口?"
                      trigger="click"
                      confirm-button-text="确认删除"
                      cancel-button-text="取消"
                      @confirm="deleteNetwork(scope.row.deleteNetwork)"
                    >
                      <template #reference>
                        <el-button link type="danger" size="small">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <!-- <el-form-item label="起始ip" :label-width="formLabelWidth" prop="start_ipaddress">
              <el-input v-model="form.start_ipaddress" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="子网掩码" :label-width="formLabelWidth" prop="netmask">
              <el-input v-model="form.netmask" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
              <el-input v-model="form.gateway" autocomplete="off" :disabled="disabled" />
            </el-form-item> -->
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
              <el-input v-model="form.remark" autocomplete="off" type="textarea" :rows="3" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
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
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CirclePlus, Search } from '@element-plus/icons-vue'
import {
  getDockerDeviceManageApi,
  addDockerDeviceManageApi,
  editDockerDeviceManageApi,
  deleteDockerDeviceManageApi
} from '@/api/NetDevOps/index'
import { useDockerDeviceManage } from '@/hooks/useDockerDeviceManage'

const dialogFormVisible = ref(false)
const networkConfigDialogFormVisible = ref(false)
const networkConfigDialogTitle = ref('')
const editNetworkIndex = ref(-1)
const formLabelWidth = '140px'
const DockerTitle = ref('')
const disabled = ref(false)
const loadingTable = ref(false)
const systemCurrentPage = ref(1)
const systemPageSize = ref(10)
const systemTotal = ref(0)
const form = reactive({
  ip: '',
  username: '',
  password: '',
  port: '22',
  container_num: '',
  docker_network_config: [],
  remark: ''
})
const ruleFormRef = ref<FormInstance>()
const networkForm = reactive({
  start_ipaddress: '',
  netmask: '',
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
  gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }]
})
const keywords_ip = ref('')

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
  ip: [{ required: true, validator: validateIp, trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  container_num: [
    { required: true, message: '请输入容器数量', trigger: 'blur' },
    { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }
  ],
  start_ipaddress: [{ required: true, validator: validateIp, trigger: 'blur' }],
  netmask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }],
  gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }],
  docker_network_config: [{ required: true, message: '网口列表不能为空', trigger: 'blur' }]
})
const dockerTableData = ref([])

const limitNumericInput = () => {
  form.port = form.port.replace(/\D/g, '')
}

const openNetworkConfigDialog = (type, val?) => {
  networkConfigDialogFormVisible.value = true
  switch (type) {
    case 'add':
      networkConfigDialogTitle.value = '添加网口'
      break
    case 'edit':
      networkConfigDialogTitle.value = '编辑网口'
      networkForm.start_ipaddress = val.start_ipaddress
      networkForm.netmask = val.netmask
      networkForm.gateway = val.gateway
      editNetworkIndex.value = form.docker_network_config.indexOf(val)
      break
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      DockerTitle.value === 'Docker设备详情'
        ? resetForm(ruleFormRef.value)
        : DockerTitle.value === '添加Docker设备'
        ? addDevice()
        : editDevice()
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
            gateway: networkForm.gateway
          })
        : (form.docker_network_config[editNetworkIndex.value] = {
            start_ipaddress: networkForm.start_ipaddress,
            netmask: networkForm.netmask,
            gateway: networkForm.gateway
          })
      resetNetworkConfigForm(networkRuleFormRef.value)
    }
  })
}

const deleteNetwork = val => {
  let index = form.docker_network_config.indexOf(val)
  form.docker_network_config.splice(index, 1)
}

// 添加设备接口
const addDevice = async () => {
  const res = await addDockerDeviceManageApi(form)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    resetForm(ruleFormRef.value)
    systemCurrentPage.value = 1
    getDevice()
  }
}

// 修改设备接口
const editDevice = async () => {
  const res = await editDockerDeviceManageApi(form)
  if (res.code === 1000) {
    ElMessage.success('修改成功')
    resetForm(ruleFormRef.value)
    systemCurrentPage.value = 1
    getDevice()
  }
}

const deletetDevice = async row => {
  const res = await deleteDockerDeviceManageApi(row)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    systemCurrentPage.value = 1
    getDevice()
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dialogFormVisible.value = false
  formEl.resetFields()
}

const resetNetworkConfigForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  networkConfigDialogFormVisible.value = false
  formEl.resetFields()
  editNetworkIndex.value = -1
}

const searchLinux = type => {
  systemCurrentPage.value = 1
  getDevice()
}

const openDockerDialog = (...args) => {
  args[0] === 'detail' ? (disabled.value = true) : (disabled.value = false)
  switch (args[0]) {
    case 'add':
      DockerTitle.value = '添加Docker设备'
      break
    case 'edit':
      DockerTitle.value = '编辑Docker设备'
      getQueryDevice({ docker_device_manage_id: args[1] })
      break
    case 'detail':
      DockerTitle.value = 'Docker设备详情'
      getQueryDevice({ docker_device_manage_id: args[1] })
      break
  }
  dialogFormVisible.value = true
}

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  resetForm(ruleFormRef.value)
}

const closeNetworkConfigDialog = () => {
  networkConfigDialogFormVisible.value = false
  resetNetworkConfigForm(networkRuleFormRef.value)
}

const getQueryDevice = async val => {
  const res = await getDockerDeviceManageApi(val)
  if (res.code === 1000) {
    for (const key in res.data) {
      form['docker_device_manage_id'] = res.data.id
      if (form.hasOwnProperty(key)) {
        form[key] = res.data[key]
      }
    }
  }
}

const getDevice = async () => {
  loadingTable.value = true
  const params = {
    page: systemCurrentPage.value,
    page_size: systemPageSize.value,
    keywords_ip: keywords_ip.value
  }
  const res = await getDockerDeviceManageApi(params)
  loadingTable.value = false
  if (res.code === 1000) {
    dockerTableData.value = res.data
    systemTotal.value = res.total || 0
  }
}

const handlesystemSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handlesystemCurrentChange = (val: number) => {
  systemCurrentPage.value = val
  getDevice()
}

onMounted(() => {
  getDevice()
})
</script>

<style lang="scss" scoped>
.DockerStystem-wrap {
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
    width: 600px;
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
</style>
