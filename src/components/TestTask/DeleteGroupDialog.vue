<template>
  <el-dialog v-model="dialogVisible" title="删除提示框" width="30%" @close="closeDeleteDialog">
    <slot></slot>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDeleteDialog">取消</el-button>
        <el-button type="primary" @click="submitDelete"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const props = defineProps({
  show: {
    type: Boolean,
    default: () => false
  },
  flowName: {
    type: String,
    default: () => ''
  }
})
const emit = defineEmits(['closeDeleteDialog', 'submitDelete'])

const dialogVisible = ref(false)

watch(
  () => props.show,
  () => {
    dialogVisible.value = props.show
  }
)

const closeDeleteDialog = () => {
  emit('closeDeleteDialog', false)
}
const submitDelete = () => {
  emit('submitDelete')
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
