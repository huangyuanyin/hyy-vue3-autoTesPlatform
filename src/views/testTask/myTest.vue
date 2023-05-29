<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="我的流水线" name="my">
        <TestTaskComp
          :taskTableData="taskTableData"
          :taskTotal="taskTotal"
          :taskLoading="taskLoading"
          :keywords="keywords"
          @update:taskTableData="updateTaskTableData"
          @searchLane="searchLane"
        />
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="favorite">
        <TestTaskComp
          :taskTableData="favoriteTaskTableData"
          :taskTotal="favoriteTaskTotal"
          :taskLoading="favoriteTaskLoading"
          :keywords="favoritekKeywords"
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
import { getTaskInfoApi, deleteTaskInfoApi, runTaskInfoApi, stopTaskApi, releaseDeviceApi, getFavoriteTaskApi } from '@/api/NetDevOps/index'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('my')
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskLoading = ref(false)
const taskTableData = ref([])
const favoriteTaskTableData = ref([])
const favoriteTaskTotal = ref(0)
const favoriteTaskLoading = ref(false)
const keywords = ref('')
const favoritekKeywords = ref('')
const tag_id = ref([])

const getTaskInfo = async () => {
  const params = {
    page: taskCurrentPage.value,
    page_size: taskPageSize.value,
    keywords: keywords.value,
    tag_list: tag_id.value,
    my_pipelines: 1
  }
  taskLoading.value = true
  let res = await getTaskInfoApi(params)
  taskLoading.value = false
  if (res.code === 1000) {
    taskTableData.value = res.data || []
    // @ts-ignore
    taskTotal.value = res.total
  }
}

const getFavoriteTask = async () => {
  const params = {
    page: taskCurrentPage.value,
    page_size: taskPageSize.value,
    keywords: favoritekKeywords.value,
    tag_list: tag_id.value,
    my_favorite: 1
  }
  favoriteTaskLoading.value = true
  let res = await getFavoriteTaskApi(params)
  favoriteTaskLoading.value = false
  if (res.code === 1000) {
    favoriteTaskTableData.value = res.data || []
    // @ts-ignore
    favoriteTaskTotal.value = res.total
  }
}

const searchLane = (val: object) => {
  if (activeName.value === 'my') {
    keywords.value = val.keywords
    tag_id.value = val.tag_id
    taskCurrentPage.value = 1
    getTaskInfo()
  } else {
    favoritekKeywords.value = val.keywords
    tag_id.value = val.tag_id
    taskCurrentPage.value = 1
    getFavoriteTask()
  }
}

const updateTaskTableData = (val: number) => {
  taskCurrentPage.value = val
  getTaskInfo()
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // @ts-ignore
  activeName.value = tab.paneName
  activeName.value === 'my' ? getTaskInfo() : getFavoriteTask()
}

onMounted(() => {
  getFavoriteTask()
  getTaskInfo()
})
</script>

<style lang="scss" scoped></style>
