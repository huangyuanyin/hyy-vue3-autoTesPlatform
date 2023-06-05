<template>
  <div class="basicInformation-wrap">
    <el-card shadow="never">
      <div class="header">
        <span>任务信息</span>
      </div>
      <div class="content">
        <el-form
          ref="basicInformationFormRef"
          :model="basicInformationForm"
          :rules="basicInformationRules"
          label-width="120px"
          class="basicInformation-ruleForm"
          size="default"
          status-icon
          label-position="top"
        >
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="basicInformationForm.name"
              :disabled="isDisabled"
              placeholder="请输入任务名称..."
              @change="submitForm(basicInformationFormRef)"
            />
          </el-form-item>
          <el-form-item label="标签" prop="region">
            <el-select v-model="basicInformationForm.tag_list" placeholder="待联调" :disabled="true">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="分组" prop="region">
            <el-select v-model="basicInformationForm.group_id" placeholder="请选择分组" @change="selectGroup">
              <el-option :label="item.name" :value="item.name" v-for="(item, index) in groupList" :key="'groupList' + index" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              v-if="!isDisabled && route.path !== '/testTask/addTestTask' && route.path !== '/testTask/lookTestTaskConfig'"
              @click="dialogVisible = true"
              >删除任务</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!--确认删除弹窗-->
    <el-dialog title="提示" v-model="dialogVisible" width="30%" :before-close="handleClose">
      <span style="color: red; font-size: 16px; font-weight: 600">确认删除该流水线任务？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmDelete(basicInformationFormRef)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRefs, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { deleteTaskInfoApi, getPipelineGroupApi } from '@/api/NetDevOps'

const emit = defineEmits(['submitName', 'submitGroup'])
const props = defineProps({
  taskName: {
    type: String,
    default: ''
  },
  taskGroup: {
    type: String,
    default: ''
  }
})
const { taskName, taskGroup } = toRefs(props)

const route = useRoute()
const router = useRouter()
const isDisabled = route.query.type === 'detail' ? true : false
const dialogVisible = ref(false)
const groupList = ref([])
const basicInformationForm = reactive({
  name: '',
  group_id: ''
})
const basicInformationFormRef = ref<FormInstance>()
const basicInformationRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入任务名称...', trigger: 'blur' }]
})

watch(
  taskName,
  val => {
    if (taskName) {
      basicInformationForm.name = val
      emit('submitName', basicInformationForm.name)
    }
  },
  { immediate: true }
)

watch(
  taskGroup,
  val => {
    if (taskGroup) {
      basicInformationForm.group_id = val
      groupList.value.forEach(item => {
        if (item.name === val) {
          emit('submitGroup', item.id)
        }
      })
    }
  },
  { immediate: true }
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    emit('submitName', basicInformationForm.name)
  })
}

const selectGroup = val => {
  groupList.value.forEach(item => {
    if (item.name === val) {
      emit('submitGroup', item.id)
    }
  })
}

const handleClose = (done: any) => {
  done()
}

const handleConfirmDelete = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  deleteTaskInfo(route.query.id)
  formEl.resetFields()
}

const deleteTaskInfo = async id => {
  let res = await deleteTaskInfoApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    router.go(-1)
  }
}

const getPipelineGroup = async () => {
  groupList.value = [
    {
      name: '未分组',
      id: -1
    }
  ]
  const params = {
    page: 1,
    page_size: 10
  }
  let res = await getPipelineGroupApi(params)
  if (res.code === 1000) {
    if (res.data.length !== 0) {
      groupList.value.splice(0, 0, ...res.data)
    }
  }
}

onMounted(async () => {
  await getPipelineGroup()
  if (route.path === '/testTask/addTestTask') {
    if (route.query.groupId) {
      groupList.value.forEach(item => {
        if (item.id === Number(route.query.groupId)) {
          basicInformationForm.group_id = item.name
          emit('submitGroup', item.id)
        }
      })
    } else {
      basicInformationForm.group_id = '未分组'
      emit('submitGroup', -1)
    }
  }
})
</script>

<style lang="scss" scoped>
.basicInformation-wrap {
  background-color: #f2f5f7;
  height: 77vh;
  max-width: 100%;
  padding: 20px 120px 0 120px;
  box-sizing: border-box;
  :deep(.el-card__body) {
    padding: 0px;
  }
  .basicInformation-ruleForm {
    :deep(.el-input) {
      width: 30vw;
    }
    :deep(.el-button) {
      margin-top: 10px;
    }
  }
  .el-card {
    width: 80%;
    margin: 0 auto;
    height: calc(100% - 20px);
  }
  .header {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e9edf0;
    span {
      padding-left: 17px;
      font-size: 16px;
      color: #292929;
      font-weight: 500;
    }
  }
  .content {
    padding: 30px 40px 0 20px;
  }
}
</style>
