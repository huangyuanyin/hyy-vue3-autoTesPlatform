<template>
  <el-tabs v-model="activeName" class="systemConfig-wrap">
    <el-tab-pane label="设备管理" name="systemManage">
      <SystemManage />
    </el-tab-pane>
    <el-tab-pane label="脚本管理" name="scriptMmanage">
      <ScriptMmanage />
    </el-tab-pane>
    <el-tab-pane label="产品包" name="productPackage">
      <ProductPackage />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SystemManage from './SystemManage/SystemManage.vue'
import ScriptMmanage from './ScriptMmanage/ScriptMmanage.vue'
import ProductPackage from './ProductPackage/ProductPackage.vue'

const activeName = ref('systemManage')
</script>

<style lang="scss" scoped></style>
