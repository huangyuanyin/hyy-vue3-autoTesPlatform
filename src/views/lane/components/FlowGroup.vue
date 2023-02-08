<template>
  <div class="flow-group" @mouseenter="isShowIcon = true" @mouseleave="isShowIcon = false">
    <div class="group-head">
      <div class="name">
        <span v-if="!data.isEditor">{{ flow.name }}</span>
        <el-input v-else type="text" v-model="data.value" @input="handleInput"></el-input>
      </div>
      <div class="editor" v-show="isShowIcon">
        <svg-icon @click="handleEditor" v-if="data.isEditor" iconName="icon-danduduihao"></svg-icon>
        <svg-icon @click="handleEditor" v-else iconName="icon-bianji"></svg-icon>
      </div>
      <div class="delete" v-show="isShowIcon">
        <svg-icon @click="openDeleteGroupDialog" iconName="icon-changyonggoupiaorenshanchu"></svg-icon>
      </div>
    </div>
    <div class="stages">
      <Stage v-for="(stage, index) in flow.stages" :stage="stage" :flow="flow" @removeStage="handleRemoveStage(index)" />
      <AddStage :stages="flow.stages" />
    </div>
  </div>
  <DeleteGroupDialog
    :flowName="flowName"
    :show="isShowDeleteGroupDialog"
    @closeDeleteDialog="closeDeleteDialog"
    @submitDelete="submitDelete"
  >
    <span>确定删除【{{ flowName }}】阶段吗？</span>
    <div class="deleteTips">
      <span class="tips">注意：</span>
      <span class="desc">删除后该阶段下的所有任务都将删除!</span>
    </div>
  </DeleteGroupDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Stage from './Stage.vue'
import AddStage from './AddStage.vue'
import DeleteGroupDialog from '@/components/DeleteGroupDialog.vue'

const emit = defineEmits(['removeFlow'])

const props = defineProps({
  flow: {
    type: Object,
    required: true
  }
})

const data = reactive({
  isEditor: false,
  value: props.flow.name
})
const isShowIcon = ref(false)
const isShowDeleteGroupDialog = ref(false)
const flowName = ref('')

const handleRemoveStage = (index: any) => {
  if (props.flow.stages.length === 1) {
    return emit('removeFlow')
  }
  props.flow.stages.splice(index, 1)
}

const handleInput = (e: any) => {
  data.value = e
}

const handleEditor = () => {
  if (data.isEditor) {
    data.isEditor = false
    props.flow.name = data.value
    return
  }
  data.isEditor = true
  data.value = props.flow.name
}

const openDeleteGroupDialog = () => {
  isShowDeleteGroupDialog.value = true
  flowName.value = data.value
}

const closeDeleteDialog = (val: any) => {
  isShowDeleteGroupDialog.value = val
}

const submitDelete = () => {
  isShowDeleteGroupDialog.value = false
  emit('removeFlow')
}
</script>

<style lang="scss" scoped>
.flow-group {
  padding-top: 20px;

  &:hover {
    .stage:nth-last-child(2)::before {
      border-radius: 0;
    }
    .add-stage-container {
      opacity: 1;
      // display: block;
    }
  }
}
.group-head {
  display: flex;
  padding: 0 20px;
  height: 22px;
  margin-bottom: 28px;
  align-items: center;
  .name {
    span {
      color: #8b8b8b;
    }
  }
  .editor {
    margin: 0 10px;
  }
  .editor,
  .delete:hover {
    cursor: pointer;
  }
}

.deleteTips {
  margin-top: 10px;
  color: red;
  .tips {
    font-size: 16px;
    font-weight: 800;
  }
  .desc {
    font-size: 14px;
  }
}
</style>
