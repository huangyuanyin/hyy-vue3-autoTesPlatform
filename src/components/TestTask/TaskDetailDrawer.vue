<template>
  <el-drawer
    v-model="ishowDrawer"
    direction="rtl"
    @close="cancelClick(taskDetailFormRef)"
    custom-class="taskDetail-drawer"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div class="header">
        <span class="">编辑</span>
        <div class="changeDelete">
          <svg-icon class="grayDelete" @click="deleteTask" iconName="icon-changyonggoupiaorenshanchu"></svg-icon>
          <svg-icon class="redDelete" @click="deleteTask" iconName="icon-changyonggoupiaorenshanchu-copy"></svg-icon>
        </div>
      </div>
    </template>
    <template #default>
      <el-form
        ref="taskDetailFormRef"
        :model="taskDetailForm"
        :rules="taskDetailFormRules"
        label-width="120px"
        class="taskDetail-ruleForm"
        size="default"
        status-icon
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskDetailForm.name" placeholder="请输入任务名称" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick(taskDetailFormRef)">取消</el-button>
        <el-button type="primary" @click="confirmClick(taskDetailFormRef)">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  taskDetailDrawer: {
    type: Boolean,
    default: () => false
  },
  taskDetailName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['closeDrawer', 'deleteTask'])
const ishowDrawer = ref(false)
const input = ref('')
const data = reactive({
  name: '代码扫描',
  desc: '这是一段代码扫描代码扫描'
})
const taskDetailFormRef = ref<FormInstance>()
const taskDetailForm = reactive({
  name: ''
})
const taskDetailFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }]
})

watch(
  () => props.taskDetailDrawer,
  () => {
    ishowDrawer.value = props.taskDetailDrawer
  }
)

watch(
  () => props.taskDetailName,
  () => {
    taskDetailForm.name = props.taskDetailName
  }
)

const closeDrawer = (value?: any) => {
  emit('closeDrawer', [false, value])
}

const cancelClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  closeDrawer()
}

const confirmClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      closeDrawer(taskDetailForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const deleteTask = () => {
  emit('deleteTask')
}
</script>

<style lang="scss">
.taskDetail-drawer {
  .el-drawer__header {
    font-size: 14px;
    border-bottom: 1px solid #dbdbdb !important;
    padding: 0px;
    padding-left: 32px;
    height: 60px;
    margin-bottom: 0px;
    svg:hover {
      cursor: pointer;
    }
    .changeDelete {
      display: inline-block;
    }
    .changeDelete .grayDelete {
      display: inline-block;
    }
    .changeDelete .redDelete {
      display: none;
    }
    .changeDelete:hover .grayDelete {
      display: none;
    }
    .changeDelete:hover .redDelete {
      display: inline-block;
    }
  }
  span {
    font-weight: 500;
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>
