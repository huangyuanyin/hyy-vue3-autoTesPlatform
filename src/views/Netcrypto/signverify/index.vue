<template>
  <div class="signverify-wrap">
    <el-tabs>
      <el-tab-pane label="裸签名验签">
        <RawSign />
      </el-tab-pane>
      <el-tab-pane label="Attached签名验签">
        <AttachedSign />
      </el-tab-pane>
      <el-tab-pane label="Detached签名验签">
        <DetachedSign />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import RawSign from './components/rawsign.vue'
import AttachedSign from './components/attachedsign.vue'
import DetachedSign from './components/detachedsign.vue'
</script>

<style lang="scss" scoped>
.signverify-wrap {
  margin: 0px 20px;
}
</style>
