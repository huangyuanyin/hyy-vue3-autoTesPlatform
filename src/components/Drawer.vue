<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="isDrawer" :direction="direction" :append-to-body="false" :z-index="-1" :with-header="false">
      <el-menu default-active="POCTest" class="el-menu-vertical-demo" @select="handleSelect" router>
        <el-menu-item
          v-for="(item, index) in menuList"
          :key="'menuList' + index"
          :index="item.path"
          :disabled="item.title == '产品与服务' ? true : false"
        >
          <el-icon>
            <Setting v-if="item.title != '产品与服务'" />
          </el-icon>
          <span>{{ item.title }}</span>
          <el-icon class="arrow">
            <ArrowRight v-if="item.title == '产品与服务'" />
          </el-icon>
        </el-menu-item>
      </el-menu>
      <span class="close" @click="handleClose">
        <el-icon>
          <Close />
        </el-icon>
      </span>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Document, Menu as IconMenu, Location, Setting, ArrowRight, Close } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store/modules/app'
export default defineComponent({
  components: {
    IconMenu,
    Document,
    Location,
    Setting,
    ArrowRight,
    Close
  },
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const router = useRouter()
    const store = useAppStore()
    const menuList = ref([
      { path: '', title: '产品与服务' },
      { path: '/POCTest', title: 'POC测试' },
      { path: '/test', title: '测试' }
    ])
    const direction = ref('ltr')
    const isDrawer = computed({
      get() {
        return props.drawer
      },
      set(value) {
        emit('changeDrawer', value)
        return value
      }
    })
    // 切换菜单栏
    const handleSelect = path => {
      router.push({
        path: path
      })
      store.isCollapse = false
      isDrawer.value = false
    }
    const handleClose = () => {
      isDrawer.value = false
    }
    return {
      router,
      store,
      menuList,
      direction,
      isDrawer,
      handleSelect,
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.drawer-wrapper {
  :deep(.el-drawer__header) {
    margin-bottom: 0px;
    padding: 0px;
  }

  :deep(.el-drawer__body) {
    padding: 0px;
  }

  :deep(.el-overlay) {
    top: 50px;
  }

  .el-menu-vertical-demo {
    height: 100vh;
    width: 240px;

    .el-menu-item.is-disabled {
      opacity: 1;
      background-color: #ebebeb !important;
      cursor: default;
    }

    .arrow {
      position: absolute;
      top: 50%;
      right: var(--el-menu-base-level-padding);
      margin-top: -7px;
      font-size: 12px;
      margin-right: 0;
      width: inherit;
    }
  }

  .close {
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 20px;
    line-height: 20px;
    font-size: 16px;
    cursor: pointer;
  }

  :deep(.el-menu-item-group__title) {
    padding: 0px;
  }
}
</style>
