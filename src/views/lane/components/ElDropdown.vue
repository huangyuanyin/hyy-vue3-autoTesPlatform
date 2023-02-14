<template>
  <el-dropdown trigger="contextmenu">
    <span class="el-dropdown-link">
      Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
        <el-dropdown-item :icon="CirclePlusFilled"> Action 2 </el-dropdown-item>
        <el-dropdown-item :icon="CirclePlus">Action 3</el-dropdown-item>
        <el-dropdown-item :icon="Check">Action 4</el-dropdown-item>
        <el-dropdown-item :icon="CircleCheck">Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowDown, Check, CircleCheck, CirclePlus, CirclePlusFilled, Plus } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.block-col-2 .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
