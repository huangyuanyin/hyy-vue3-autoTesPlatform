<template>
  <div>
    <el-popover placement="bottom" :width="auto" trigger="click">
      <template #reference>
        <div class="config" @click.stop="handleConfigDetail">
          <el-icon><Cellphone /></el-icon><span>配置</span>
        </div>
      </template>
      <el-card class="box-card" shadow="never">
        <el-descriptions class="showServerConfig" title="设备信息：" :column="3" :size="size" border>
          <el-descriptions-item v-for="(it, index) in showServerConfig" :key="'serverConfigList' + index">
            <template #label>
              <div class="cell-item">{{ it.label }}</div>
            </template>
            {{ it.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          class="margin-top"
          title="其他配置："
          :column="1"
          :size="size"
          :style="blockMargin"
          v-if="disposeType === 'netSignPrepare'"
        >
          <el-descriptions-item :label="it.label" v-for="(it, index) in environmentPrepareConfig" :key="'environmentPrepareConfig' + index">
            {{ it.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          class="margin-top"
          title="其他配置："
          :column="1"
          :size="size"
          :style="blockMargin"
          v-if="disposeType === 'netSignArrange'"
        >
          <el-descriptions-item :label="it.label" v-for="(it, index) in netSignArrangeConfig" :key="'netSignArrangeConfig' + index">
            {{ it.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          class="interfaceTest—config"
          title="其他配置："
          :column="1"
          :size="size"
          :style="blockMargin"
          v-if="disposeType === 'interfaceTest'"
        >
          <el-descriptions-item :label="'jar包 ' + (index + 1) + '：'" v-for="(it, index) in jarListConfig" :key="'jarListConfig' + index">
            {{ it.name }}
          </el-descriptions-item>
          <el-descriptions-item :label="it.label" v-for="(it, index) in interfaceTestConfig" :key="'interfaceTestConfig' + index">
            {{ it.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          class="dockerDeployment—config"
          title="Docker文件："
          :column="1"
          :size="size"
          :style="blockMargin"
          v-if="disposeType === 'dockerDeployment'"
        >
          <!-- <el-descriptions-item label=""> </el-descriptions-item> -->
        </el-descriptions>
        <el-table :data="dockerFileList" style="width: 50vw" stripe>
          <el-table-column prop="file_name" label="文件名" width="200" />
          <el-table-column prop="file_path" label="存放路径" min-width="300" />
        </el-table>
        <el-descriptions
          class="dockerDeployment—config"
          title="其他配置："
          :column="1"
          :size="size"
          :style="blockMargin"
          v-if="disposeType === 'dockerDeployment'"
        >
          <el-descriptions-item :label="it.label" v-for="(it, index) in dockerDeploymentConfig" :key="'dockerDeploymentConfig' + index">
            {{ it.value }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Cellphone } from '@element-plus/icons-vue'
import { getTaskDetailHistorytApi } from '@/api/NetDevOps'
import { auto } from '@popperjs/core'

const showServerConfig = ref([])
const dispose: any = ref([])
const environmentPrepareConfig = ref([])
const netSignArrangeConfig = ref([])
const interfaceTestConfig = ref([])
const jarListConfig = ref([])
const dockerDeploymentConfig = ref([])
const disposeType = ref('')
const isShow = ref(false)
const size = ref('')
const dockerFileList = ref([])
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px'
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default
  }
})

const props = defineProps({
  id: {
    type: Number,
    default: () => null
  }
})

const handleConfigDetail = async () => {
  let res = await getTaskDetailHistorytApi({ task_detail_history_id: props.id })
  if (res.code === 1000) {
    isShow.value = true
    dispose.value = JSON.parse(res.data.dispose)[0]
    showServerConfig.value = JSON.parse(res.data.dispose)[0].showServerConfig
    disposeType.value = res.data.plugin
    switch (disposeType.value) {
      case 'netSignPrepare':
        environmentPrepareConfig.value = [
          {
            label: '部署类型：',
            value: dispose.value.deployType === 'full' ? '全量基线' : '项目基线'
          },
          {
            label: '基线版本：',
            value: dispose.value.deployType === 'full' ? dispose.value.deployVersion : dispose.value.packageName
          }
        ]
        break
      case 'netSignArrange':
        netSignArrangeConfig.value = [
          {
            label: '项目包：',
            value: dispose.value.packageName
          }
        ]
        break
      case 'interfaceTest':
        interfaceTestConfig.value = [
          {
            label: '版本列表：',
            value: dispose.value.pendingVersion
          },
          {
            label: '适用版本：',
            value: dispose.value.netsignVersion
          },
          {
            label: '代码分支：',
            value: dispose.value.branch
          }
        ]
        jarListConfig.value = dispose.value.jarList
        break
      case 'dockerDeployment':
        dockerDeploymentConfig.value = [
          // {
          //   label: 'docker文件：',
          //   value: dispose.value.file_name
          // },
          {
            label: 'shell脚本：',
            value: dispose.value.shell
          }
        ]
        dockerFileList.value = dispose.value.fileList
        break
      default:
        break
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  width: auto;
  .el-card__header {
    padding: 9px 14px;
  }
  .el-card__body {
    padding: 0px 15px;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 45%;
        span {
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 130px;
          overflow: hidden;
          color: #67c23a;
        }
      }
      .detail {
        width: max-content;
      }
    }
  }
}

.config-card {
  width: 520px;
  .el-card__header {
    padding: 9px 14px;
  }
  .el-card__body {
    padding: 0px 15px;
    ul {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      li {
        width: 45%;
        span {
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 130px;
          overflow: hidden;
          color: #67c23a;
        }
      }
    }
  }
}

.config {
  display: flex;
  align-items: center;
  .el-icon {
    margin-right: 5px;
    color: #8b8b8b;
  }
  span {
    color: #8b8b8b;
    font-size: 12px;
  }
}

.interfaceTest—config {
  :deep(.el-descriptions__label) {
    // width: 75px !important;
    display: inline-block;
  }
}
</style>
