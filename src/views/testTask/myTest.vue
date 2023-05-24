<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="我的流水线" name="first">
        <TestTaskComp
          :taskTableData="taskTableData"
          :taskTotal="taskTotal"
          :taskLoading="taskLoading"
          :keywords="keywords"
          @update:taskTableData="updateTaskTableData"
          @searchLane="searchLane"
        />
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="second">
        <TestTaskComp
          :taskTableData="taskTableData"
          :taskTotal="taskTotal"
          :taskLoading="taskLoading"
          :keywords="keywords"
          @update:taskTableData="updateTaskTableData"
          @searchLane="searchLane"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// @ts-ignore
import TestTaskComp from './components/TestTaskComp.vue'
import { getTaskInfoApi, deleteTaskInfoApi, runTaskInfoApi, stopTaskApi, releaseDeviceApi } from '@/api/NetDevOps/index'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskLoading = ref(false)
const taskTableData = ref([])
const keywords = ref('')

const getTaskInfo = async () => {
  const params = {
    page: taskCurrentPage.value,
    page_size: taskPageSize.value,
    keywords: keywords.value,
    my_pipelines: activeName.value === 'first' ? 1 : 0,
    my_favorite: activeName.value === 'first' ? undefined : 1
  }
  taskLoading.value = true
  let res = await getTaskInfoApi(params)
  taskLoading.value = false
  if (res.code === 1000) {
    taskTableData.value = res.data || []
    taskTotal.value = res.total
  }
}

const searchLane = (val: string) => {
  keywords.value = val
  taskCurrentPage.value = 1
  getTaskInfo()
}

const updateTaskTableData = (val: number) => {
  taskCurrentPage.value = val
  getTaskInfo()
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // @ts-ignore
  activeName.value = tab.paneName
  getTaskInfo()
}

onMounted(() => {
  getTaskInfo()
})
</script>

<style lang="scss" scoped></style>
