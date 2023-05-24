<template>
  <!-- 一级菜单下面所拥有的二级菜单 -->
  <CollapseMenu :menuList="menuList" @updateMenuList="getPipelineGroup" />
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CollapseMenu from '@/components/CollapseMenu.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { AutoTestMenuData } from '@/data/menu'
import { getPipelineGroupApi } from '@/api/NetDevOps/index'

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
const router = useRouter()
const menuList = ref(AutoTestMenuData)
const shouldCache = computed(() => {
  return route.matched[1].path === props.rootKey
})

const getPipelineGroup = async () => {
  const params = {
    page: 1,
    page_size: 10
  }
  menuList.value = Array.from(AutoTestMenuData)
  let res = await getPipelineGroupApi(params)
  if (res.code === 1000) {
    let newMenuList = []
    if (res.data.length !== 0) {
      newMenuList = res.data.map(item => ({
        name: item.name,
        id: item.id,
        title: item.name,
        children: [],
        icon: null,
        path: '/compTest/' + item.name,
        component: '@/views/testTask/compTest.vue'
      }))
    } else {
      newMenuList.push({
        title: '暂无分组',
        children: [],
        icon: null,
        path: null
      })
    }
    var index = menuList.value.findIndex(function (item) {
      return item.title === '已分组'
    })
    menuList.value.splice(index + 1, 0, ...newMenuList)
  }
}

onMounted(() => {
  getPipelineGroup()
})
</script>

<style lang="scss" scoped></style>
