<template>
  <el-dialog v-model="dialogFormVisible" title="拉取包">
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item label="拉取地址" label-width="140px" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入包的拉取地址" />
      </el-form-item>
      <el-form-item label="包类别" label-width="140px" prop="region">
        <el-select v-model="form.region" placeholder="请选择包类别">
          <el-option label="全量包" value="shanghai" />
          <el-option label="基线包" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 拉取 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits(['cancel'])
const dialogFormVisible = ref(false)
const form = reactive({
  name: '',
  region: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入包的拉取地址', trigger: 'blur' }],
  region: [{ required: true, message: '请选择包类别', trigger: 'change' }]
})

watch(
  () => props.dialog,
  () => {
    dialogFormVisible.value = props.dialog
  }
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      formEl.resetFields()
      emit('cancel', false)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const cancel = (formEl: FormInstance | undefined) => {
  formEl.resetFields()
  emit('cancel', false)
}
</script>

<style lang="scss" scoped></style>
