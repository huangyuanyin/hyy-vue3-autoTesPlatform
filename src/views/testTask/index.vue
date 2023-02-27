<template>
  <div class="testTask-wrap">
    <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="addTask"> 新建任务</el-button>
    <el-table :data="taskTableData" border style="width: 100%" stripe>
      <el-table-column prop="name" label="任务名称" width="180" />
      <el-table-column prop="type" label="产品型号" />
      <el-table-column prop="password" label="任务状态" />
      <el-table-column label="最近运行状态" align="center">
        <template #default="item">
          <div class="pipe-status">
            <ul>
              <el-tooltip popper-class="box-item" effect="customized" content="第二次运行" placement="top">
                <li><span>#2</span></li>
              </el-tooltip>
              <li>-</li>
              <el-tooltip popper-class="box-item" effect="customized" content="运行失败" placement="top">
                <li>
                  <el-icon><CircleCloseFilled /></el-icon>
                </li>
              </el-tooltip>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最近运行阶段" align="center" prop="pipeHistory" width="300">
        <template #default="item">
          <div class="pipe-history">
            <el-tooltip popper-class="box-item" effect="customized" content="构建：运行中" placement="top">
              <div class="group-status">
                <div class="content">
                  <div class="title">构建</div>
                  <div class="point active"></div>
                </div>
              </div>
            </el-tooltip>
            <el-tooltip popper-class="box-item" effect="customized" content="部署：未运行" placement="top">
              <div class="group-status">
                <div class="content">
                  <div class="title">部署</div>
                  <div class="point init"></div>
                </div>
              </div>
            </el-tooltip>
            <el-tooltip popper-class="box-item" effect="customized" content="活动校验：未运行" placement="top">
              <div class="group-status">
                <div class="content">
                  <div class="title" style="font-size: 12px">活动校验</div>
                  <div class="point init"></div>
                </div>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template #default="item">
          <el-button link type="primary" size="small" @click="toDetail(item.row)"> 详情 </el-button>
          <el-button link type="primary" size="small"> 编辑 </el-button>
          <el-button link type="danger" size="small" :disabled="item.row.disabledDelete"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--模板弹窗-->
    <el-dialog v-model="taskTemplateDialogVisible" title="任务模板" width="77%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="模板名称" width="100" align="center" />
        <el-table-column label="模板预览" width="1220" align="center">
          <template #default="scope">
            <el-image style="" :src="scope.row.url" fit="contain" :zoom-rate="1.2" :preview-src-list="[scope.row.url]" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUse(scope.$index, scope.row)">使用此模板</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="noUseTemplate">不使用模板，直接新建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { CirclePlus, CircleCloseFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getAssetsFile } from '@/utils/util.js'

interface User {
  id: string
  name: string
  url: string
  obj: string
}

const router = useRouter()
const taskTemplateDialogVisible = ref(false)
const taskTableData = reactive([
  {
    name: '任务1',
    id: '222',
    date: '333',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  },
  {
    date: '333',
    id: '222',
    name: '任务2',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  },
  {
    date: '333',
    id: '222',
    name: '任务3',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  },
  {
    date: '333',
    id: '222',
    name: '任务4',
    type: '自动化平台使用',
    username: 'admin',
    password: '运行中'
  }
])
const tableData = [
  {
    id: '0',
    name: '模板一',
    url: getAssetsFile('/preview1.png'),
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
    url: getAssetsFile('/preview2.png'),
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

const addTask = () => {
  taskTemplateDialogVisible.value = true
}

const noUseTemplate = () => {
  taskTemplateDialogVisible.value = false
  router.push({ path: '/testTask/addTestTask' })
}

const handleUse = (index: number, row: User) => {
  router.push({ path: '/testTask/addTestTask', query: { id: index } })
  console.log(index, row)
  localStorage.setItem('taskTemplateObj', JSON.stringify(row.obj))
}

const toDetail = item => {
  router.push({ path: '/testTask/addTestTask', query: { id: item.id } })
}
</script>

<style lang="scss" scoped>
.testTask-wrap {
  margin: 20px 0 0 20px;
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
          color: #e62412;
        }
      }
    }
  }
  .pipe-history {
    display: flex;
    justify-content: center;
    .group-status {
      width: 80px;
      display: flex;
      position: relative;
      text-align: center;
      -webkit-box-pack: center;
      -webkit-box-align: end;
      align-items: flex-end;
      margin-bottom: 5px;
      .content {
        width: 55px;
        max-width: 55px;
        white-space: nowrap;
        overflow: hidden;
        .title {
          color: #383838;
          margin-bottom: 10px;
        }
        .point {
          display: block;
          width: 8px;
          height: 8px;
          // border: 1px solid #1b9aee;
          border-radius: 100%;
          text-align: center;
          margin: 0 auto;
          // color: #d8d8d8;
          // background: #1b9aee;
        }
        .active {
          border: 1px solid #1b9aee;
          color: #d8d8d8;
          background: #1b9aee;
        }
        .init {
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
        margin-left: -20px;
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
