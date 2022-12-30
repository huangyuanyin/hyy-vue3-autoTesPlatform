<template>
  <div class="encrypt-wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane label="对称加解密" name="symm">
        <Symm />
      </el-tab-pane>
      <el-tab-pane label="非对称加解密" name="asymm">
        <Asymm />
      </el-tab-pane>
      <el-tab-pane label="散列/哈希" name="hash">
        <Hash />
      </el-tab-pane>
      <el-tab-pane label="Base64" name="base64">
        <Base64 />
      </el-tab-pane>
      <el-tab-pane label="URL编码/解码" name="url">
        <Url />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import Symm from './components/symm.vue'
import Asymm from './components/asymm.vue'
import Hash from './components/hash.vue'
import Base64 from './components/base64.vue'
import Url from './components/url.vue'
import { ref } from 'vue'

const activeName = ref('symm')
</script>

<style lang="scss" scoped>
.encrypt-wrap {
  margin: 0 20px;
}
</style>
