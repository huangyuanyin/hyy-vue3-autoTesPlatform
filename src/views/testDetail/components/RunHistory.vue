<template>
  <div class="RunHistory-wrap">
    <el-table :data="tableData" stripe style="width: 100%" max-height="70vh">
      <el-table-column prop="execution_number" label="运行记录" width="100">
        <template #default="scope">
          <span>#{{ scope.row.execution_number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template #default="scope">
          <div class="pipe-status">
            <el-tooltip popper-class="box-item" effect="customized" :content="`${statusMap[scope.row.status]}`" placement="top">
              <div class="pipe-status-item" v-if="scope.row.status === 'not_start'">
                <el-icon style="color: #e6a23c"><InfoFilled /></el-icon>
                未运行
              </div>
              <div class="pipe-status-item" v-if="scope.row.status === 'wait_execute'">
                <el-icon style="color: #000"><InfoFilled /></el-icon>
                待执行
              </div>
              <div class="pipe-status-item" v-if="scope.row.status === 'success'">
                <el-icon style="color: #67c23a"><CircleCheckFilled /></el-icon>
                运行成功
              </div>
              <div class="pipe-status-item" v-if="scope.row.status === 'fail'">
                <el-icon style="color: #e62412"><CircleCloseFilled /></el-icon>
                运行失败
              </div>
              <div class="pipe-status-item" v-if="scope.row.status === 'in_progress'">
                <el-icon class="run-icon" style="color: #409eff"><RefreshRight /></el-icon>
                运行中
              </div>
              <div class="pipe-status-item" v-if="scope.row.status === 'channel'">
                <el-icon style="color: #909399"><RemoveFilled /></el-icon>
                已取消
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="运行详情" align="center">
        <template #default="scope">
          <div class="pipe-history">
            <el-tooltip
              v-for="(item, index) in scope.row.task_swim_lanes_history"
              :key="'task_swim_lanes_history' + index"
              :content="`${item.name}：${statusMap[item.status]}`"
              popper-class="box-item"
              effect="customized"
              placement="top"
            >
              <div class="group-status">
                <div class="content">
                  <div class="title">{{ item.name }}</div>
                  <div class="point" :class="item.status"></div>
                </div>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="触发信息" width="180" align="center">
        <template #default="scope">
          <span v-if="scope.row.trigger_ways === 'period'">手动触发</span>
          <span v-else>自动触发</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="持续时间" align="center" width="150" />
      <el-table-column prop="last_mod_time" label="最后运行时间" width="230" align="center" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleClick(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="runHistoryCurrentPage"
      v-model:page-size="runHistoryPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="runHistoryTotal"
      @size-change="handleRunHistorySizeChange"
      @current-change="handleRunHistoryCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { getTaskHistoryApi } from '@/api/NetDevOps/index'
import {
  CirclePlus,
  CircleCloseFilled,
  CircleCheckFilled,
  InfoFilled,
  WarningFilled,
  RemoveFilled,
  RefreshRight
} from '@element-plus/icons-vue'

const props = defineProps({
  isUpdateHistory: {
    type: Boolean,
    default: false
  }
})

watchEffect(() => {
  if (props.isUpdateHistory) {
    getTaskHistory()
  }
})

const emit = defineEmits(['handleClick'])

const route = useRoute()
const tableData = ref([])
const statusMap = {
  wait_execute: '待执行',
  not_start: '未运行',
  in_progress: '运行中',
  success: '运行成功',
  fail: '运行失败',
  channel: '已取消'
}
const runHistoryCurrentPage = ref(1)
const runHistoryPageSize = ref(10)
const runHistoryTotal = ref(0)

const handleRunHistorySizeChange = async (val: number) => {
  runHistoryPageSize.value = val
  await getTaskHistory()
}

const handleRunHistoryCurrentChange = async (val: number) => {
  runHistoryCurrentPage.value = val
  await getTaskHistory()
}

const handleClick = val => {
  emit('handleClick', val)
}

const getTaskHistory = async () => {
  const params = {
    task_id: route.query.id,
    page: runHistoryCurrentPage.value,
    page_size: runHistoryPageSize.value
  }
  let res = await getTaskHistoryApi(params)
  if (res.code === 1000) {
    tableData.value = res.data
    // @ts-ignore
    runHistoryTotal.value = res.total
  }
}

onMounted(() => {
  getTaskHistory()
})
</script>

<style lang="scss" scoped>
.RunHistory-wrap {
  padding: 20px 32px;
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
  .pipe-status {
    .pipe-status-item {
      display: flex;
      align-items: center;
      .run-icon {
        animation: run 0.8s infinite;
      }
      @keyframes run {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
    .el-icon {
      height: 43px;
      line-height: 43px;
      font-size: 20px;
      margin-right: 8px;
    }
  }
  .pipe-history {
    display: flex;
    justify-content: center;
    .group-status {
      min-width: 80px;
      display: flex;
      position: relative;
      text-align: center;
      -webkit-box-pack: center;
      -webkit-box-align: end;
      align-items: flex-end;
      margin-bottom: 5px;
      .content {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        .title {
          color: #383838;
          margin-bottom: 10px;
          // padding: 0 10px;
          // box-sizing: border-box;
          // max-width: 100px;
          width: 70px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .point {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 100%;
          text-align: center;
          margin: 0 auto;
        }
        .success {
          border: 1px solid #67c23a;
          color: #67c23a;
          background: #67c23a;
        }
        .fail {
          border: 1px solid #f56c6c;
          color: #f56c6c;
          background: #f56c6c;
        }
        .in_progress {
          border: 2px solid #1b9aee !important;
          color: #1b9aee;
          background: #1b9aee;
        }
        .wait_execute {
          border: 2px solid #000 !important;
          color: #000;
          background: #000;
        }
        .not_start {
          border: 2px solid #e6a23c !important;
          color: #e6a23c;
          background: #e6a23c;
        }
        .channel {
          border: 2px solid #909399 !important;
          color: #909399;
          background: #909399;
        }
      }
      &::after {
        content: '-';
        display: inline-block;
        width: 80px;
        color: transparent;
        border-bottom: 1px solid #e9edf0;
        vertical-align: middle;
        height: 1px;
        margin-left: -35px;
        margin-right: -45px;
        margin-bottom: 3px;
      }
      &:last-child:after {
        display: none;
      }
    }
  }
}
</style>

<style lang="scss">
.box-item {
  padding: 6px 12px !important;
  background: linear-gradient(90deg, rgb(98, 101, 111), rgb(98, 101, 111)) !important;
  color: #fff;
}

.box-item .el-popper__arrow::before {
  background: linear-gradient(45deg, #626f6f, #626f6f) !important;
  right: 0 !important;
}
</style>
