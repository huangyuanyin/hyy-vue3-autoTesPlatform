<template>
  <div class="addTestTask-wrap">
    <el-steps :space="800" :active="0" align-center finish-status="success">
      <el-step title="基本信息" />
      <el-step title="流程配置" />
      <el-step title="触发设置" />
    </el-steps>

    <BasicInformation />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Edit, Picture, Upload } from '@element-plus/icons-vue'

import BasicInformation from './components/BasicInformation.vue'
</script>

<style lang="scss" scoped></style>
