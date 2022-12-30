<template>
  <div class="Layout">
    <el-container>
      <el-header>
        <TopMenu />
      </el-header>
      <el-container>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component
              :is="Component"
              :key="$route.matched[1].path"
              v-if="route.meta.keepAlive"
              keepAlive
              :rootKey="$route.matched[1].path"
            />
          </keep-alive>
          <component :is="Component" :key="$route.matched[1].path" v-if="!route.meta.keepAlive" />
        </router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import TopMenu from './components/TopMenu.vue'
export default defineComponent({
  components: {
    TopMenu
  },
  setup() {
    const route = useRoute()
    const key = computed(() => {
      return route.path
    })
    return { route, key }
  }
})
</script>

<style lang="scss" scoped>
.Layout {
  .el-header {
    width: 100%;
    height: 50px;
    background-color: #242f42;
    padding: 0px;
    z-index: 999;
  }

  .el-container {
    overflow: hidden;
    height: 100vh;
  }
}
</style>
