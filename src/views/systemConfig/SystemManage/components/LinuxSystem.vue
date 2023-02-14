<template>
  <div class="LinuxSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="addLinux"> 添加设备</el-button>
    <el-table :data="linuxTableData" border style="width: 100%">
      <el-table-column prop="ip" label="设备IP" width="180" />
      <el-table-column prop="status" label="设备状态" width="180" />
      <el-table-column prop="type" label="设备类型" />
      <el-table-column prop="user" label="使用人" />
      <el-table-column prop="update" label="更新时间" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small"> 详情 </el-button>
          <el-button link type="primary" size="small"> 编辑 </el-button>
          <el-button link type="primary" size="small" v-if="isShowTermail === false" @click="openConsole(scope.row)"> 在线终端 </el-button>
          <el-button link type="warning" size="small" v-else @click="cloeConsole(scope.row)">关闭终端</el-button>
          <el-popover placement="bottom" :width="1" trigger="click" popper-class="moreGroupPopover">
            <template #reference>
              <el-button link type="info" size="small">更多</el-button>
            </template>
            <div class="moreButton">
              <el-button v-if="scope.row.user === ''" link type="primary" size="small">设备借用 </el-button>
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

    <el-dialog v-model="dialogFormVisible" title="添加Linux设备">
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item label="设备ip" :label-width="formLabelWidth" prop="ip">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备编码" :label-width="formLabelWidth" prop="coding">
          <el-input v-model="form.coding" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码卡" :label-width="formLabelWidth" prop="passCard">
          <el-input v-model="form.passCard" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备型号" :label-width="formLabelWidth" prop="model">
          <el-input v-model="form.model" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="region">
          <el-select v-model="form.region" placeholder="请选择Linux设备类型">
            <el-option label="自动化平台使用" value="shanghai" />
            <el-option label="临时设备" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品线" :label-width="formLabelWidth" prop="product">
          <el-select v-model="form.product" placeholder="请选择产品线">
            <el-option label="签名" value="shanghai" />
            <el-option label="CA" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
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
const form = reactive({
  ip: '',
  username: '',
  password: '',
  coding: '',
  passCard: '',
  model: '',
  product: '',
  region: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  ip: [{ required: true, message: '请输入设备ip', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  coding: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
  passCard: [{ required: true, message: '请输入密码卡', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  product: [{ required: true, message: '请选择产品线', trigger: 'blur' }],
  region: [{ required: true, message: '请选择设备类型', trigger: 'blur' }]
})
const linuxTableData = ref([
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
  },
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
  },
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
  },
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
  },
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
  },
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
  },
  {
    ip: '10.4.150.55',
    user: 'admin',
    update: '2016-05-03',
    type: '自动化平台使用',
    status: '空闲'
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

const addLinux = () => {
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
    width: 400px;
  }
  .el-input {
    width: 400px;
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
