<template>
  <el-card shadow="never">
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column property="id" label="历史报告ID" width="200" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'history')">{{ scope.row.id }} </el-button>
        </template>
      </el-table-column>
      <el-table-column property="counts" label="用例总数" align="center" />
      <el-table-column property="pass" label="成功数" align="center" />
      <el-table-column property="fail" label="失败数" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetail(scope.row.id, 'FailNumDetail')" v-if="scope.row.fail != 0">
            {{ scope.row.fail }}
          </el-button>
          <span v-else>{{ scope.row.fail }}</span>
        </template>
      </el-table-column>
      <el-table-column property="uptime" label="创建时间" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toMark(scope.row.id)" disabled>标记</el-button>
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
import { onMounted, ref, reactive, toRef, toRefs } from 'vue'
import { datas } from '@/api/POC/index.js'
import { getHistoryReportApi } from '@/api/APV/testReport.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDataApi } from '@/utils/getApi.js'
import DataTemplateDialog from './dataTemplateDialog.vue'
import MarkDialog from './MarkDialog.vue'
import { Document } from '@element-plus/icons-vue'
const state = reactive({
  upload: {
    url: ``,
    header: {
      token: ''
    },
    resData: {}
  }
})
const route = useRoute()
const router = useRouter()
const taskid = route.params.reportId || ''
const multipleTableRef = ref()
const multipleSelection = ref([])
const tableData = ref([])
const dialogData = ref([])
const isShowDialog = ref(false)
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
  console.log('选中的...', multipleSelection.value)
}

// 批量删除
const toDataAnalysis = () => {}

// 跳转详情
const toDetail = (id, type) => {
  switch (type) {
    case 'history':
      router.push(`/APVAuto/historyReport/${route.params.reportId}/detail/${id}`)
      break
    case 'FailNumDetail':
      router.push({
        path: `/APVAuto/historyReport/${route.params.reportId}/failNumDetail/`,
        query: {
          historyResultid: id
        }
      })
    default:
      break
  }
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getHistoryReport(taskid, currentPage.value)
  console.log(`current page: ${val}`)
}

const toMark = id => {
  isShowMarkDialog.value = true
}
const closeMarkDialog = res => {
  isShowMarkDialog.value = res
}

const getHistoryReport = async (taskid, page) => {
  let res = await getHistoryReportApi({ taskid, page })
  if (res.code === 1000) {
    tableData.value = res.data || []
    total.value = res.total || 0
    await handleData(tableData.value)
  }
}

// 处理接口数据
const handleData = data => {
  console.log('data', data)
  data.map(item => {
    item.pass = item.pass ? item.pass : 0
    item.counts = item.pass ? item.pass + item.issue + item.fail : item.issue + item.fail
  })
}

onMounted(() => {
  // getDatas(filterData(formInline));
  getHistoryReport(taskid, 1)
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
</style>
