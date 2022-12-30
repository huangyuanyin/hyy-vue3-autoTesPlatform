<template>
  <div id="com-container" class="com-container">
    <h2>任务列表</h2>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="taskTable"
      :header-cell-style="{ background: 'rgba(7, 10, 88, 0.99) ', color: '#fff' }"
      :row-style="{ background: 'rgba(3, 14, 70, 0.5)', color: '#fff' }"
    >
      <el-table-column prop="name" label="任务名称" align="center" />
      <el-table-column prop="counts" label="总用例数" align="center" />
      <el-table-column prop="success" label="成功数" align="center" />
      <el-table-column prop="date" label="通过率" align="center" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, inject, ref } from 'vue'
import { taskApi } from '@/api/APV/taskManagement.js'

const tableData = ref([])

// 任务管理 获取接口
const getTask = async page => {
  let res = await taskApi({ page })
  if (res.code == 1000) {
    tableData.value = res.data
  }
}

onMounted(async () => {
  await getTask(1)
})
</script>

<style lang="scss" scoped>
.com-container {
  background-color: rgba(3, 14, 70, 0.5) !important;
  height: 100%;
  padding: 0 20px;

  h2 {
    color: #007bff !important;
    text-align: center;
    margin: 0;
    line-height: 40px;
  }
}

:deep(.el-table) {
  background-color: rgba(3, 14, 70, 0.5) !important;

  .el-table__header {
    background-color: rgba(3, 14, 70, 0.5) !important;
  }
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(3, 14, 70, 0.5);
}

:deep(.el-table__body) {
  height: 65vh;
}
</style>

<style lang="scss"></style>
