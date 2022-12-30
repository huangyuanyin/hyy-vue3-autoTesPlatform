<template>
  <el-aside>
    <el-menu
      :default-active="defaultActiveIndex"
      class="el-menu"
      :collapse="store.isCollapse"
      active-text-color="rgb(85, 85, 85)"
      text-color="rgb(51, 51, 51)"
      router
    >
      <template v-for="(item, index) in menuList" :key="index + 'menu'">
        <!-- 一级菜单(无子级) -->
        <el-menu-item v-if="!item.children.length" :index="item.path" :disabled="item.isDisabled">
          <el-icon>
            <component :is="item.icon" v-if="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
        <!-- 一级菜单(有子级) -->
        <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
          <!-- 一级菜单模板区域 -->
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <!--二级菜单模板区域-->
            <el-menu-item v-for="(subItem, index) in item.children" :key="index + 'subItem'" :index="subItem.path">
              <template #title>
                <el-icon></el-icon>
                <span>{{ subItem.title }}</span>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Document, Menu as IconMenu, Location, School, DataLine, House, Suitcase, Money } from '@element-plus/icons-vue'
import { useAppStore } from '../store/modules/app/index'
export default defineComponent({
  components: { Document, IconMenu, Location, School, House, DataLine, Suitcase, Money },
  props: {
    menuList: {
      type: Array as any,
      default: () => []
    }
  },
  setup() {
    const store = useAppStore()
    const defaultActiveIndex = ref('')
    onMounted(() => {
      defaultActiveIndex.value = window.location.hash.replace('#', '')
    })
    return {
      store,
      defaultActiveIndex
    }
  }
})
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;

  .el-menu-item.is-disabled {
    opacity: 100%;
    cursor: default;
    border-bottom: 1px solid #ebebeb;
  }

  :deep(.el-menu-item-group__title) {
    padding: 0px;
  }

  .is-active {
    background-color: #dedede;
  }
}

.el-menu:not(.el-menu--collapse) {
  width: 191px;
}

.el-aside {
  min-height: calc(100vh - 50px);
  background-color: rgb(245, 245, 245);
  color: rgb(51, 51, 51);
  width: auto;
  overflow-x: hidden;
}
</style>
