<template>
  <div>
    <el-button type="primary" style="margin-bottom: 20px" @click="toAddTask">创建任务</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="date" label="Date" width="150" align="center" />
      <el-table-column prop="name" label="Name" width="120" align="center" />
      <el-table-column prop="state" label="State" width="120" align="center" />
      <el-table-column prop="city" label="City" width="120" align="center" />
      <el-table-column prop="address" label="Address" width="600" align="center" />
      <el-table-column prop="status" label="任务状态" width="120" align="center" />
      <el-table-column fixed="right" label="Operations" width="120" align="center">
        <template #default>
          <el-button link type="primary" size="small" @click="toEditTask">编辑</el-button>
          <el-button link type="primary" size="small" @click="handleClick">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { instrumentManagementData } from './data.js'
export default defineComponent({
  setup() {
    const router = useRouter()
    const tableData = ref(instrumentManagementData)
    const handleClick = () => {
      console.log('click')
    }
    const toAddTask = () => {
      router.push('/POCTest/taskDetail')
    }
    const toEditTask = () => {
      router.push('/POCTest/taskDetail')
    }
    return {
      router,
      tableData,
      handleClick,
      toAddTask,
      toEditTask
    }
  }
})
</script>
