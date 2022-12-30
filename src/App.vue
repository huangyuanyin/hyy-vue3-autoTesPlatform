<script lang="ts" setup>
import * as echarts from 'echarts'
import { provide } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
provide('echarts', echarts)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
body {
  margin: 0px;
}
</style>
