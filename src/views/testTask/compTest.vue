<template>
  <div>
    <TestTaskComp
      :taskTableData="taskTableData"
      :taskTotal="taskTotal"
      :taskLoading="taskLoading"
      :keywords="keywords"
      @update:taskTableData="updateTaskTableData"
      @searchLane="searchLane"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
// @ts-ignore
import TestTaskComp from './components/TestTaskComp.vue'
import { getTaskInfoApi, deleteTaskInfoApi, runTaskInfoApi, stopTaskApi, releaseDeviceApi } from '@/api/NetDevOps/index'
import { useRoute } from 'vue-router'

const route = useRoute()
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskLoading = ref(false)
const taskTableData = ref([])
const keywords = ref('')

// 监听路由发生变化
watch(
  () => route.path,
  () => {
    const routePath = route.path.split('/')[1]
    if (routePath === 'compTest') {
      getTaskInfo()
    }
  }
)

const getTaskInfo = async () => {
  const params = {
    page: taskCurrentPage.value,
    page_size: taskPageSize.value,
    keywords: keywords.value,
    group_id: route.query.id
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

onMounted(() => {
  getTaskInfo()
})
</script>

<style lang="scss" scoped></style>
