<template>
  <div class="resourceManagement-card">
    <el-tabs type="border-card">
      <el-tab-pane label="Linux设备">
        <LinuxSystem />
      </el-tab-pane>
      <el-tab-pane label="Windows设备">
        <WindowsStystem />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LinuxSystem from './components/LinuxSystem.vue'
import WindowsStystem from './components/WindowsStystem.vue'
</script>

<style lang="scss" scoped></style>
