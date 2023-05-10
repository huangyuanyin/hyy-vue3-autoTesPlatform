<template>
  <div class="LinuxSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openLinuxDialog('add')"> 添加</el-button>
    <el-table :data="linuxTableData" border style="width: 100%" stripe v-loading="loadingTable">
      <el-table-column prop="ip" label="设备IP" align="center" width="180">
        <template #default="scope">
          <span class="item-ip" @click="openLinuxDialog('detail', scope.row.id)">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="machine_type" label="设备类型" min-width="200" align="center" />
      <!-- <el-table-column prop="mode_code" label="型号编码" width="150" />
      <el-table-column prop="config_code" label="配置编码" width="150" /> -->
      <el-table-column prop="main_board_type" label="主板类型" align="center" width="160" />
      <!-- <el-table-column prop="cavium_card_type" label="cavium卡类型" width="150" align="center" />
      <el-table-column prop="gm_card_type" label="国密卡类型" width="150" align="center" /> -->
      <el-table-column prop="using" label="使用状态" width="160" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.using === true ? 'danger' : ''" disable-transitions>
            {{ scope.row.using === true ? '使用中' : '空闲中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="device_user" label="使用人" width="160" align="center">
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
      <el-table-column prop="last_mod_time" label="更新时间" width="200" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template #default="scope">
          <el-button link type="primary" size="small" :disabled="scope.row.using" @click="openLinuxDialog('edit', scope.row.id)">
            编辑
          </el-button>
          <el-popover placement="bottom" :width="1" trigger="click" popper-class="moreGroupPopover">
            <template #reference>
              <el-button link type="info" size="small">更多</el-button>
            </template>
            <div class="moreButton">
              <el-button v-if="scope.row.using" link type="warning" size="small" @click="deviceBorrowing(0, scope.row)"
                >设备归还
              </el-button>
              <el-button v-else link type="warning" size="small" @click="deviceBorrowing(1, scope.row)">设备借用 </el-button>
              <el-button link type="primary" size="small" v-if="isShowTermail === false" @click="openConsole(scope.row)" disabled>
                在线终端
              </el-button>
              <el-button link type="warning" size="small" v-else @click="cloeConsole(scope.row)">关闭终端</el-button>
              <!-- <el-button link type="primary" size="small">状态变更 </el-button> -->
              <el-popconfirm
                title="确定删除该设备?"
                trigger="click"
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                @confirm="deletetDevice(scope.row.id)"
              >
                <template #reference>
                  <el-button v-if="!scope.row.using" link type="danger" size="small">删除</el-button>
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
            <!-- <el-form-item label="设备系统类型" :label-width="formLabelWidth" prop="sys_type">
              <el-select v-model="form.sys_type" placeholder="请选择设备系统类型" :disabled="true">
                <el-option label="linux" value="linux" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="设备ip" :label-width="formLabelWidth" prop="ip">
              <el-input v-model="form.ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="form.username" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="form.password" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备端口" :label-width="formLabelWidth" prop="port">
              <el-input v-model="form.port" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备序列号" :label-width="formLabelWidth" prop="machine_sn">
              <el-input v-model="form.machine_sn" autocomplete="off" :disabled="disabled" maxlength="9" show-word-limit />
            </el-form-item>
            <el-form-item label="型号编码" :label-width="formLabelWidth" prop="mode_code">
              <el-input v-model="form.mode_code" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="配置编码" :label-width="formLabelWidth" prop="config_code">
              <el-input v-model="form.config_code" autocomplete="off" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品ID" :label-width="formLabelWidth" prop="product_id">
              <el-input v-model="form.product_id" autocomplete="off" :disabled="disabled" maxlength="6" show-word-limit />
            </el-form-item>
            <el-form-item label="主板类型" :label-width="formLabelWidth" prop="main_board_type">
              <el-select v-model="form.main_board_type" placeholder="请选择主板类型" :disabled="disabled">
                <el-option label="X86" value="x86" />
                <el-option label="兆芯C4600-server" value="兆芯C4600-server" />
                <el-option label="兆芯C4600-desktop" value="兆芯C4600-desktop" />
                <el-option label="飞腾FT2000" value="飞腾FT2000" />
                <el-option label="海光HG-3250" value="海光HG-3250" />
                <el-option label="麒麟" value="麒麟" />
              </el-select>
            </el-form-item>
            <el-form-item label="cavium类型" :label-width="formLabelWidth" prop="cavium_card_type">
              <el-select v-model="form.cavium_card_type" placeholder="请选择cavium类型" :disabled="disabled">
                <el-option label="5560-550" value="5560-550" />
                <el-option label="5560-550-c25" value="5560-550-c25" />
                <el-option label="5560-750-c35" value="5560-750-c35" />
                <el-option label="1620" value="1620" />
                <el-option label="3510" value="3510" />
                <el-option label="3530" value="3530" />
                <el-option label="无" value="无" />
              </el-select>
            </el-form-item>
            <el-form-item label="国密卡类型" :label-width="formLabelWidth" prop="gm_card_type">
              <el-select v-model="form.gm_card_type" placeholder="请选择国密卡类型" :disabled="disabled">
                <el-option label="渔翁-1.1" value="渔翁-1.1" />
                <el-option label="渔翁-4.1" value="渔翁-4.1" />
                <el-option label="渔翁-5.0" value="渔翁-5.0" />
                <el-option label="无" value="无" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" :label-width="formLabelWidth" prop="machine_type">
              <el-select v-model="form.machine_type" placeholder="请选择Linux设备类型" :disabled="disabled">
                <el-option label="3500" value="3500" />
                <el-option label="6500" value="6500" />
                <el-option label="15000" value="15000" />
                <el-option label="25000" value="25000" />
                <el-option label="7500A-DA" value="7500A-DA" />
                <el-option label="7500B-DA" value="7500B-DA" />
                <el-option label="7500C-DA" value="7500C-DA" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备组" :label-width="formLabelWidth" prop="device_group">
              <el-select v-model="form.device_group" placeholder="请选择设备组" :disabled="disabled">
                <el-option label="自动化组" value="automatic" />
                <el-option label="签名组" value="temporary" />
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
  ip: '',
  username: '',
  password: '',
  port: 22,
  machine_sn: '',
  product_id: '',
  mode_code: '',
  config_code: '',
  cavium_card_type: '',
  gm_card_type: '',
  main_board_type: '',
  machine_type: '',
  sys_type: 'linux',
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
  ip: [{ required: true, validator: validateIp, trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  port: [{ required: true, message: '请输入设备端口', trigger: 'blur' }],
  machine_sn: [{ required: true, message: '请输入设备序列号', trigger: 'blur' }],
  product_id: [{ required: true, message: '请输入产品ID', trigger: 'blur' }],
  mode_code: [{ required: true, message: '请输入型号编码', trigger: 'blur' }],
  config_code: [{ required: true, message: '请输入配置编码', trigger: 'blur' }],
  main_board_type: [{ required: true, message: '请输入主板类型', trigger: 'blur' }],
  cavium_card_type: [{ required: true, message: '请输入cavium卡类型', trigger: 'blur' }],
  gm_card_type: [{ required: true, message: '请输入国密卡类型', trigger: 'blur' }],
  machine_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
  sys_type: [{ required: true, message: '请选择设备系统类型', trigger: 'blur' }],
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
    systemCurrentPage.value = 1
    getDevice()
  }
}

// 修改设备接口
const editDevice = async () => {
  const res = await editDeviceApi(form)
  if (res.code === 1000) {
    ElMessage.success('修改成功')
    resetForm(ruleFormRef.value)
    systemCurrentPage.value = 1
    getDevice()
  }
}

// 删除设备接口
const deletetDevice = async row => {
  const res = await deletetDeviceApi(row)
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

const openLinuxDialog = (...args) => {
  args[0] === 'detail' ? (disabled.value = true) : (disabled.value = false)
  switch (args[0]) {
    case 'add':
      LinuxTitle.value = '添加Linux设备'
      break
    case 'edit':
      LinuxTitle.value = '编辑Linux设备'
      getQueryDevice({ device_manage_id: args[1] })
      break
    case 'detail':
      LinuxTitle.value = 'Linux设备详情'
      getQueryDevice({ device_manage_id: args[1] })
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

const deviceBorrowing = async (status, val) => {
  // fomr中的值等于val中对应的值
  for (const key in val) {
    if (form.hasOwnProperty(key)) {
      form[key] = val[key]
    }
  }
  form['device_manage_id'] = val.id
  form['using'] = status
  const res = await editDeviceApi(form)
  if (res.code === 1000) {
    status === 1 ? ElMessage.success('设备借用成功！') : ElMessage.success('设备归还成功！')
    systemCurrentPage.value = 1
    getDevice()
  }
}

const getQueryDevice = async val => {
  const res = await getDeviceApi(val)
  if (res.code === 1000) {
    // 循环res.data，如果form的key与res.data中的可以相等，则赋值到form
    for (const key in res.data) {
      form['device_manage_id'] = res.data.id
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
    page_size: systemPageSize.value
  }
  const res = await getDeviceApi(params)
  loadingTable.value = false
  if (res.code === 1000) {
    linuxTableData.value = res.data
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
  .item-ip {
    cursor: pointer;
    color: #409eff;
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
</style>

<style lang="scss">
.moreGroupPopover {
  min-width: 60px !important;
}
</style>
