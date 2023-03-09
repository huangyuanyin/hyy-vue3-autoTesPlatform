<template>
  <div class="stage">
    <div class="task-container ignore-task-container-margin">
      <div class="job1">
        <el-tooltip class="item" content="自动触发" placement="top" :offset="20">
          <svg-icon v-show="automatic" iconName="icon-shandian" @click="triggerMethod(false)"></svg-icon>
        </el-tooltip>
        <el-tooltip class="item" content="手动触发" placement="top" :offset="20">
          <svg-icon v-show="!automatic" iconName="icon-shoushoushi" @click="triggerMethod(true)"></svg-icon>
        </el-tooltip>
      </div>
      <template v-for="(parallel, index) of stage">
        <div class="content-job">
          <div
            class="job2"
            @mouseenter="isExitHover_one = true"
            @mouseleave="isExitHover_one = false"
            @click="handleAddParallel('before', index)"
          >
            <el-tooltip class="item" content="串行任务" placement="top" :offset="18">
              <svg-icon v-if="!isExitHover_one" iconName="icon-jiahao"></svg-icon>
              <svg-icon v-else="isExitHover_one" iconName="icon-jiahao-copy-copy"></svg-icon>
            </el-tooltip>
          </div>
          <el-dropdown
            trigger="contextmenu"
            @command="
              command => {
                handleCommand(command, index)
              }
            "
            popper-class="contextmenu"
            placement="top-end"
          >
            <div class="ignore-jon3-width" @click="openTaskDetailDrawer(parallel, index)">
              {{ parallel.name }}
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="RemoveFilled" command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div
            class="job4"
            @mouseenter="isExitHover_two = true"
            @mouseleave="isExitHover_two = false"
            @click="handleAddParallel('after', index)"
          >
            <el-tooltip class="item" content="串行任务" placement="top" :offset="18">
              <svg-icon v-if="!isExitHover_two" iconName="icon-jiahao"></svg-icon>
              <svg-icon v-else="isExitHover_two" iconName="icon-jiahao-copy-copy"></svg-icon>
            </el-tooltip>
          </div>
        </div>
      </template>
    </div>
  </div>

  <TaskDetailDrawer
    :taskDetailName="taskDetailName"
    :taskDetailDrawer="taskDetailDrawer"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />
  <NetSignProjectDeploy
    :taskDetailName="taskDetailName"
    :taskDetailDrawer="NetSignProjectDeployDrawer"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />

  <TaskGroupDrawer :drawer="drawer" @changeDrawer="changeDrawer" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TaskDetailDrawer from '@/components/TestTask/TaskDetailDrawer.vue'
import TaskGroupDrawer from '@/components/TestTask/TaskGroupDrawer.vue'
import { ElMessage } from 'element-plus'
import { RemoveFilled } from '@element-plus/icons-vue'

const props = defineProps({
  stage: {
    type: Object,
    required: true
  },
  flow: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['removeStage'])
const isExitHover_one = ref(false)
const isExitHover_two = ref(false)
const automatic = ref(true)
const drawer = ref(false)
const taskDetailDrawer = ref(false)
const NetSignProjectDeployDrawer = ref(false)
const taskDetailName = ref('')
const taskId = ref('')
const stageID = ref(null)

const handleAddParallel = (position: any, index: any) => {
  index = position === 'before' ? index : index + 1
  stageID.value = index
  drawer.value = true
  // props.stage.splice(index, 0, {
  //   name: '新串行'
  // })
}

const handleRemoveParallel = (id: any) => {
  if (props.stage.length > 1) {
    props.stage.splice(id, 1)
  } else {
    emit('removeStage')
  }
  closeDrawer([false])
  ElMessage.success('删除成功！')
}

const triggerMethod = (value: boolean) => {
  automatic.value = value
}

const openTaskDetailDrawer = (item: any, id: any) => {
  console.log(`output->ietm.id`, item)
  switch (item.id) {
    case '10':
      taskDetailDrawer.value = true
      break
    case '11':
      NetSignProjectDeployDrawer.value = true
      break
  }
  taskId.value = id
  taskDetailName.value = item.name
}

const closeDrawer = (value?: any) => {
  if (value[1]) {
    props.stage[taskId.value].name = value[1].name
  }
  taskDetailDrawer.value = value[0]
  NetSignProjectDeployDrawer.value = value[0]
}

const handleCommand = (command: string | number | object, id: string) => {
  switch (command) {
    case 'delete':
      handleRemoveParallel(id)
      break
  }
}

const changeDrawer = (value: any) => {
  if (!value) return (drawer.value = value)
  drawer.value = value[0]
  if (!drawer.value) {
    const name = value[1]
    props.stage.splice(stageID.value, 0, {
      id: value[2],
      name: name
    })
    // emit('add-stage', {
    //   name,
    //   stages: [
    //     [
    //       {
    //         name: name
    //       }
    //     ]
    //   ]
    // })
  }
}
</script>

<style lang="scss" scoped>
.stage {
  position: relative;
  height: 60px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -50%;
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    width: 100%;
    height: 100%;
  }

  &:first-child::before {
    border-left: none;
    border-right: none;
    border-radius: 0 !important;
  }

  &:nth-last-child(2)::before {
    border-radius: 0 0 16px 16px;
  }
}
.ignore-task-container-margin {
  margin-top: 8px;
}

.task-container {
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 14px;
  margin-right: 14px;

  .job1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgb(38 38 38 / 10%);
    z-index: 2;
    > svg {
      width: 20px;
      height: 20px;
    }
  }

  .job1:hover {
    border: 1px solid #1b9aee;
  }

  .content-job {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
    .ignore-jon3-width {
      border: 1px solid #fff;
      min-width: 140px !important;
    }
    .ignore-jon3-width {
      min-width: 140px;
    }
    :deep(.el-dropdown-menu__item .el-icon svg) {
      color: red;
    }
    // position: absolute;
    // left: 50px;

    &:hover {
      .ignore-jon3-width {
        border: 1px solid #1b9aee;
      }
      .job2,
      .job4 {
        opacity: 1;
      }
    }
  }

  .job2,
  .job4 {
    opacity: 0;
    // position: absolute;
    // top: 20px;
    width: 20px;
    height: 20px;
    z-index: 2;
  }

  .ignore-jon3-width {
    // position: absolute;
    // left: 30px;
    // top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 12px;
    margin: 0 10px;
    color: #292929;
    border-radius: 20px;
    background-color: #fff;
    z-index: 2;
    box-shadow: 0 2px 4px 0 rgb(38 38 38 / 10%);
  }

  .job4 {
    left: 190px;
    z-index: 2;
  }
}
</style>

<style lang="scss">
.contextmenu {
  .el-dropdown-menu__item .el-icon {
    color: red;
  }
}
</style>
