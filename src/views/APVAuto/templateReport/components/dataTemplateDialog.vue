<template>
  <el-dialog :model-value="isShowDialog" title="模板参数" @close="closeDialog">
    <el-form :model="dialogData">
      <el-form-item label="任务ID" :label-width="formLabelWidth">
        <el-input v-model="dialogData.id" disabled />
      </el-form-item>
      <el-form-item label="测试时间" :label-width="formLabelWidth">
        <el-input v-model="dialogData.time" disabled />
      </el-form-item>
      <el-form-item label="测试结果状态" :label-width="formLabelWidth">
        <el-input v-model="dialogData.status" disabled />
      </el-form-item>
      <el-form-item label="设备型号" :label-width="formLabelWidth">
        <el-input v-model="dialogData.apv_model" disabled />
      </el-form-item>
      <el-form-item label="版本" :label-width="formLabelWidth">
        <el-input v-model="dialogData.build" disabled />
      </el-form-item>
      <el-form-item label="ipversion" :label-width="formLabelWidth">
        <el-input v-model="dialogData.ipversion" disabled />
      </el-form-item>
      <el-form-item label="选择导出参数" :label-width="formLabelWidth">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"> 导出全部参数 </el-checkbox>
        <el-checkbox-group v-model="checkedQuery" @change="handleCheckedQuerysChange">
          <el-checkbox v-for="item in checkedList" :key="item" :label="item">
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="closeDialog">生成模板</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
export default defineComponent({
  emits: ['closeDialog'],
  props: {
    isShowDialog: {
      type: Boolean,
      default: () => false
    },
    dialogData: {
      type: Object,
      default: () => Object
    }
  },
  setup(props, { emit }) {
    const checkAll = ref(false)
    const isIndeterminate = ref(true)
    const checkedQuery = ref(['cc', 'cps'])
    const checkedList = [
      'cc',
      'cps',
      'cpu',
      'dut_cc',
      'dut_cps',
      'dut_rps',
      'response',
      'ssl_ae',
      'ssl_se',
      'throughput',
      'tps',
      'unsuccessful'
    ]
    const formLabelWidth = '140px'
    const handleCheckAllChange = (val: boolean) => {
      checkedQuery.value = val ? checkedList : []
      isIndeterminate.value = false
    }
    const handleCheckedQuerysChange = (value: string[]) => {
      const checkedCount = value.length
      checkAll.value = checkedCount === checkedList.length
      isIndeterminate.value = checkedCount > 0 && checkedCount < checkedList.length
    }
    const closeDialog = () => {
      emit('closeDialog', false)
    }
    return {
      checkAll,
      isIndeterminate,
      checkedQuery,
      checkedList,
      formLabelWidth,
      closeDialog,
      handleCheckAllChange,
      handleCheckedQuerysChange
    }
  }
})
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex: 50%;
  flex-flow: wrap;

  :deep(.el-form-item__content) {
    min-width: 275px;
  }
}
</style>
