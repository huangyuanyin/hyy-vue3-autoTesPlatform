<template>
  <el-card shadow="never">
    <div class="search-wrap">
      <div>
        <el-select size="large" clearable v-model="searchBuild" placeholder="请选择要搜索的build版本..." @change="getReport(1)">
          <el-option v-for="(item, index) in state.buildData" :key="'buildData' + index" :label="item.name" :value="item.name" />
        </el-select>
        <el-select size="large" clearable v-model="searchGroup" placeholder="请选择要搜索的任务状态..." @change="getReport(1)">
          <el-option
            v-for="(item, index) in state.selectStatusList"
            :key="'selectStatusList' + index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          size="large"
          clearable
          v-model="searchUser"
          placeholder="请输入要搜索的负责人..."
          :suffix-icon="Search"
          @change="getReport(1)"
        />
      </div>
    </div>

    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column property="id" label="报告ID" align="center" />
      <el-table-column property="name" label="任务名称" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'detail')">{{ scope.row.name }} </el-button>
        </template>
      </el-table-column>
      <el-table-column property="counts" label="用例总数" align="center" />
      <el-table-column property="fail_cases" label="失败数" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'FailNumDetail')" v-if="scope.row.fail_cases != 0">
            {{ scope.row.fail_cases }}
          </el-button>
          <span v-else>{{ scope.row.fail_cases }}</span>
        </template>
      </el-table-column>
      <el-table-column property="uptime" label="更新时间" :formatter="dateFormatter" width="220" align="center" />
      <el-table-column property="user" label="负责人" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" disabled size="small" @click="toMark(scope.row.id)">标记</el-button>
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'history')">历史报告</el-button>
          <!-- <el-button link type="danger" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="bottomWrap">
      <!-- <div class="buttonGroup">
        <el-button @click="toDataAnalysis()" type="primary" disabled> 批量删除 </el-button>
        <el-button @click="clearSelection()">重新选择</el-button>
      </div> -->
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :small="false"
        :background="false"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
  <MarkDialog :markData="markData" :isShowDialog="isShowMarkDialog" v-on:closeMarkDialog="closeMarkDialog(res)" />
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, toRef, toRefs, defineProps } from 'vue'
import { getReportApi } from '@/api/APV/testReport.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { utc2beijing } from '@/utils/util.js'
import MarkDialog from './components/MarkDialog.vue'
import { buildApi } from '@/api/APV/buildManagement.js'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: false
  },
  rootKey: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const multipleTableRef = ref()
const multipleSelection = ref([])
const tableData = ref([])
const isShowMarkDialog = ref(false)
const markData = ref({})
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const formInline: any = reactive({
  id: '',
  user: '',
  date1: '',
  date2: '',
  status: '',
  apv_model: '',
  ipversion: '',
  build: ''
})

const state = reactive({
  buildData: [],
  selectStatusList: [
    {
      value: 'running',
      label: '运行中'
    },
    {
      value: 'fail',
      label: '已失败'
    },
    {
      value: 'stop',
      label: '已停止'
    }
  ]
})
const searchUser = ref('')
const searchBuild = ref('')
const searchGroup = ref('')

const getBuild = async () => {
  let res = await buildApi({ filetype: 'apvbuild' })
  state.buildData = res.data.map(item => ({ name: item }))
}

const getGroupDataId = value => {
  // addTaskForm.group = value
}

const getReport = async page => {
  let build = searchBuild.value
  let user = searchUser.value
  let res = await getReportApi({ page, build, state: searchGroup.value, user })
  if (res.code === 1000) {
    tableData.value = res.data
    total.value = res.total
  }
}

const onQuery = () => {
  // getDatas(filterData(formInline));
}
const onReset = () => {
  Object.keys(formInline).map(key => {
    formInline[key] = ''
  })
}
const clearSelection = () => {
  multipleTableRef.value!.clearSelection()
}
const handleSelectionChange = val => {
  multipleSelection.value = val
}
const toDataAnalysis = () => {}

// 跳转详情
const toDetail = (id, type) => {
  switch (type) {
    case 'detail': {
      router.push({
        path: '/APVAuto/reportDetail',
        query: {
          resultid: id
        }
      })
      break
    }
    case 'history':
      router.push(`/APVAuto/historyReport/${id}`)
      break
    case 'FailNumDetail':
      router.push({
        path: `/APVAuto/templateReport/failNumDetail`,
        query: {
          reportId: id
        }
      })
    default:
      break
  }
}

const dateFormatter = (row, column) => {
  let date = row[column.property]
  return utc2beijing(date)
}

const toMark = id => {
  isShowMarkDialog.value = true
}
const closeMarkDialog = res => {
  isShowMarkDialog.value = res
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getReport(currentPage.value)
}

onMounted(async () => {
  await getReport(1)
  await getBuild()
})
</script>

<style lang="scss" scoped>
.exportForm {
  display: flex;
  justify-content: end;

  .el-input {
    width: 300px;
  }
}

.text-center {
  display: flex;
  justify-content: center;
}

:deep(.el-upload-list) {
  margin: 0px;
}

.bottomWrap {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}

:deep(.cell) {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-upload {
    height: 24px;
    line-height: 24px;
    margin-left: 10px;
  }
}

.search-wrap {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;

  .el-select {
    margin: 0 10px;
    width: 220px;
  }

  .el-input {
    width: 220px;
  }
}
</style>
