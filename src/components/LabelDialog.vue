<template>
  <el-dialog v-model="visible" title="新建标签" width="35%" :before-close="handleCloseLabelDialog" custom-class="labelDialog">
    <el-form label-width="100px" :model="addLabelForm" :rules="addLabelRules" ref="addLabelRuleFormRef">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="addLabelForm.name" placeholder="请输入标签名称"></el-input>
      </el-form-item>
      <el-form-item label="标签分类">
        <el-select v-model="addLabelForm.type" placeholder="请选择标签分类" disabled>
          <el-option v-for="(item, index) in labelTypeList" :key="'labelTypeList' + index" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签颜色" prop="color">
        <div class="colorSvgList">
          <div
            :class="[`colorSvgList${index}`, 'activeColorSvg']"
            :style="{ 'background-color': item.color }"
            @click="selectColorSvg(item)"
            v-for="(item, index) in colorSvgList"
            :key="'colorSvgList' + index"
          >
            <div v-if="item.color === colorSvgIndex" class="tick"></div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelAddLabelDialog(addLabelRuleFormRef)">取 消</el-button>
        <el-button type="primary" @click="submitAddLabelForm(addLabelRuleFormRef)"> 保 存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { addPipelineTagApi, getPipelineTagApi } from '@/api/NetDevOps'

const props = defineProps({
  labelDialogVisible: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['updatePipelineTag', 'closeTagDialog'])

const visible = ref(false)
const colorSvgIndex = ref('#1f9aef')
const colorSvgList = ref([
  {
    color: '#1f9aef',
    isSelect: true
  },
  {
    color: '#e63a3a',
    isSelect: false
  },
  {
    color: '#fa8c15',
    isSelect: false
  },
  {
    color: '#15ad31',
    isSelect: false
  },
  {
    color: '#7978e5',
    isSelect: false
  },
  {
    color: '#8c8c8c',
    isSelect: false
  }
])
const addLabelForm = reactive({
  name: '',
  type: -1,
  color: '#1f9aef'
})
const addLabelRuleFormRef = ref<FormInstance>()
const addLabelRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请输入标签名称',
      trigger: 'blur'
    }
  ]
})
const labelTypeList = ref([
  {
    label: '未分类',
    value: -1
  }
])

watch(
  () => props.labelDialogVisible,
  (val, oldVal) => {
    visible.value = val
  }
)

const selectColorSvg = item => {
  colorSvgIndex.value = item.color
  addLabelForm.color = item.color
}

const submitAddLabelForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addPipelineTag()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const addPipelineTag = async () => {
  const params = {
    name: addLabelForm.name,
    color: addLabelForm.color
  }
  let res = await addPipelineTagApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    visible.value = false
    emit('closeTagDialog', false)
    getPipelineTag()
    cancelAddLabelDialog(addLabelRuleFormRef.value)
  }
}

const handleCloseLabelDialog = () => {
  cancelAddLabelDialog(addLabelRuleFormRef.value)
}

const cancelAddLabelDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  colorSvgIndex.value = '#1f9aef'
  visible.value = false
  emit('closeTagDialog', false)
}

const getPipelineTag = async () => {
  let res = await getPipelineTagApi({})
  if (res.code === 1000) {
    emit('updatePipelineTag', res.data)
  }
}
</script>

<style lang="scss" scoped></style>
