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
        return [
          {
            label: '设备IP',
            value: it.ip
          },
          {
            label: '主板类型：',
            value: it.main_board_type
          },
          {
            label: '设备型号：',
            value: it.machine_type
          },
          {
            label: '型号编码：',
            value: it.mode_code
          },
          {
            label: '配置编码：',
            value: it.config_code
          },
          {
            label: 'cavium卡：',
            value: it.cavium_card_type
          },
          {
            label: '国密卡：',
            value: it.gm_card_type
          },
          {
            label: '设备序列号：',
            value: it.machine_sn
          },
          {
            label: '产品ID：',
            value: it.product_id
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
