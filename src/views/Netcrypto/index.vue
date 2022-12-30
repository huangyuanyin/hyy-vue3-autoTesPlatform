<template>
  <!-- 一级菜单下面所拥有的二级菜单 -->
  <CollapseMenu :menuList="menuList" />
  <!-- 以及二级菜单所对应的页面 -->
  <el-main>
    <!-- 面包屑 -->
    <Breadcrumb />
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component
          :is="Component"
          :key="route.matched[2].path"
          v-if="shouldCache && route.meta.keepAlive"
          keepAlive
          :rootKey="route.matched[2].path"
        />
      </keep-alive>
      <component :is="Component" :key="route.matched[2].path" v-if="!keepAlive && !route.meta.keepAlive" />
    </router-view>
  </el-main>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CollapseMenu from '@/components/CollapseMenu.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { APVAutoMenuData } from '@/data/menu'

const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: false
  },
  rootKey: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const menuList = ref(APVAutoMenuData)
const shouldCache = computed(() => {
  return route.matched[1].path === props.rootKey
})
</script>

<style lang="scss" scoped></style>
