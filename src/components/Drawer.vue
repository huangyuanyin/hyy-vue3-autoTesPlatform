<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="isDrawer" :direction="direction" :append-to-body="false" :z-index="10 ** 10000" :with-header="false" size="60%">
      <el-row>
        <el-col :span="5">
          <el-menu default-active="prodandserver" @select="handleSelect">
            <el-menu-item index="prodandserver">
              <el-icon>
                <Grid />
              </el-icon>
              <template #title>
                产品与服务
                <el-icon class="icon-margin">
                  <ArrowRight />
                </el-icon>
              </template>
            </el-menu-item>
            <el-menu-item index="netpts">
              <el-icon>
                <Monitor />
              </el-icon>
              <template #title>性能压测</template>
            </el-menu-item>
            <el-menu-item index="apitest">
              <el-icon>
                <Suitcase />
              </el-icon>
              <template #title>接口测试</template>
            </el-menu-item>
            <el-menu-item index="Agile">
              <el-icon>
                <Position />
              </el-icon>
              <template #title>敏捷测试</template>
            </el-menu-item>
            <el-menu-item index="netforum">
              <el-icon>
                <Notebook />
              </el-icon>
              <template #title>信安知识库</template>
            </el-menu-item>
            <el-menu-item index="netcmt">
              <el-icon>
                <Platform />
              </el-icon>
              <template #title>信安云网管</template>
            </el-menu-item>
            <el-menu-item index="netapv">
              <el-icon><TrendCharts /></el-icon>
              <template #title>APV自动化</template>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="19">
          <el-card body-style="{ padding: '60px' }">
            <template #header>
              <el-input v-model="filter" style="width: 80%" placeholder="请输入服务名称"></el-input>
              <el-icon class="closeStyle" @click="handleClose">
                <Close />
              </el-icon>
            </template>
            <el-row class="row">
              <el-col :span="8">
                <span class="span-title">测试开发服务</span>
                <div class="button" v-for="(item, index) in testData" :key="index">
                  <el-button style="margin-top: 5px" text @click="goTo(item.value)">{{ item.label }}</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <span class="span-title">监控与运维</span>
                <div class="button" v-for="(item, index) in monitorData" :key="index">
                  <el-button style="margin-top: 5px" text @click="goTo(item.value)">{{ item.label }}</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <span class="span-title">数据服务</span>
                <div class="button" v-for="(item, index) in dataServices" :key="index">
                  <el-button style="margin-top: 5px" text @click="goTo(item.value)">{{ item.label }}</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8">
                <span class="span-title">安全服务</span>
                <div class="button" v-for="(item, index) in securityData" :key="index">
                  <el-button style="margin-top: 5px" text @click="goTo(item.value)">{{ item.label }}</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <span class="span-title">测试工具</span>
                <div class="button" v-for="(item, index) in toolData" :key="index">
                  <el-button style="margin-top: 5px" text @click="goTo(item.value)">{{ item.label }}</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <span class="span-title">容器与虚拟机服务</span>
                <div class="button" v-for="(item, index) in containerData" :key="index">
                  <el-button style="margin-top: 5px" text @click="goTo(item.value)">{{ item.label }}</el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, Monitor, ArrowRight, Close, Suitcase, Platform, Notebook, Position, TrendCharts } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// import { useAppStore } from "@/store/modules/app";

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['changeDrawer'])

const router = useRouter()
// const store = useAppStore();
const filter = ref('') // 搜索
const height = window.innerHeight - 52 + 'px' // 高度
// 测试模块
const testData = ref([
  {
    value: 'netpts',
    label: '性能测试'
  },
  {
    value: 'apitest',
    label: '接口测试'
  },
  {
    value: 'Agile',
    label: '敏捷测试'
  },
  {
    value: 'netapv',
    label: 'APV自动化'
  },
  {
    value: 'netpoc',
    label: 'POC自动化'
  }
])
// 监控与运维服务
const monitorData = ref([
  {
    value: 'netcmt',
    label: '信安云网管'
  },
  {
    value: 'netmonitor',
    label: '监控服务'
  },
  {
    value: 'netcfg',
    label: '混沌演练平台'
  }
])
const dataServices = ref([
  {
    value: 'netforum',
    label: '信安知识库'
  },
  {
    value: 'netevaluate',
    label: '度量分析'
  }
])
// 容器与虚拟机服务
const containerData = ref([
  {
    value: 'container',
    label: '容器镜像服务'
  },
  {
    value: 'container',
    label: '容器服务'
  },
  {
    value: 'vm',
    label: '虚拟机服务'
  }
])
// 安全服务
const securityData = ref([
  {
    value: 'netpt',
    label: '渗透测试服务'
  },
  {
    value: 'netvs',
    label: '漏洞扫描'
  },
  {
    value: 'netdos',
    label: 'DDos高防'
  }
])
// 测试工具
const toolData = ref([
  {
    value: 'cert',
    label: '证书服务'
  }
])
// 跳转
const goTo = value => {
  ElMessage({
    type: 'warning',
    message: '暂不支持！！！'
  })
}
// 侧边栏响应
const handleSelect = value => {
  let url = ''
  let console_url = sessionStorage.getItem('CONSOLE_URL')
  localStorage.setItem('token', sessionStorage.getItem('token'))
  url = console_url + '/' + value
  window.location.href = url
}
const direction = ref('ltr')
const isDrawer = computed({
  get() {
    return props.drawer
  },
  set(value) {
    emit('changeDrawer', value)
    return value
  }
})

const handleClose = () => {
  isDrawer.value = false
}
</script>

<style lang="scss" scoped>
.drawer-wrapper {
  :deep(.el-drawer__header) {
    margin-bottom: 0px;
    padding: 0px;
    display: flex !important;
    align-items: center;
  }
  :deep(.el-menu) {
    height: 100vh;
  }
  :deep(.el-card) {
    border: none;
    height: 99vh;
  }
  .icon-margin {
    margin-left: 20px;
  }

  :deep(.el-card__header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-drawer__body) {
    padding: 0px;
  }

  :deep(.el-overlay) {
    top: 50px;
  }

  .row {
    margin-top: 15px;
  }

  .span-title {
    font-weight: 800;
    font-family: '宋体';
  }

  .button {
    margin-top: 5px;
  }

  .closeStyle {
    float: right;
  }

  .closeStyle:hover {
    cursor: pointer;
  }
}
</style>
