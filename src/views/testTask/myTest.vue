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
    taskTableData.value.map(item => {
      item.device_list = item.device_list.map(it => {
        return [
          {
            label: '设备IP',
            value: it.ip
          },
          {
            label: 'CPU类型：',
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
  let res = await getTaskInfoApi(params)
  favoriteTaskLoading.value = false
  if (res.code === 1000) {
    favoriteTaskTableData.value = res.data || []
    // @ts-ignore
    favoriteTaskTotal.value = res.total
    favoriteTaskTableData.value.map(item => {
      item.device_list = item.device_list.map(it => {
        return [
          {
            label: '设备IP',
            value: it.ip
          },
          {
            label: 'CPU类型：',
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
  activeName.value === 'my' ? getTaskInfo() : getFavoriteTask()
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // @ts-ignore
  activeName.value = tab.paneName
  activeName.value === 'my' ? getTaskInfo() : getFavoriteTask()
}

onMounted(() => {
  getTaskInfo()
})
</script>

<style lang="scss" scoped></style>
