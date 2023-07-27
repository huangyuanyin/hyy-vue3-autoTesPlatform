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
import { showDeviceList } from '@/views/lane/data'

const route = useRoute()
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskLoading = ref(false)
const taskTableData = ref([])
const keywords = ref('')
const tag_id = ref([])

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
    tag_list: tag_id.value,
    group_id: route.query.id
  }
  taskLoading.value = true
  let res = await getTaskInfoApi(params)
  taskLoading.value = false
  if (res.code === 1000) {
    taskTableData.value = res.data || []
    taskTableData.value.map(item => {
      item.device_list = item.device_list.map(it => {
        return showDeviceList(it)
      })
      item.docker_device_list = item.docker_device_list.map(it => {
        return [
          {
            label: '设备IP',
            value: it.ip
          },
          {
            label: '用户名',
            value: it.username
          },
          {
            label: '端口号',
            value: it.port
          }
        ]
      })
    })
    taskTotal.value = res.total
  }
}

const searchLane = (val: object) => {
  keywords.value = val.keywords
  tag_id.value = val.tag_id
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
