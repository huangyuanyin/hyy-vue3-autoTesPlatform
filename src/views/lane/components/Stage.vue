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
              <svg-icon v-else iconName="icon-jiahao-copy-copy"></svg-icon>
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
            <div
              class="ignore-jon3-width"
              :class="[parallel.is_pass ? '' : 'isNoPass']"
              :style="{ background: backgroundCard[parallel.plugin], 'border-color': backgroundCard[parallel.plugin] }"
              @click="openTaskDetailDrawer(parallel, index)"
            >
              {{ parallel.name }}
              <el-tooltip class="item" content="有信息未配置" placement="top" :offset="18">
                <el-icon v-if="!parallel.is_pass"><WarningFilled /></el-icon>
              </el-tooltip>
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
              <svg-icon v-else iconName="icon-jiahao-copy-copy"></svg-icon>
            </el-tooltip>
          </div>
        </div>
      </template>
    </div>
  </div>

  <TaskDetailDrawer
    :taskDetailName="taskDetailName"
    :taskDetailInfo="taskDetailInfo"
    :taskDetailDrawer="taskDetailDrawer"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />
  <NetSignProjectDeploy
    :taskDetailName="taskDetailName"
    :taskDetailInfo="taskDetailInfo"
    :taskDetailDrawer="NetSignProjectDeployDrawer"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />
  <InterfaceTest
    :taskDetailName="taskDetailName"
    :taskDetailInfo="taskDetailInfo"
    :taskDetailDrawer="interfaceTestDrawer"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />
  <ExecuteCommand
    :taskDetailName="taskDetailName"
    :taskDetailInfo="taskDetailInfo"
    :taskDetailDrawer="executeCommandDrawer"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />
  <DockerDeployment
    :taskDetailName="taskDetailName"
    :taskDetailInfo="taskDetailInfo"
    :taskDetailDrawer="dockerDeployment"
    @closeDrawer="closeDrawer"
    @deleteTask="handleRemoveParallel(taskId)"
  />

  <TaskGroupDrawer :drawer="drawer" @changeDrawer="changeDrawer" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TaskDetailDrawer from '@/components/TestTask/TaskDetailDrawer.vue'
import TaskGroupDrawer from '@/components/TestTask/TaskGroupDrawer.vue'
import ExecuteCommand from '@/components/TestTask/ExecuteCommand.vue'
import InterfaceTest from '@/components/TestTask/InterfaceTest.vue'
import DockerDeployment from '@/components/TestTask/DockerDeployment.vue'
import { ElMessage } from 'element-plus'
import { RemoveFilled, WarningFilled } from '@element-plus/icons-vue'
import { disposeList } from '../data'
import { color } from 'echarts'

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
const taskDetailInfo = ref([])
const NetSignProjectDeployDrawer = ref(false)
const interfaceTestDrawer = ref(false)
const executeCommandDrawer = ref(false)
const dockerDeployment = ref(false)
const taskDetailName = ref('')
const taskId = ref('')
const stageID = ref(null)
const backgroundCard = {
  netSignPrepare: '#eBC999',
  netSignArrange: '#cdcbd6',
  dockerDeployment: '#8CA9D3',
  interfaceTest: '#DD8EA4'
}

const handleAddParallel = (position: any, index: any) => {
  // 判断props.stage中每个对象的plugin是否含有netSignPrepare，如果有则不允许添加串行任务
  const isNetSignPrepare = props.stage.some((item: any) => item.plugin === 'netSignPrepare')
  if (isNetSignPrepare) {
    ElMessage.warning('环境准备阶段不允许添加串行任务！')
    return
  }
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
    ElMessage.success('删除成功！')
  } else {
    emit('removeStage')
  }
  closeDrawer([false])
}

const triggerMethod = (value: boolean) => {
  if (automatic.value) {
    ElMessage.warning('暂不支持手动触发！')
    return
  }
  // automatic.value = value
}

const openTaskDetailDrawer = (item: any, id: any) => {
  switch (item.plugin) {
    case 'netSignPrepare':
      taskDetailDrawer.value = true
      taskDetailInfo.value = [item.dispose[0]]
      break
    case 'netSignArrange':
      NetSignProjectDeployDrawer.value = true
      taskDetailInfo.value = item.dispose
      break
    case 'interfaceTest':
      interfaceTestDrawer.value = true
      taskDetailInfo.value = item.dispose
      break
    case 'executeCommand':
      executeCommandDrawer.value = true
      break
    case 'dockerDeployment':
      dockerDeployment.value = true
      taskDetailInfo.value = item.dispose
      break
  }
  taskId.value = id
  taskDetailName.value = item.name
}

const closeDrawer = (value?: any) => {
  if (value[1]) {
    props.stage[taskId.value].name = value[1][value[1].length - 1]
    props.stage[taskId.value].dispose = value[1].slice(0, -2)
    props.stage[taskId.value].is_pass = value[1][value[1].length - 2]
  }
  taskDetailDrawer.value = value[0]
  NetSignProjectDeployDrawer.value = value[0]
  interfaceTestDrawer.value = value[0]
  executeCommandDrawer.value = value[0]
  dockerDeployment.value = value[0]
}

const handleCommand = (command: string | number | object, id: string) => {
  switch (command) {
    case 'delete':
      handleRemoveParallel(id)
      break
  }
}

const changeDrawer = (value: any) => {
  const disposeList2 = JSON.parse(JSON.stringify(disposeList))
  if (!value) return (drawer.value = value)
  drawer.value = value[0]
  if (!drawer.value) {
    const name = value[1]
    props.stage.splice(stageID.value, 0, {
      plugin: value[2],
      name: name,
      dispose: disposeList2[value[2]]
    })
    // emit('add-stage', {
    //   name,
    //   task_stages: [
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
  height: 70px;
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
  // margin-top: 8px;
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

    .isNoPass {
      border: 1px solid red !important;
      min-width: 140px !important;
      .el-icon {
        // color: #f56c6c !important;
        color: red !important;
        margin-left: 5px;
        font-size: 18px;
      }
    }

    :deep(.el-dropdown-menu__item .el-icon svg) {
      color: red;
    }

    // position: absolute;
    // left: 50px;

    &:hover {
      .ignore-jon3-width {
        border: 1px solid #1b9aee !important;
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
