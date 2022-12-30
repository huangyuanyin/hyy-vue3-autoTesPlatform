<template>
  <div class="breadcrumb">
    <el-icon v-if="store.getCollapse" @click="handleClick(false)">
      <Expand />
    </el-icon>
    <el-icon v-else @click="handleClick(true)">
      <Fold />
    </el-icon>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in matchedList" :key="'matchedList' + index">
        <span v-if="item.redirect === 'noRedirect' || index == matchedList.length - 1" class="no-redirect"> {{ item.meta.title }}</span>
        <a v-else @click.self.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pathToRegexp from 'path-to-regexp'
import { useAppStore } from '../store/modules/app/index'
export default defineComponent({
  components: {
    Expand,
    Fold
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useAppStore()
    const matchedList = ref([])
    const handleClick = val => {
      store.handleCollapse(val)
    }
    function pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    }
    const handleLink = item => {
      const { path } = item
      router.push(pathCompile(path))
    }
    watch(
      () => route.path,
      (newPath, oldPath) => {
        matchedList.value = route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      },
      { immediate: true }
    )
    return {
      route,
      store,
      matchedList,
      handleClick,
      Expand,
      Fold,
      handleLink
    }
  }
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  padding-bottom: 20px;
  cursor: pointer;

  .el-breadcrumb {
    display: inline-flex;
    height: 16px;
    margin-left: 5px;
  }
}
</style>
