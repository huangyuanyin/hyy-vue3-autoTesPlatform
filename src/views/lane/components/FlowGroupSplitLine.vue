<template>
  <div class="flow-group-splitline" @mouseenter="isExitHover = true" @mouseleave="isExitHover = false" @click="handleAddStage">
    <el-tooltip class="item" content="添加新的阶段" placement="top" :offset="18">
      <svg-icon v-if="!isExitHover" iconName="icon-jiahao"></svg-icon>
      <svg-icon v-else="isExitHover" iconName="icon-jiahao-copy-copy"></svg-icon>
    </el-tooltip>
  </div>
  <TaskGroupDrawer :drawer="drawer" @changeDrawer="changeDrawer" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TaskGroupDrawer from '@/components/TestTask/TaskGroupDrawer.vue'
import { disposeList } from '../data'

const emit = defineEmits(['add-stage'])
const isExitHover = ref(false)
const drawer = ref(false)

const handleAddStage = () => {
  drawer.value = true
}

const changeDrawer = (value: any) => {
  if (!value) return (drawer.value = value)
  drawer.value = value[0]
  if (!drawer.value) {
    const name = value[1]
    emit('add-stage', {
      name,
      task_stages: [
        {
          task_details: [
            {
              plugin: value[2],
              name: name,
              dispose: disposeList[value[2]]
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
