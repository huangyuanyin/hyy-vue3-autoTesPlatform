<template>
  <div class="flow-group-splitline" @mouseenter="isExitHover = true" @mouseleave="isExitHover = false" @click="handleAddStage">
    <el-tooltip class="item" content="添加新的阶段" placement="top" :offset="18">
      <svg-icon v-if="!isExitHover" iconName="icon-jiahao"></svg-icon>
      <svg-icon v-else iconName="icon-jiahao-copy-copy"></svg-icon>
    </el-tooltip>
  </div>
  <TaskGroupDrawer :drawer="drawer" @changeDrawer="changeDrawer" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import TaskGroupDrawer from '@/components/TestTask/TaskGroupDrawer.vue'
import { disposeList } from '../data'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['add-stage'])
const isExitHover = ref(false)
const drawer = ref(false)
const laneData = ref([]) // 当前流水线的数据

const handleAddStage = () => {
  drawer.value = true
}

watch(
  () => drawer.value,
  val => {
    laneData.value = JSON.parse(localStorage.getItem('flows'))
  }
)

const changeDrawer = (value: any) => {
  const disposeList2 = JSON.parse(JSON.stringify(disposeList))
  if (!value) return (drawer.value = value)
  if (laneData.value.length === 0 && value[1] === 'NetSign项目部署') {
    ElMessage.warning('NetSign项目部署阶段需在NetSign环境准备阶段之后')
    return false
  }
  drawer.value = value[0]
  if (!drawer.value) {
    let name = ''
    if (value[1].indexOf('环境准备') !== -1) {
      name = '环境准备'
    }
    if (value[1].indexOf('项目部署') !== -1) {
      name = '项目部署'
    }
    if (value[1].indexOf('测试') !== -1) {
      name = '测试'
    }
    emit('add-stage', {
      name,
      task_stages: [
        {
          task_details: [
            {
              plugin: value[2],
              name: value[1],
              dispose: disposeList2[value[2]],
              is_pass: ['netSignPrepare', 'netSignArrange', 'interfaceTest'].includes(value[2]) ? false : true
            }
          ]
        }
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
.flow-group-splitline {
  position: relative;
  width: 48px;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    height: 100%;
    border-left: 1px solid #dbdbdb;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 48px;
    border-top: 1px solid #dbdbdb;
    margin-left: -24px;
    top: 105px;
  }

  > svg {
    position: absolute;
    left: 50%;
    width: 20px;
    top: 96px;
    margin-left: -10px;
    z-index: 2;
    cursor: pointer;
    color: #595959;
  }
}
</style>
