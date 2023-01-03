<template>
  <div class="WindowsSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="addWindows"> 添加Windows设备</el-button>
    <el-table :data="windowsTableData" border style="width: 100%">
      <el-table-column prop="name" label="设备名称" width="180" />
      <el-table-column prop="ip" label="设备IP" width="180" />
      <el-table-column prop="username" label="设备用户名" />
      <el-table-column prop="password" label="设备密码" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="item">
          <el-button link type="primary" size="small"> 编辑 </el-button>
          <el-button link type="danger" size="small"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="添加Windows设备">
      <el-form :model="form">
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备ip" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备用户名" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备密码" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { CirclePlus } from '@element-plus/icons-vue'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  name: '',
  ip: '',
  region: ''
})
const windowsTableData = ref([
  {
    name: 'Windows1',
    ip: '10.4.150.55',
    date: '2016-05-03',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  },
  {
    date: '2016-05-02',
    ip: '10.4.150.55',
    name: 'Windows2',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  },
  {
    date: '2016-05-04',
    ip: '10.4.150.55',
    name: 'Windows3',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  },
  {
    date: '2016-05-01',
    ip: '10.4.150.55',
    name: 'Windows4',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  }
])

const addWindows = () => {
  dialogFormVisible.value = true
}
</script>

<style lang="scss" scoped>
.WindowsSystem-wrap {
  margin: 15px 0 0 20px;
  .el-select {
    width: 400px;
  }
  .el-input {
    width: 400px;
  }
}
</style>
