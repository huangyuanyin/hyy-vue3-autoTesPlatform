<template>
  <div class="LinuxSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openLinuxDialog('add')"> 添加</el-button>
    <el-table :data="linuxTableData" border style="width: 100%" stripe>
      <el-table-column prop="server_ip" label="设备IP" width="180" />
      <el-table-column prop="machine_type" label="设备类型" width="150" />
      <!-- <el-table-column prop="mode_code" label="型号编码" width="150" />
      <el-table-column prop="config_code" label="配置编码" width="150" /> -->
      <el-table-column prop="main_bord_type" label="主板类型" width="150" />
      <el-table-column prop="cavium_card_type" label="cavium卡类型" width="150" />
      <el-table-column prop="gm_card_varchar" label="国密卡类型" width="150" />
      <el-table-column prop="usage_status" label="使用状态" width="180" />
      <el-table-column prop="device_user" label="使用人" width="150" />
      <el-table-column prop="device_group" label="设备组" width="150" />
      <el-table-column prop="remark" label="备注" width="150" />
      <el-table-column prop="update_time" label="更新时间" width="150" />
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
            <el-form-item label="设备ip" :label-width="formLabelWidth" prop="server_ip">
              <el-input v-model="form.server_ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="userName">
              <el-input v-model="form.userName" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备密码" :label-width="formLabelWidth" prop="serverPasswd">
              <el-input v-model="form.serverPasswd" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备端口" :label-width="formLabelWidth" prop="serverPort">
              <el-input v-model="form.serverPort" autocomplete="off" :disabled="disabled" />
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
            <el-form-item label="国密卡类型" :label-width="formLabelWidth" prop="gm_card_varchar">
              <el-input v-model="form.gm_card_varchar" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备类型" :label-width="formLabelWidth" prop="machineType">
              <el-select v-model="form.machineType" placeholder="请选择Linux设备类型" :disabled="disabled">
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
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import Termmail from '@/components/Termail.vue'

const dialogFormVisible = ref(false)
const isShowTermail = ref(false)
const formLabelWidth = '140px'
const termmailInfo = ref({})
const termmailId = ref(null)
const LinuxTitle = ref('')
const disabled = ref(false)
const form = reactive({
  server_ip: '',
  userName: '',
  serverPasswd: '',
  serverPort: null,
  mode_code: '',
  coding: '',
  passCard: '',
  config_code: '',
  cavium_card_type: '',
  gm_card_varchar: '',
  main_bord_type: '',
  machineType: '',
  device_group: '',
  remark: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  server_ip: [{ required: true, message: '请输入设备ip', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  serverPasswd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  serverPort: [{ required: true, message: '请输入设备端口', trigger: 'blur' }],
  coding: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
  passCard: [{ required: true, message: '请输入密码卡', trigger: 'blur' }],
  mode_code: [{ required: true, message: '请输入型号编码', trigger: 'blur' }],
  config_code: [{ required: true, message: '请输入配置编码', trigger: 'blur' }],
  main_bord_type: [{ required: true, message: '请输入主板类型', trigger: 'blur' }],
  cavium_card_type: [{ required: true, message: '请输入cavium卡类型', trigger: 'blur' }],
  gm_card_varchar: [{ required: true, message: '请输入国密卡类型', trigger: 'blur' }],
  machineType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
  device_group: [{ required: true, message: '请选择设备组', trigger: 'blur' }]
})
const linuxTableData = ref([
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲',
    remark: '暂无备注'
  },
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲',
    remark: '暂无备注'
  },
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲'
  },
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲'
  },
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲'
  },
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲'
  },
  {
    server_ip: '10.4.150.55',
    device_user: 'admin',
    device_group: '自动化组',
    update_time: '2016-05-03',
    machine_type: '6500',
    mode_code: 'Z213NAJ',
    config_code: 'XASL21000A',
    main_bord_type: 'x86',
    usage_status: '空闲'
  }
])

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
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
