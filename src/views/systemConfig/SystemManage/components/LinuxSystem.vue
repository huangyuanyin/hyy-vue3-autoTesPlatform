<template>
  <div class="LinuxSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openLinuxDialog('add')"> 添加</el-button>
    <el-table :data="linuxTableData" border style="width: 100%" stripe v-loading="loadingTable">
      <el-table-column prop="server_ip" label="设备IP" align="center" />
      <el-table-column prop="machine_type" label="设备类型" width="200" align="center" />
      <!-- <el-table-column prop="mode_code" label="型号编码" width="150" />
      <el-table-column prop="config_code" label="配置编码" width="150" /> -->
      <el-table-column prop="main_bord_type" label="主板类型" width="200" align="center" />
      <!-- <el-table-column prop="cavium_card_type" label="cavium卡类型" width="150" align="center" />
      <el-table-column prop="gm_card_varchar" label="国密卡类型" width="150" align="center" /> -->
      <el-table-column prop="status" label="使用状态" width="200" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === true ? 'success' : ''" disable-transitions>使用中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="device_user" label="使用人" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.device_user === null ? '未知' : scope.row.device_user }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="device_group" label="设备组" width="150" align="center" />
      <el-table-column prop="remark" label="备注" width="150">
        <template #default="scope">
          <span v-if="scope.row.remark !== null">{{ scope.row.device_user }}</span>
          <el-tag type="info" e-else>暂无备注</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="update_time" label="更新时间" width="250" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="250">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="openLinuxDialog('detail', scope.row.id)"> 详情 </el-button>
          <el-button link type="primary" size="small" @click="openLinuxDialog('edit', scope.row.id)"> 编辑 </el-button>
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
              <el-popconfirm
                title="确定删除这个测试平台?"
                trigger="click"
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                @confirm="deletetDevice(scope.row.id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-popover>
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

    <!-- 终端 -->
    <Termmail v-if="isShowTermail" :termmailInfo="termmailInfo" @closeTermmail="cloeConsole(termmailId)" />

    <!--linux弹窗-->
    <el-dialog v-model="dialogFormVisible" :title="LinuxTitle" width="55%" :before-close="closeDialog">
      <el-row>
        <el-form :model="form" ref="ruleFormRef" :rules="rules">
          <el-col :span="12">
            <!-- <el-form-item label="设备系统类型" :label-width="formLabelWidth" prop="system_type">
              <el-select v-model="form.system_type" placeholder="请选择设备系统类型" :disabled="true">
                <el-option label="linux" value="linux" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="设备ip" :label-width="formLabelWidth" prop="server_ip">
              <el-input v-model="form.server_ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="user_name">
              <el-input v-model="form.user_name" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备密码" :label-width="formLabelWidth" prop="server_passwd">
              <el-input v-model="form.server_passwd" autocomplete="off" :disabled="disabled" />
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
              <el-select v-model="form.main_bord_type" placeholder="请选择主板类型" :disabled="disabled">
                <el-option label="X86" value="shanghai" />
                <el-option label="其他" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="cavium类型" :label-width="formLabelWidth" prop="cavium_card_type">
              <el-select v-model="form.cavium_card_type" placeholder="请选择cavium类型" :disabled="disabled">
                <el-option label="类型一" value="shanghai" />
                <el-option label="类型二" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="国密卡类型" :label-width="formLabelWidth" prop="gm_card_varchar">
              <el-select v-model="form.gm_card_varchar" placeholder="请选择国密卡类型" :disabled="disabled">
                <el-option label="类型一" value="shanghai" />
                <el-option label="类型二" value="beijing" />
              </el-select>
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
              <el-input v-model="form.remark" autocomplete="off" type="textarea" :rows="1" :disabled="disabled" />
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
import { getDeviceApi, addDeviceApi, editDeviceApi, deletetDeviceApi } from '@/api/NetDevOps/index'
import { utc2beijing } from '@/utils/util.js'

const dialogFormVisible = ref(false)
const isShowTermail = ref(false)
const formLabelWidth = '140px'
const termmailInfo = ref({})
const termmailId = ref(null)
const LinuxTitle = ref('')
const disabled = ref(false)
const loadingTable = ref(false)
const systemCurrentPage = ref(1)
const systemPageSize = ref(10)
const systemTotal = ref(0)
const form = reactive({
  server_ip: '',
  user_name: '',
  server_passwd: '',
  server_port: 22,
  mode_code: '',
  config_code: '',
  cavium_card_type: '',
  gm_card_varchar: '',
  main_bord_type: '',
  machine_type: '',
  system_type: 'linux',
  device_group: '',
  remark: ''
})
const ruleFormRef = ref<FormInstance>()

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
  server_ip: [{ required: true, validator: validateIp, trigger: 'blur' }],
  user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  server_passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  server_port: [{ required: true, message: '请输入设备端口', trigger: 'blur' }],
  mode_code: [{ required: true, message: '请输入型号编码', trigger: 'blur' }],
  config_code: [{ required: true, message: '请输入配置编码', trigger: 'blur' }],
  main_bord_type: [{ required: true, message: '请输入主板类型', trigger: 'blur' }],
  cavium_card_type: [{ required: true, message: '请输入cavium卡类型', trigger: 'blur' }],
  gm_card_varchar: [{ required: true, message: '请输入国密卡类型', trigger: 'blur' }],
  machine_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
  system_type: [{ required: true, message: '请选择设备系统类型', trigger: 'blur' }],
  device_group: [{ required: true, message: '请选择设备组', trigger: 'blur' }]
})
const linuxTableData = ref([])

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      LinuxTitle.value === '添加Linux设备' ? addDevice() : editDevice()
    } else {
      // ElMessage.warning('有待完善的表单输入项')
    }
  })
}

// 添加设备接口
const addDevice = async () => {
  const res = await addDeviceApi(form)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    resetForm(ruleFormRef.value)
    getDevice()
  }
}

// 修改设备接口
const editDevice = async () => {
  const res = await editDeviceApi(form)
  if (res.code === 1000) {
    ElMessage.success('修改成功')
    // resetForm(ruleFormRef)
    getDevice()
  }
}

// 删除设备接口
const deletetDevice = async row => {
  const res = await deletetDeviceApi({ id: row })
  if (res.code === 1000) {
    ElMessage.success('删除成功')
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
      getQueryDevice({ id: args[1] })
      break
    case 'detail':
      LinuxTitle.value = 'Linux设备详情'
      getQueryDevice({ id: args[1] })
      break
  }
  console.log(`output->...args`, args)
  dialogFormVisible.value = true
}

const openConsole = async row => {
  isShowTermail.value = true
  termmailId.value = row
}

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  resetForm(ruleFormRef.value)
}

// 关闭终端
const cloeConsole = row => {
  row.isShowTermail = false
  isShowTermail.value = false
}

const getQueryDevice = async val => {
  const res = await getDeviceApi(val)
  if (res.code === 1000) {
    // 循环res.data，如果form的key与res.data中的可以相等，则赋值到form
    for (const key in res.data[0]) {
      form['id'] = res.data[0].id
      if (form.hasOwnProperty(key)) {
        form[key] = res.data[0][key]
      }
    }
  }
}

const getDevice = async () => {
  loadingTable.value = true
  const res = await getDeviceApi({})
  loadingTable.value = false
  if (res.code === 1000) {
    linuxTableData.value = res.data
    linuxTableData.value.map(item => {
      item.update_time = utc2beijing(item.update_time)
    })
    systemTotal.value = res.total || 0
  }
}

const handlesystemSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handlesystemCurrentChange = (val: number) => {
  systemCurrentPage.value = val
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
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
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
