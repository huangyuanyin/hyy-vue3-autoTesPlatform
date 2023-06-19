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
            <el-select
              v-model="basicInformationForm.tag_list"
              placeholder="请选择标签"
              multiple
              clearable
              @change="submitForm(basicInformationFormRef)"
            >
              <el-option :key="0" :value="0" disabled>
                <div class="custom-option">
                  <el-button
                    :icon="CirclePlus"
                    text
                    type="primary"
                    size="large"
                    class="new-label-button"
                    @click="labelDialogVisible = true"
                  >
                    新建标签
                  </el-button>
                </div>
              </el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in labelList" :key="'labelList' + index">
                <div class="tagStyle">
                  <div class="circle" :style="{ 'background-color': item.color }"></div>
                  <span>{{ item.name }}</span>
                </div>
              </el-option>
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
    <LabelDialog :labelDialogVisible="labelDialogVisible" @closeTagDialog="closeTagDialog" @updatePipelineTag="updatePipelineTag" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRefs, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteTaskInfoApi, getPipelineGroupApi, getPipelineTagApi } from '@/api/NetDevOps'
import LabelDialog from '@/components/LabelDialog.vue'

const emit = defineEmits(['submitName', 'submitGroup', 'submitTagList'])
const props = defineProps({
  taskName: {
    type: String,
    default: ''
  },
  taskTagList: {
    type: Array,
    default: []
  },
  taskGroup: {
    type: String,
    default: ''
  }
})
const { taskName, taskTagList, taskGroup } = toRefs(props)

const route = useRoute()
const router = useRouter()
const isDisabled = route.query.type === 'detail' ? true : false
const dialogVisible = ref(false)
const labelDialogVisible = ref(false)
const labelList = ref([])
const groupList = ref([])
const basicInformationForm = reactive({
  name: '',
  tag_list: [],
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
  taskTagList,
  val => {
    if (taskTagList) {
      basicInformationForm.tag_list = val
      basicInformationForm.tag_list = val.map(it => it.id)
      emit('submitTagList', basicInformationForm.tag_list)
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
    emit('submitTagList', basicInformationForm.tag_list)
  })
}

const selectGroup = val => {
  groupList.value.forEach(item => {
    if (item.name === val) {
      emit('submitGroup', item.id)
    }
  })
}

const updatePipelineTag = res => {
  labelList.value = res
}

const closeTagDialog = val => {
  labelDialogVisible.value = val
}

const getPipelineTag = async () => {
  let res = await getPipelineTagApi({})
  if (res.code === 1000) {
    labelList.value = res.data
  }
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
  await getPipelineTag()
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

.colorSvgList {
  display: flex;
  .colorSvgList0,
  .colorSvgList1,
  .colorSvgList2,
  .colorSvgList3,
  .colorSvgList4,
  .colorSvgList5,
  .colorSvgList6 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 20px;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tick {
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #000;
    transform: rotate(-45deg);
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  .activeColorSvg:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .activeColorSvg:hover:before,
  .activeColorSvg:hover .tick {
    opacity: 1;
  }
}

.custom-option {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  .new-label-button {
    padding-left: 0px;
    padding-top: 0px;
    font-size: 14px;
    .el-icon {
      font-size: 16px;
    }
  }
}
.tagStyle {
  display: flex;
  align-items: center;
  .circle {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-right: 20px;
  }
}
</style>
