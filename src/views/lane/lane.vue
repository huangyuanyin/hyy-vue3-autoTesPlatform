<template>
  <div class="flow-groups-container">
    <div class="flow-groups">
      <template v-for="(flow, index) in flows">
        <FlowGroupSplitLine @add-stage="(val:any) => handleAddStage(val, index)" />
        <FlowGroup :flow="flow" @removeFlow="() => handleRemoveFlow(index)" />
      </template>
      <FlowGroupSplitLine @add-stage="(val:any) => handleAddStage(val, flows.length)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import FlowGroupSplitLine from './components/FlowGroupSplitLine.vue'
import FlowGroup from './components/FlowGroup.vue'

const props = defineProps({
  flows: {
    type: Array,
    required: true
  }
})

const handleAddStage = (val: any, index: any) => {
  props.flows.splice(index, 0, val)
}

const handleRemoveFlow = (index: any) => {
  props.flows.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.flow-groups-container {
  width: 100vw;
  height: calc(100vh - 73px);
  overflow-y: auto;
  background-color: #f2f5f7;
}
.flow-groups {
  display: flex;
  height: 100%;
}
</style>
