<template>
  <div class="testTask-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="addTask"> 新建任务</el-button>
    <el-table :data="taskTableData" border style="width: 100%">
      <el-table-column prop="name" label="任务名称" width="180" />
      <el-table-column prop="ip" label="用例总数" width="180" />
      <el-table-column prop="date" label="失败数" width="180" />
      <el-table-column prop="type" label="产品型号" />
      <el-table-column prop="username" label="版本" />
      <el-table-column prop="password" label="任务状态" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="item">
          <el-button link type="primary" size="small"> 编辑 </el-button>
          <el-button link type="danger" size="small"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { CirclePlus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const taskTableData = reactive([
  {
    name: '任务1',
    ip: '222',
    date: '333',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  },
  {
    date: '333',
    ip: '222',
    name: '任务2',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  },
  {
    date: '333',
    ip: '222',
    name: '任务3',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  },
  {
    date: '333',
    ip: '222',
    name: '任务4',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  }
])

const addTask = () => {
  router.push({ path: '/testTask/addTestTask' })
}
</script>

<style lang="scss" scoped>
.testTask-wrap {
  margin: 20px 0 0 20px;
}
</style>
