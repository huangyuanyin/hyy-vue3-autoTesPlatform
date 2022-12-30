<template>
  <el-dialog :model-value="isShowDialog" title="打标记" @close="closeDialog">
    <el-form :model="markData" ref="addMarkRuleFormRef" :rules="addMarkFormRules">
      <el-form-item label="标记名称" label-width="200" prop="name">
        <el-input v-model="markData.name" placeholder="请输入标记名称..." />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitDialog(addMarkRuleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, toRefs } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps({
  isShowDialog: {
    type: Boolean,
    default: () => false
  },
  markData: {
    type: Object,
    default: () => Object
  }
})

const { isShowDialog } = toRefs(props)
const emits = defineEmits(['closeMarkDialog'])
const markData = ref({ name: '' })
const addMarkRuleFormRef = ref<FormInstance>()
const addMarkFormRules = reactive<FormRules>({
  name: [{ required: true, message: '标记名称不能为空', trigger: 'blur' }]
})

const closeDialog = () => {
  emits('closeMarkDialog', false)
}

const submitDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      markData.value.name = ''
      closeDialog()
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped></style>
