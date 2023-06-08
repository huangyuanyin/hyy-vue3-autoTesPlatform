<template>
  <div class="flow-groups-container">
    <div class="flow-groups">
      <template v-for="(flow, index) in flows">
        <FlowGroupSplitLine @add-stage="(val:any) => handleAddStage(val, index)" />
        <FlowGroup :flow="flow" @removeFlow="() => handleRemoveFlow(flow, index)" />
      </template>
      <FlowGroupSplitLine @add-stage="(val:any) => handleAddStage(val, flows.length)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import FlowGroupSplitLine from './components/FlowGroupSplitLine.vue'
import FlowGroup from './components/FlowGroup.vue'
import { onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  flows: {
    type: Array,
    required: true
  }
})

const handleAddStage = (val: any, index: any) => {
  props.flows.splice(index, 0, val)
}

function hasNetSignArrangeAfterIndex(obj, index) {
  for (let i = index + 1; i < obj.length; i++) {
    const taskStages = obj[i].task_stages
    if (
      taskStages &&
      taskStages.some(stage => {
        const taskDetails = stage.task_details
        return taskDetails && taskDetails.some(detail => detail.plugin === 'netSignArrange')
      })
    ) {
      return true
    }
  }
  return false
}

const handleRemoveFlow = (val: any, id: any) => {
  let hasNetSignArrange
  if (val.name === '环境准备') {
    hasNetSignArrange = hasNetSignArrangeAfterIndex(JSON.parse(localStorage.getItem('flows')), id)
  }

  if (hasNetSignArrange) {
    ElMessage.error('环境部署必须在环境准备之后，请先删除环境部署任务！')
    return
  } else {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    props.flows.splice(id, 1)
  }
}

watch(
  () => props.flows,
  val => {
    localStorage.setItem('flows', JSON.stringify(props.flows))
  },
  { deep: true }
)

onMounted(() => {
  localStorage.setItem('flows', JSON.stringify(props.flows))
})

onUnmounted(() => {
  localStorage.removeItem('flows')
})
</script>

<style lang="scss" scoped>
.flow-groups-container {
  width: 100%;
  height: 77vh;
  overflow-y: auto;
  background-color: #f2f5f7;
}
.flow-groups-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.flow-groups-container::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
  display: none;
}
*::-webkit-scrollbar-corner {
  background-color: transparent;
}
.flow-groups-container::-webkit-scrollbar-thumb {
  border: 4px solid rgba(0, 0, 0, 0);
  height: 0px;
  border-radius: 25px;
  background-clip: padding-box;
  background-color: rgba(0, 0, 0, 0.3);
}
.flow-groups {
  display: flex;
  height: 100%;
}
</style>
