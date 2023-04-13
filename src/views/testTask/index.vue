<template>
  <div class="testTask-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="taskTemplateDialogVisible = true"> 新建任务</el-button>
    <el-table :data="taskTableData" border style="width: 100%" stripe v-loading="taskLoading" :height="isHeight">
      <el-table-column prop="name" label="任务名称" width="180" align="center" />
      <el-table-column prop="draft" label="是否草稿" align="center" width="180">
        <template #default="item">
          <el-tag v-if="item.row.draft === false" type="success">否</el-tag>
          <el-tag v-else type="warning">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="任务状态" align="center" width="200">
        <template #default="item">
          <el-tag v-if="item.row.status === 'not_start'" type="warning">未运行</el-tag>
          <el-tag v-if="item.row.status === 'success'" type="success">运行成功</el-tag>
          <el-tag v-if="item.row.status === 'fail'" type="danger">已失败</el-tag>
          <el-tag v-if="item.row.status === 'in_progress'" type="warning">运行中</el-tag>
          <el-tag v-if="item.row.status === 'complete'" type="warning">complete</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最近运行状态" align="center" width="200">
        <template #default="item">
          <div class="pipe-status">
            <ul>
              <el-tooltip popper-class="box-item" effect="customized" :content="`第${item.row.run_count}次运行`" placement="top">
                <li>
                  <span>{{ item.row.run_count }}</span>
                </li>
              </el-tooltip>
              <li>-</li>
              <el-tooltip popper-class="box-item" effect="customized" :content="`${statusMap[item.row.last_result]}`" placement="top">
                <li>
                  <el-icon v-if="item.row.last_result === 'not_start'" style="color: #e6a23c"><InfoFilled /></el-icon>
                  <el-icon v-if="item.row.last_result === 'success'" style="color: #1b9aee"><CircleCheckFilled /></el-icon>
                  <el-icon v-if="item.row.last_result === 'fail'" style="color: #e62412"><CircleCloseFilled /></el-icon>
                </li>
              </el-tooltip>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最近运行阶段" align="center" prop="pipeHistory">
        <template #default="scope">
          <div class="pipe-history">
            <el-tooltip
              v-for="(item, index) in scope.row.run_phase"
              :key="'run_phase' + index"
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
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template #default="item">
          <el-popconfirm
            title="确定执行这个任务流水线?"
            trigger="click"
            confirm-button-text="确认执行"
            cancel-button-text="取消"
            @confirm="handleRunTask(item.row.id)"
          >
            <template #reference>
              <el-button link type="primary" size="small"> 执行 </el-button>
            </template>
          </el-popconfirm>
          <el-button link type="primary" size="small" @click="toDetail('detail', item.row)"> 详情 </el-button>
          <el-button link type="primary" size="small" @click="toDetail('edit', item.row)"> 编辑 </el-button>
          <el-popconfirm
            title="确定删除这个任务?"
            trigger="click"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            @confirm="handleDelete(item.row.id)"
          >
            <template #reference>
              <el-button link type="danger" size="small"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="taskCurrentPage"
      v-model:page-size="taskPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="taskTotal"
      @size-change="handleTaskSizeChange"
      @current-change="handleTaskCurrentChange"
    />

    <!--模板弹窗-->
    <el-dialog v-model="taskTemplateDialogVisible" title="任务模板" width="77%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="模板名称" width="100" align="center" />
        <el-table-column label="模板预览" width="1220" align="center">
          <template #default="scope">
            <el-image style="" :src="scope.row.url" fit="contain" :zoom-rate="1.2" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleAdd('use', scope.$index, scope.row)">使用此模板</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleAdd('noUse')">不使用模板，直接新建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { CirclePlus, CircleCloseFilled, CircleCheckFilled, InfoFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import preview1 from '@/assets/preview1.png'
import preview2 from '@/assets/preview2.png'
import { getTaskInfoApi, deleteTaskInfoApi, runTaskInfoApi } from '@/api/NetDevOps/index'
import { ElMessage } from 'element-plus'

interface User {
  id: string
  name: string
  url: string
  obj: string
}

const router = useRouter()
const taskCurrentPage = ref(1)
const taskPageSize = ref(10)
const taskTotal = ref(0)
const taskLoading = ref(false)
const isHeight = ref('70vh')
const taskTemplateDialogVisible = ref(false)
const taskTableData = ref([])
const statusMap = {
  not_start: '待运行',
  in_progress: '运行中',
  success: '运行成功',
  failed: '运行失败'
}
const tableData = [
  {
    id: '0',
    name: '模板一',
    url: preview1,
    obj: [
      {
        name: '部署',
        stages: [
          [
            {
              id: '10',
              name: 'NetSign环境准备'
            },
            {
              id: '11',
              name: 'NetSign项目部署'
            }
          ]
        ]
      },
      {
        name: '测试',
        stages: [
          [
            {
              id: '20',
              name: '接口测试'
            },
            {
              id: '21',
              name: 'UI测试'
            }
          ]
        ]
      },
      {
        name: '执行命令',
        stages: [
          [
            {
              id: '30',
              name: '执行命令'
            }
          ]
        ]
      },
      {
        name: '版本构建',
        stages: [
          [
            {
              id: '40',
              name: '版本构建'
            }
          ]
        ]
      }
    ]
  },
  {
    id: '1',
    name: '模板二',
    url: preview2,
    obj: [
      {
        name: '部署',
        stages: [
          [
            {
              id: '10',
              name: 'NetSign基线部署'
            },
            {
              id: '11',
              name: 'NetSign项目部署'
            }
          ]
        ]
      },
      {
        name: '测试',
        stages: [
          [
            {
              id: '20',
              name: '接口测试'
            }
          ]
        ]
      },
      {
        name: '版本构建',
        stages: [
          [
            {
              id: '40',
              name: '版本构建'
            }
          ]
        ]
      }
    ]
  }
]

const handleAdd = (type: String, index?: number, row?: User) => {
  taskTemplateDialogVisible.value = false
  if (type === 'noUse') {
    router.push({ path: '/testTask/addTestTask', query: { tem: 'noUse' } })
  } else {
    localStorage.setItem('taskTemplateObj', JSON.stringify(row.obj))
    console.log(index, row)
    router.push({ path: '/testTask/addTestTask', query: { tem: index } })
  }
}

const toDetail = (type, item) => {
  type = type === 'detail' ? 'detail' : undefined
  router.push({ path: '/testTask/addTestTask', query: { id: item.id, type } })
}

const handleRunTask = async id => {
  let res = await runTaskInfoApi({ task_id: id })
  if (res.code === 1000) {
    ElMessage.success('任务执行成功')
    taskCurrentPage.value = 1
    getTaskInfo()
  }
}

const handleDelete = async id => {
  let res = await deleteTaskInfoApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    taskCurrentPage.value = 1
    getTaskInfo()
  }
}

const getTaskInfo = async () => {
  const params = {
    page: taskCurrentPage.value,
    page_size: taskPageSize.value
  }
  taskLoading.value = true
  let res = await getTaskInfoApi(params)
  taskLoading.value = false
  if (res.code === 1000) {
    taskTableData.value = res.data || []
    taskTotal.value = res.total
  }
}

const handleTaskSizeChange = async (val: number) => {
  taskPageSize.value = val
  await getTaskInfo()
}

const handleTaskCurrentChange = async (val: number) => {
  taskCurrentPage.value = val
  await getTaskInfo()
}

onMounted(() => {
  getTaskInfo()
})
</script>

<style lang="scss" scoped>
.testTask-wrap {
  margin: 20px 0 0 20px;
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
  .pipe-status {
    display: flex;
    justify-content: flex-start;
    ul {
      display: flex;
      padding-left: 0px;
      justify-content: center;
      width: 100%;
      li {
        list-style: none;
        margin-right: 8px;
        .el-icon {
          height: 23px;
          line-height: 23px;
        }
      }
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
          // overflow: hidden; //超出的文本隐藏
          // text-overflow: ellipsis; //溢出用省略号显示
          // white-space: nowrap; //溢出不换行
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
          border: 1px solid #1b9aee;
          color: #d8d8d8;
          background: #1b9aee;
        }
        .fail {
          border: 1px solid #f56c6c;
          color: #f56c6c;
          background: #f56c6c;
        }
        .in_progress {
          border: 2px solid #67c23a !important;
          color: #67c23a;
          background: #67c23a;
        }
        .not_start {
          border: 2px solid #d8d8d8 !important;
          color: #d8d8d8;
          background: #fff;
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
        // width: 0;
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
