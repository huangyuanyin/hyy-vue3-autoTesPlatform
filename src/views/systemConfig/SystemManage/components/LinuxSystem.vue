<template>
  <div class="LinuxSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openLinuxDialog('add')"> 添加</el-button>
    <el-table :data="linuxTableData" border style="width: 100%" stripe v-loading="loadingTable">
      <el-table-column prop="server_ip" label="设备IP" width="180" align="center" />
      <el-table-column prop="machine_type" label="设备类型" width="150" align="center" />
      <!-- <el-table-column prop="mode_code" label="型号编码" width="150" />
      <el-table-column prop="config_code" label="配置编码" width="150" /> -->
      <el-table-column prop="main_bord_type" label="主板类型" width="150" align="center" />
      <el-table-column prop="cavium_card_type" label="cavium卡类型" width="150" align="center" />
      <el-table-column prop="gm_card_varchar" label="国密卡类型" width="150" align="center" />
      <el-table-column prop="status" label="使用状态" width="180" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === true ? 'success' : ''" disable-transitions>使用中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="device_user" label="使用人" width="150" align="center">
        <template #default="scope">
          <span>{{ scope.row.device_user === null ? '未知' : scope.row.device_user }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="device_group" label="设备组" width="150" align="center" />
      <el-table-column prop="remark" label="备注" width="150">
        <template #default="scope">
          <span v-if="scope.row.remark !== null">{{ scope.row.device_user }}</span>
          <el-tag type="info" e-else>暂无备注</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="150" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="openLinuxDialog('detail', scope.row.server_ip)"> 详情 </el-button>
          <el-button link type="primary" size="small" @click="openLinuxDialog('edit', scope.row.server_ip)"> 编辑 </el-button>
          <el-button link type="primary" size="small" v-if="isShowTermail === false" @click="openConsole(scope.row)"> 在线终端 </el-button>
          <el-button link type="warning" size="small" v-else @click="cloeConsole(scope.row)">关闭终端</el-button>
          <el-popover placement="bottom" :width="1" trigger="click" popper-class="moreGroupPopover">
            <template #reference>
              <el-button link type="info" size="small">更多</el-button>
            </template>
            <div class="moreButton">
              <el-button v-if="scope.row.device_user === ''" link type="primary" size="small">设备借用 </el-button>
              <el-button v-else link type="primary" size="small">设备归还 </el-button>
              <el-button link type="primary" size="small">状态变更 </el-button>
              <el-popconfirm title="确定删除这个测试平台?" trigger="click" confirm-button-text="确认删除" cancel-button-text="取消">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 终端 -->
    <Termmail v-if="isShowTermail" :termmailInfo="termmailInfo" @closeTermmail="cloeConsole(termmailId)" />

    <!--linux弹窗-->
    <el-dialog v-model="dialogFormVisible" :title="LinuxTitle" width="55%">
      <el-row>
        <el-form :model="form" ref="ruleFormRef" :rules="rules">
          <el-col :span="12">
            <el-form-item label="设备系统类型" :label-width="formLabelWidth" prop="system_type">
              <el-select v-model="form.system_type" placeholder="请选择设备系统类型" :disabled="true">
                <el-option label="Linux" value="Linux" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备ip" :label-width="formLabelWidth" prop="server_ip">
              <el-input v-model="form.server_ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="user_name">
              <el-input v-model="form.user_name" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备密码" :label-width="formLabelWidth" prop="server_passw">
              <el-input v-model="form.server_passw" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备端口" :label-width="formLabelWidth" prop="server_port">
              <el-input v-model="form.server_port" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="型号编码" :label-width="formLabelWidth" prop="mode_code">
              <el-input v-model="form.mode_code" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="配置编码" :label-width="formLabelWidth" prop="config_code">
              <el-input v-model="form.config_code" autocomplete="off" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主板类型" :label-width="formLabelWidth" prop="main_bord_type">
              <el-input v-model="form.main_bord_type" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="cavium类型" :label-width="formLabelWidth" prop="cavium_card_type">
              <el-input v-model="form.cavium_card_type" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="国密卡类型" :label-width="formLabelWidth" prop="gm_card_type">
              <el-input v-model="form.gm_card_type" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备类型" :label-width="formLabelWidth" prop="machine_type">
              <el-select v-model="form.machine_type" placeholder="请选择Linux设备类型" :disabled="disabled">
                <el-option label="自动化平台使用" value="shanghai" />
                <el-option label="临时设备" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备组" :label-width="formLabelWidth" prop="device_group">
              <el-select v-model="form.device_group" placeholder="请选择设备组" :disabled="disabled">
                <el-option label="自动化组" value="zidong" />
                <el-option label="签名组" value="qianming" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
              <el-input v-model="form.remark" autocomplete="off" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import Termmail from '@/components/Termail.vue'
import { getDeviceApi, addDeviceApi } from '@/api/NetDevOps/index'
import { buildApi } from '@/api/APV/buildManagement'

const dialogFormVisible = ref(false)
const isShowTermail = ref(false)
const formLabelWidth = '140px'
const termmailInfo = ref({})
const termmailId = ref(null)
const LinuxTitle = ref('')
const disabled = ref(false)
const loadingTable = ref(false)
const form = reactive({
  server_ip: '',
  user_name: '',
  server_passw: '',
  server_port: null,
  mode_code: '',
  passCard: '',
  config_code: '',
  cavium_card_type: '',
  gm_card_type: '',
  main_bord_type: '',
  machine_type: '',
  system_type: 'Linux',
  device_group: '',
  remark: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  server_ip: [{ required: true, message: '请输入设备ip', trigger: 'blur' }],
  user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  server_passw: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  server_port: [{ required: true, message: '请输入设备端口', trigger: 'blur' }],
  passCard: [{ required: true, message: '请输入密码卡', trigger: 'blur' }],
  mode_code: [{ required: true, message: '请输入型号编码', trigger: 'blur' }],
  config_code: [{ required: true, message: '请输入配置编码', trigger: 'blur' }],
  main_bord_type: [{ required: true, message: '请输入主板类型', trigger: 'blur' }],
  cavium_card_type: [{ required: true, message: '请输入cavium卡类型', trigger: 'blur' }],
  gm_card_type: [{ required: true, message: '请输入国密卡类型', trigger: 'blur' }],
  machine_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
  system_type: [{ required: true, message: '请选择设备系统类型', trigger: 'blur' }],
  device_group: [{ required: true, message: '请选择设备组', trigger: 'blur' }]
})
const linuxTableData = ref([])

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addDevice()
    } else {
      ElMessage.warning('有待完善的表单输入项')
    }
  })
}

// 添加设备接口
const addDevice = async () => {
  const res = await addDeviceApi(form)
  if (res.code === 200) {
    ElMessage.success('添加成功')
    // resetForm(ruleFormRef)
    getDevice()
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dialogFormVisible.value = false
  formEl.resetFields()
}

const openLinuxDialog = (...args) => {
  args[0] === 'detail' ? (disabled.value = true) : (disabled.value = false)
  switch (args[0]) {
    case 'add':
      LinuxTitle.value = '添加Linux设备'
      break
    case 'edit':
      LinuxTitle.value = '编辑Linux设备'
      break
    case 'detail':
      LinuxTitle.value = 'Linux设备详情'
      break
  }
  console.log(`output->...args`, args)
  dialogFormVisible.value = true
}

const openConsole = async row => {
  isShowTermail.value = true
  // if (isShowTermail.value) {
  //   ElMessage({
  //     message: '已有打开的终端,请先关闭!',
  //     type: 'warning'
  //   })
  //   return
  // }
  // await getDeviceInfo(row)
  termmailId.value = row
}

const cloeConsole = row => {
  row.isShowTermail = false
  isShowTermail.value = false
}

const getDevice = async () => {
  loadingTable.value = true
  const res = await getDeviceApi({})
  loadingTable.value = false
  if (res.code === 1000) {
    linuxTableData.value = res.data
  }
}

onMounted(() => {
  getDevice()
})
</script>

<style lang="scss" scoped>
.LinuxSystem-wrap {
  margin: 15px 0 0 20px;
  .el-select {
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
}
.moreButton {
  display: flex;
  flex-direction: column;
  .el-button {
    margin-bottom: 5px;
    margin-left: 0;
  }
}
:deep(.el-popover.el-popper) {
  min-width: 0px;
}
</style>
