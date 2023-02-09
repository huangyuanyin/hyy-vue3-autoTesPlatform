<template>
  <div class="LinuxSystem-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="addLinux"> 添加Linux设备</el-button>
    <el-table :data="linuxTableData" border style="width: 100%">
      <el-table-column prop="name" label="设备名称" width="180" />
      <el-table-column prop="ip" label="设备IP" width="180" />
      <el-table-column prop="date" label="设备型号" width="180" />
      <el-table-column prop="type" label="设备类型" />
      <el-table-column prop="username" label="设备用户名" />
      <el-table-column prop="password" label="设备密码" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="item">
          <el-button link type="primary" size="small"> 详情 </el-button>
          <el-button link type="primary" size="small"> 编辑 </el-button>
          <el-button link type="danger" size="small"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="添加Linux设备">
      <el-form :model="form">
        <el-form-item label="设备类型" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择Linux设备类型">
            <el-option label="自动化平台使用" value="shanghai" />
            <el-option label="临时设备" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备ip" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备用户名" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备密码" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备编码" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备状态" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择设备状态">
            <el-option label="平台使用中" value="shanghai" />
            <el-option label="空闲" value="beijing" />
            <el-option label="临时占用人" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码卡" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="产品线" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择产品线">
            <el-option label="签名" value="shanghai" />
            <el-option label="CA" value="beijing" />
          </el-select>
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
const linuxTableData = ref([
  {
    name: 'Linux1',
    ip: '10.4.150.55',
    date: '2016-05-03',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  },
  {
    date: '2016-05-02',
    ip: '10.4.150.55',
    name: 'Linux2',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  },
  {
    date: '2016-05-04',
    ip: '10.4.150.55',
    name: 'Linux3',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  },
  {
    date: '2016-05-01',
    ip: '10.4.150.55',
    name: 'Linux4',
    type: '自动化平台使用',
    username: 'admin',
    password: '123456'
  }
])

const addLinux = () => {
  dialogFormVisible.value = true
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
</style>
