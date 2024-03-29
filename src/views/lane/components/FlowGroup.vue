<template>
  <div
    class="flow-group"
    @mouseenter="route.path === '/testTask/lookTestTaskConfig' ? '' : (isShowIcon = true)"
    @mouseleave="isShowIcon = false"
  >
    <div class="group-head">
      <div class="name">
        <span @dblclick="handleEditor" v-if="!data.isEditor">{{ props.flow.name }}</span>
        <el-input v-else type="text" v-model="props.flow.name"></el-input>
      </div>
      <div class="editor" v-show="isShowIcon">
        <svg-icon @click="handleEditor" v-if="data.isEditor" iconName="icon-danduduihao"></svg-icon>
        <svg-icon @click="handleEditor" v-else iconName="icon-bianji"></svg-icon>
      </div>
      <div class="delete" v-show="isShowIcon">
        <svg-icon class="grayDelete" @click="openDeleteGroupDialog" iconName="icon-changyonggoupiaorenshanchu"></svg-icon>
        <svg-icon class="redDelete" @click="openDeleteGroupDialog" iconName="icon-changyonggoupiaorenshanchu-copy"></svg-icon>
      </div>
    </div>
    <div class="stages">
      <Stage v-for="(stage, index) in flow.task_stages" :stage="stage.task_details" :flow="flow" @removeStage="handleRemoveStage(index)" />
      <AddStage :stages="flow.task_stages" />
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
      <span class="desc">删除后该阶段下的所有节点都将删除!</span>
    </div>
  </DeleteGroupDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import Stage from './Stage.vue'
import AddStage from './AddStage.vue'
import DeleteGroupDialog from '@/components/TestTask/DeleteGroupDialog.vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

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

const route = useRoute()
const isShowIcon = ref(false)
const isShowDeleteGroupDialog = ref(false)
const flowName = ref('')

const handleRemoveStage = (index: any) => {
  if (props.flow.task_stages.length === 1) {
    return emit('removeFlow')
  }
  props.flow.task_stages.splice(index, 1)
}

const handleEditor = () => {
  if (data.isEditor) {
    data.isEditor = false
    return
  }
  data.isEditor = true
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
    :deep(.el-input__wrapper) {
      max-width: 100px;
      box-shadow: 0 0 0 0px #dcdfe6 inset;
    }
  }
  .editor {
    margin: 0 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .delete {
    margin-left: 10px;
    display: inline-block;
    .grayDelete {
      display: inline-block;
    }
    .redDelete {
      display: none;
    }
    &:hover {
      cursor: pointer;
      .grayDelete {
        display: none;
      }
      .redDelete {
        display: inline-block;
      }
    }
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
