<template>
  <div>
    <el-drawer v-model="ishowDrawer" direction="rtl" custom-class="group-drawer" @close="closeDrawer" size="35%">
      <template #header>
        <span class="select_group">选择任务组</span>
      </template>
      <template #default>
        <el-input v-model="input" class="w-50 m-2" placeholder="请输入任务名称" :prefix-icon="Search" />
        <el-tabs tab-position="left" style="height: calc(100vh - 185px); margin-top: 20px" class="group-tabs">
          <el-tab-pane label="部署">
            <span class="group-name">部署</span>
            <div class="group-name-list">
              <el-card
                class="group-name-item"
                shadow="hover"
                @click="addStage(item)"
                v-for="(item, index) in deployList"
                :key="'deployList' + index"
              >
                <div class="group-name-item-detail">
                  <div>
                    <img src="https://img.alicdn.com/tfs/TB1JRQ_wKH2gK0jSZJnXXaT1FXa-88-88.png" alt="" />
                  </div>
                  <div class="group-name-item-detail-right">
                    <span class="detail-name">{{ item.name }}</span>
                    <p>{{ item.desc }}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="测试">
            <span class="group-name">测试</span>
            <div class="group-name-list">
              <el-card
                class="group-name-item"
                shadow="hover"
                @click="addStage(item)"
                v-for="(item, index) in testList"
                :key="'testList' + index"
              >
                <div class="group-name-item-detail">
                  <img src="https://img.alicdn.com/tfs/TB17eM4wFT7gK0jSZFpXXaTkpXa-88-88.png" alt="" />
                  <div class="group-name-item-detail-right">
                    <span class="detail-name">{{ item.name }}</span>
                    <p>{{ item.desc }}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="执行命令">
            <span class="group-name">执行命令</span>
            <div class="group-name-list">
              <el-card
                class="group-name-item"
                shadow="hover"
                @click="addStage(item)"
                v-for="(item, index) in orderList"
                :key="'orderList' + index"
              >
                <div class="group-name-item-detail">
                  <img src="https://img.alicdn.com/tfs/TB17eM4wFT7gK0jSZFpXXaTkpXa-88-88.png" alt="" />
                  <div class="group-name-item-detail-right">
                    <span class="detail-name">{{ item.name }}</span>
                    <p>{{ item.desc }}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="版本构建">
            <span class="group-name">版本构建</span>
            <div class="group-name-list">
              <el-card
                class="group-name-item"
                shadow="hover"
                @click="addStage(item)"
                v-for="(item, index) in buildList"
                :key="'orderList' + index"
              >
                <div class="group-name-item-detail">
                  <img src="https://img.alicdn.com/tfs/TB17eM4wFT7gK0jSZFpXXaTkpXa-88-88.png" alt="" />
                  <div class="group-name-item-detail-right">
                    <span class="detail-name">{{ item.name }}</span>
                    <p>{{ item.desc }}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="代码扫描" :disabled="true">
            <span class="group-name">代码扫描</span>
            <div class="group-name-list">
              <el-card class="group-name-item" shadow="hover" @click="addStage(data)">
                <div class="group-name-item-detail">
                  <img src="https://img.alicdn.com/tfs/TB17eM4wFT7gK0jSZFpXXaTkpXa-88-88.png" alt="" />
                  <div class="group-name-item-detail-right">
                    <span class="detail-name">{{ data.name }}</span>
                    <p>{{ data.desc }}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="构建" :disabled="true">构建</el-tab-pane>
          <el-tab-pane label="测试构建" :disabled="true">测试构建</el-tab-pane>
          <el-tab-pane label="镜像构建" :disabled="true">镜像构建</el-tab-pane>
          <el-tab-pane label="工具" :disabled="true">工具</el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  drawer: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['changeDrawer'])
const ishowDrawer = ref(false)
const input = ref('')
const data = reactive({
  name: '代码扫描',
  desc: '这是一段代码扫描代码扫描'
})
const testList = ref([
  {
    plugin: 'interfaceTest',
    name: 'NetSign接口测试',
    desc: '这是一段NetSign接口测试'
  },
  {
    plugin: 'netsignUITest',
    name: 'NetSign UI测试',
    desc: '这是一段NetSign UI测试'
  }
])
const deployList = ref([
  {
    plugin: 'netSignPrepare',
    name: 'NetSign环境准备',
    desc: '这是一段NetSign环境准备'
  },
  {
    plugin: 'netSignArrange',
    name: 'NetSign项目部署',
    desc: '这是一段NetSign项目部署'
  },
  {
    plugin: 'dockerDeployment',
    name: 'Docker部署',
    desc: '这是一段Docker部署'
  }
])
const orderList = ref([
  {
    plugin: 'executeCommand',
    name: '执行命令',
    desc: '用于执行命令'
  }
])
const buildList = ref([
  {
    plugin: 'versionBuild',
    name: '版本构建',
    desc: '用于版本构建'
  }
])

watch(
  () => props.drawer,
  () => {
    ishowDrawer.value = props.drawer
  }
)

const addStage = (value: any) => {
  const { name, plugin } = value
  emit('changeDrawer', [false, name, plugin])
}

const closeDrawer = () => {
  emit('changeDrawer', false)
}
</script>

<style lang="scss" scoped>
.group-drawer {
  .el-drawer__header {
    font-size: 14px;
    border-bottom: 1px solid #dbdbdb !important;
    padding: 0px;
    padding-left: 32px;
    height: 60px;
    margin-bottom: 0px;
  }
  .select_group {
    font-weight: 700;
  }
  .group-name {
    display: block;
    color: #8b8b8b;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .group-name-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .group-name-item {
      width: 48%;
      height: 80px;
      margin-bottom: 10px;
      .group-name-item-detail {
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: flex-start;
        padding: 0 20px;
        img {
          height: 42px;
          width: 42px;
          border-radius: 4px;
          box-shadow: 0 2px 8px 0 rgb(56 56 56 / 6%);
          background: #fff;
          margin-right: 12px;
        }
        .group-name-item-detail-right {
          max-width: 75%;
          .detail-name {
            display: block;
            font-size: 14px;
            color: #292929;
            font-weight: 500;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
          }
          p {
            font-size: 12px;
            color: #8b8b8b;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
          }
        }
      }
      :deep(.el-card__body) {
        height: 100%;
        padding: 0px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
