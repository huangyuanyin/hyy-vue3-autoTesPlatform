<template>
  <!-- <el-button type="primary" class="backButton" @click="router.go(-1)">返回</el-button> -->
  <el-table
    :data="detailTableData"
    border
    style="width: 100%"
    height="80vh"
    v-loading="loading"
    @expand-change="getLog"
    :expand-row-keys="expands"
    :row-key="getRowKeys"
  >
    <el-table-column type="expand">
      <template #default="props">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="用例脚本" name="first">
            <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
            <el-input v-model="case_script" :autosize="{ minRows: 12, maxRows: 22 }" type="textarea" placeholder="Please input" />
          </el-tab-pane>
          <el-tab-pane label="脚本执行日志" name="second">
            <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
            <el-input v-model="case_log" :autosize="{ minRows: 12, maxRows: 22 }" type="textarea" placeholder="Please input" />
          </el-tab-pane>
          <el-tab-pane label="APV交互日志" name="three">
            <!-- <json-viewer :value="jsonData" copyable boxed sort /> -->
            <el-input v-model="shell_log" :autosize="{ minRows: 12, maxRows: 22 }" type="textarea" placeholder="Please input" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-table-column>
    <el-table-column label="case_ID" prop="case_id" />
    <el-table-column label="模块" prop="module" />
    <el-table-column label="响应时间" prop="use_time" />
    <el-table-column label="Comment" prop="comment" />
    <el-table-column label="结果" prop="result" />
  </el-table>
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
  <!--case脚本详情-->
  <el-dialog :model-value="isShowCaseScriptDialog" custom-class="caseScriptDialog" title="case脚本详情" @close="closeCaseScriptDialog">
    <div class="detailCaseScript">
      <monacoEditor
        v-model="caseScriptValue"
        :language="language"
        width="800px"
        height="500px"
        theme="vs-dark"
        @editor-mounted="editorMounted"
      ></monacoEditor>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import * as monaco from 'monaco-editor'
import { getReportDetailApi, getLogApi, getHistoryReportApi } from '@/api/APV/testReport.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const failId = route.query.historyResultid || route.params.reportId || route.query.reportId || ''
const isHistoty = route.query.historyResultid ? true : route.params.reportId || route.query.reportId ? false : true
const detailTableData = ref([])
const activeName = ref('first')
const case_script = ref('')
const case_log = ref('')
const shell_log = ref('')
const expands = ref([])
const caseScriptValue = ref(
  '20 | 400 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:04 CST \n20 | 200 |  TIP all 10015100161000710008 \n20 | 200 |  TIP  10015:10016 \n20 | 200 |  2:30:4-172.16.26.215-ttyS0 :  user sunyb pass click1 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : script dir /home/sunyb/sunyb.ws/src_apv/result/log//2022-09-08-02:29:22--Beta_APV_10_5_0_42.array/smoke_test//result/mnet_env//T_0001/shell-ttyS0.txt \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : Test Machine ip 172.16.26.215 \n20 | 200 |  2:30:5-172.16.26.215-ttyS0 : login user root \n20 | 200 |   \n20 | 200 |  the last prompt \n20 | 200 |  command timed-out at ../../util/cli/ca.pm line 159 \n20 | 200 |   \n 50 | 255 | Unkonw | FAIL | Unkonw Exit Code 255 \n20 | 500 | slb_rr_100.pl | Thursday, September 08, 2022 AM02:30:54 CST \nunable to update smoke test result'
)
const language = ref('perl')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
  console.log('editor实例加载完成', editor)
}
const isShowCaseScriptDialog = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const toDetailCase = () => {
  isShowCaseScriptDialog.value = true
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const closeCaseScriptDialog = () => {
  isShowCaseScriptDialog.value = false
}

const getReportModuleDetail = async (id, details, result, page) => {
  loading.value = true
  let res = await getReportDetailApi({ id, details, result, page })
  loading.value = false
  if (res.code == 1000) {
    detailTableData.value = res.data || []
    total.value = res.total || 0
  }
}

const getHistoryReportModuleDetail = async (id, details, result, page) => {
  loading.value = true
  let res = await getHistoryReportApi({ id, details, result, page })
  loading.value = false
  if (res.code == 1000) {
    detailTableData.value = res.data || []
    total.value = res.total || 0
  }
}

const getLog = (row, expandedRows) => {
  if (expands.value.includes(row.case_id)) {
    expands.value = expands.value.filter(val => val !== row.case_id)
    return false
  } else {
    if (expands.value.length != 0) {
      expands.value.splice(0, expands.value.length)
      expands.value.push(row.case_id)
    } else {
      expands.value.push(row.case_id)
    }
  }
  activeName.value = 'first'
  let LogList = []
  LogList.push(row.case_script, row.case_log, row.shell_log)
  LogList.map(async (item, index) => {
    await getLogApi({ url: String(item) }).then(res => {
      switch (index) {
        case 0:
          case_script.value = res.data || '请求错误'
          break
        case 1:
          case_log.value = res.data || '请求错误'
          break
        case 2:
          shell_log.value = res.data || '请求错误'
          break
        default:
          break
      }
    })
  })
}

const getRowKeys = row => {
  return row.case_id
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  isHistoty
    ? getHistoryReportModuleDetail(failId, 'True', 'fail', currentPage.value)
    : getReportModuleDetail(failId, 'True', 'fail', currentPage.value)
}

onMounted(() => {
  isHistoty ? getHistoryReportModuleDetail(failId, 'True', 'fail', 1) : getReportModuleDetail(failId, 'True', 'fail', 1)
})
</script>

<style lang="scss" scoped>
.backButton {
  position: fixed;
  top: 70px;
  right: 25px;
}

.el-pagination {
  justify-content: flex-end;
  margin-top: 10px;
}

.demo-tabs {
  padding-left: 10px;
}
</style>
