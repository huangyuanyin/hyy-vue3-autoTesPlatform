<template>
  <div class="add-stage-container">
    <div class="add-stage" @mouseenter="isExitHover = true" @mouseleave="isExitHover = false" @click="handleAddParaller">
      <svg-icon v-if="!isExitHover" iconName="icon-jiahao"></svg-icon>
      <svg-icon v-else="isExitHover" iconName="icon-jiahao-copy-copy"></svg-icon>
      并行任务
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  stages: {
    type: Array,
    required: true
  }
})

const isExitHover = ref(false)

const handleAddParaller = () => {
  props.stages.push([
    {
      name: '新并行'
    }
  ])
}
</script>

<style lang="scss" scoped>
.add-stage-container {
  position: relative;
  height: 60px;
  opacity: 0;
  font-size: 14px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -50%;
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    width: 100%;
    height: 100%;
    border-radius: 0 0 16px 16px;
  }
}
.add-stage-container:hover {
  &::before {
    border-left: 1px solid #1b9aee;
    border-right: 1px solid #1b9aee;
    border-bottom: 1px solid #1b9aee;
  }
  .add-stage {
    border: 1px solid #1b9aee;
  }
}
.add-stage {
  position: absolute;
  left: 94px;
  top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 40px;
  padding: 0 12px;
  color: #292929;
  border-radius: 20px;
  background-color: #f2f5f7;
  border: 1px solid #beb8bf;
  z-index: 2;
  cursor: pointer;
  box-shadow: 0 2px 4px 0 rgb(38 38 38 / 10%);
  svg {
    margin-right: 5px;
  }
}
</style>
