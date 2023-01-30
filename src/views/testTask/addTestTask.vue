<template>
  <div class="addTestTask-wrap">
    <el-card shadow="never">
      <el-steps :space="800" :active="active" align-center finish-status="success">
        <el-step title="基本信息" />
        <el-step title="流程配置" />
        <el-step title="触发设置" />
      </el-steps>
    </el-card>
    <BasicInformation v-show="active === 0" @changeActive="changeActive" />
    <ProcessConfig v-show="active === 1" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Edit, Picture, Upload } from '@element-plus/icons-vue'
import BasicInformation from './components/BasicInformation.vue'
import ProcessConfig from './components/ProcessConfig.vue'

const active = ref(0)
const changeActive = id => {
  active.value = id
}
</script>

<style lang="scss" scoped>
.addTestTask-wrap {
  padding: 10px 0 0 20px;
}
</style>
