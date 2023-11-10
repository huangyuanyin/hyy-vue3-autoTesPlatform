<template>
  <el-aside>
    <el-menu
      :default-active="defaultActiveIndex"
      class="el-menu"
      :collapse="store.isCollapse"
      active-text-color="rgb(85, 85, 85)"
      text-color="rgb(51, 51, 51)"
      router
      v-loading="isLoading"
    >
      <template v-for="(item, index) in props.menuList" :key="index + 'menu'">
        <!-- 一级菜单(无子级) -->
        <el-menu-item
          v-if="!item.children.length && !['已分组', '暂无分组'].includes(item.title)"
          :index="item.path"
          :disabled="item.isDisabled"
          :class="[item.icon === null ? 'trendsMenu-item' : 'menu-item', item.title === '暂无分组' ? 'noGroup-item' : '']"
        >
          <template #title>
            <div>
              <el-icon>
                <component :is="getIconComponent(item.icon)" />
              </el-icon>
              {{ item.title }}
            </div>
            <div v-if="item.icon === null" class="trendsMenu-item-left">
              <el-dropdown trigger="hover">
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="editGroup" @click.stop="handleAddGroup('edit', item)">编辑分组</el-dropdown-item>
                    <el-dropdown-item command="deleteGroup" @click.stop="handleAddGroup('delete', item)">
                      <span style="color: #f56c6c">删除分组</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-icon @click.stop="handleFavoriteGroup(item)"><StarFilled /></el-icon>
            </div>
          </template>
        </el-menu-item>
        <el-menu-item
          v-if="(!item.children.length && item.title === '已分组') || item.title === '暂无分组'"
          :index="item.path"
          :disabled="true"
          class="grouped-item"
        >
          <template #title>
            <div v-if="item.title === '已分组'">
              <el-icon>
                <component :is="getIconComponent(item.icon)" />
              </el-icon>
              {{ item.title }}
            </div>
            <div style="color: #b1b8bf" v-else>
              <el-icon>
                <component :is="getIconComponent(item.icon)" />
              </el-icon>
              {{ item.title }}，
              <span @click.stop="handleAddGroup('add')" style="color: #409eff; cursor: pointer">新建分组</span>
            </div>
            <div class="grouped-item-left" v-if="item.title === '已分组'">
              <el-icon @click.stop="handleAddGroup('add')"><CirclePlus /></el-icon>
            </div>
          </template>
        </el-menu-item>
        <!-- 一级菜单(有子级) -->
        <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
          <!-- 一级菜单模板区域 -->
          <template #title>
            <!-- <el-icon>
              <location />
            </el-icon> -->
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <!--二级菜单模板区域-->
            <el-menu-item v-for="(subItem, index) in item.children" :key="index + 'subItem'" :index="subItem.path">
              <template #title>
                <el-icon></el-icon>
                <span>{{ subItem.title }}</span>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
  <el-dialog v-model="addGroupDialog" :title="addGroupDialogTitle" width="40%" :before-close="handleClose">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="form.name" maxlength="32" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="deleteGroupDialog" title="删除分组" width="440px" :before-close="handleClose">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <div class="deleteGroupName">
          <el-icon style="color: #cd3021"><CircleCloseFilled /></el-icon>删除分组
        </div>
      </div>
    </template>
    {{ `【${deleteGroupName}】目前有${task_count}条流水线，确认删除吗？` }}
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteGroupDialog = false">取消</el-button>
        <el-button type="danger" @click="handleDeleteGroup"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, watch, nextTick, watchEffect } from 'vue'
import { CirclePlus, MoreFilled, StarFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules, ElIcon } from 'element-plus'
import { useAppStore } from '../store/modules/app/index'
import { addPipelineGroupApi, editPipelineGroupApi, deletePipelineGroupApi } from '@/api/NetDevOps/index'
import { getIconComponent } from '@/data/iconComponent'
import { useRoute, useRouter } from 'vue-router'
import { setInterval } from 'timers/promises'

const props = defineProps({
  menuList: {
    type: Array as any,
    default: () => []
  }
})
const emit = defineEmits(['updateMenuList'])
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const defaultActiveIndex = ref('')
const addGroupDialogTitle = ref('')
const deleteGroupName = ref('')
const deleteGroupId = ref(null)
const task_count = ref(null)
const deleteGroupDialog = ref(false)
const addGroupDialog = ref(false)
const ruleFormRef = ref<FormInstance>()
const form = reactive({
  pipeline_group_id: undefined,
  name: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
})

const handleFavoriteGroup = val => {
  ElMessage.warning('收藏功能开发中...')
}

const handleAddGroup = (type, val?) => {
  switch (type) {
    case 'add':
      addGroupDialog.value = true
      addGroupDialogTitle.value = '新建分组'
      break
    case 'edit':
      addGroupDialog.value = true
      form.name = val.title
      form.pipeline_group_id = val.id
      addGroupDialogTitle.value = '编辑分组'
      break
    case 'delete':
      console.log(`output->val`, val)
      deleteGroupDialog.value = true
      deleteGroupName.value = val.title
      deleteGroupId.value = val.id
      task_count.value = val.task_count
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addGroupDialogTitle.value === '新建分组'
        ? addPipelineGroup()
        : addGroupDialogTitle.value === '编辑分组'
        ? editPipelineGroup()
        : deletePipelineGroup(deleteGroupId.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleDeleteGroup = () => {
  deletePipelineGroup(deleteGroupId.value)
}

const addPipelineGroup = async () => {
  let res = await addPipelineGroupApi(form)
  if (res.code === 1000) {
    ElMessage.success('新建分组成功！')
    resetForm(ruleFormRef.value)
    addGroupDialog.value = false
    emit('updateMenuList')
  }
}

const editPipelineGroup = async () => {
  isLoading.value = true
  let res = await editPipelineGroupApi(form)
  isLoading.value = false
  if (res.code === 1000) {
    if (Number(route.query.id) === form.pipeline_group_id) {
      router.push({
        path: '/compTest/' + form.name,
        query: {
          id: form.pipeline_group_id
        }
      })
    }
    emit('updateMenuList')
    ElMessage.success('编辑分组成功！')
    addGroupDialog.value = false
    resetForm(ruleFormRef.value)
  }
}

const deletePipelineGroup = async id => {
  isLoading.value = true
  let res = await deletePipelineGroupApi(id)
  isLoading.value = false
  deleteGroupDialog.value = false
  if (res.code === 1000) {
    if (Number(route.query.id) === id) {
      router.push({ path: '/myTestTask' })
    }
    ElMessage.success('删除分组成功！')
    emit('updateMenuList')
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  addGroupDialog.value = false
  formEl.resetFields()
}

const handleClose = (done: () => void) => {
  resetForm(ruleFormRef.value)
  done()
}

watch(
  () => localStorage.getItem('isLoadMenu'),
  () => {
    console.log(`output->1212`, localStorage.getItem('isLoadMenu'))
    if (
      '/' + decodeURIComponent(window.location.hash.replace('#', '')).split('/')[1] === '/compTest' ||
      '/' + decodeURIComponent(window.location.hash.replace('#', '')).split('/')[1] === '/myTestTask'
    ) {
      setTimeout(() => {
        defaultActiveIndex.value = decodeURIComponent(window.location.hash.replace('#', ''))
      }, 500)
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  if ('/' + window.location.hash.replace('#', '').split('/')[1] !== '/compTest') {
    defaultActiveIndex.value = '/' + window.location.hash.replace('#', '').split('/')[1]
  }
})
</script>

<style lang="scss" scoped>
.deleteGroupName {
  color: #292929;
  font-size: 16px;
  display: flex;
  align-items: center;
  .el-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}
.el-menu {
  height: 100%;
  .grouped-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .grouped-item-left {
      display: flex;
      align-items: center;
      .el-icon {
        margin-right: 0px;
        cursor: pointer;
      }
      .el-icon:hover {
        color: #409eff;
      }
    }
  }
  .menu-item {
    &.is-disabled {
      display: flex;
      justify-content: center;
      opacity: 100%;
      cursor: default;
      border-bottom: 1px solid #ebebeb;
    }
  }
  .trendsMenu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .trendsMenu-item-left {
      margin-left: 20px;
      display: flex;
      align-items: center;
      .el-dropdown:hover {
        color: #409eff;
      }
      .el-icon {
        font-size: 20px;
      }
      .el-icon:nth-child(2) {
        color: #909399;
        margin-right: 0px;
      }
      .el-icon:nth-child(2):hover {
        color: #e6a23c;
      }
    }
  }
  .noGroup-item {
    color: #b1b8bf;
  }
  .grouped-item {
    &.is-disabled {
      opacity: 100%;
      cursor: default;
    }
  }

  :deep(.el-menu-item-group__title) {
    padding: 0px;
  }
  .is-active {
    background-color: #dedede;
  }
}

.el-menu:not(.el-menu--collapse) {
  min-width: 13vw;
}

.el-aside {
  min-height: calc(100vh - 50px);
  background-color: rgb(245, 245, 245);
  color: rgb(51, 51, 51);
  width: auto;
  overflow-x: hidden;
}
</style>
