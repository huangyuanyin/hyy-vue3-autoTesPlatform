<template>
  <!-- 一级菜单下面所拥有的二级菜单 -->
  <CollapseMenu :menuList="menuList" />
  <!-- 以及二级菜单所对应的页面 -->
  <el-main>
    <!-- 面包屑 -->
    <Breadcrumb />
    <router-view></router-view>
  </el-main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import TestMenuVue from "../../components/CollapseMenu.vue";
import CollapseMenu from '../../components/CollapseMenu.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import { cheshiMenuData } from '../../data/menu'
export default defineComponent({
  components: {
    // TestMenuVue,
    CollapseMenu,
    Breadcrumb
  },
  setup() {
    const menuList = ref(cheshiMenuData)
    return {
      menuList
    }
  }
})
</script>

<style lang="scss" scoped></style>
