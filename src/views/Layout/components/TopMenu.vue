<template>
  <div class="Header-wrapper">
    <div class="logo">
      <el-button v-if="!drawer" :icon="Operation" class="open" @click="openDrawer('open')" />
      <el-button v-else :icon="CloseBold" class="open" @click="openDrawer('close')" />
      <Drawer :drawer="drawer" @changeDrawer="changeDrawer" />
      <img :src="logo" />
      <span>信安云测平台</span>
    </div>
    <span class="line"> | </span>
    <div class="work">
      <el-button text :icon="HomeFilled" @click="toWork">工作台</el-button>
    </div>
    <div class="right-menu">
      <div class="search">
        <el-input v-model="input" placeholder="请输入要搜索的内容" :prefix-icon="Search" />
      </div>
      <div class="support">
        <el-button text bg>支持</el-button>
      </div>
      <div class="help">
        <el-tooltip class="box-item" effect="dark" content="有两条未读消息" placement="bottom">
          <el-icon>
            <BellFilled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="tip">
        <el-tooltip class="box-item" effect="dark" content="帮助文档" placement="bottom">
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="userInfo">
        <img :src="user" />
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ data.username }}
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in data.button" :key="'button' + index" @click="toLink(index)">
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import logo from '@/assets/logo.png'
import user from '@/assets/user.png'
import { useUserStore } from '@/store/modules/user'
import { HomeFilled, ArrowDown, QuestionFilled, BellFilled, Search, Operation, CloseBold } from '@element-plus/icons-vue'
import Drawer from '@/components/Drawer.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useUserStore()
const input = ref('')
const drawer = ref(false)
const data = reactive({
  username: JSON.parse(localStorage.getItem('userInfo'))?.nickname,
  button: [{ name: '个人中心' }, { name: '退出登录' }]
})

const openDrawer = val => {
  val === 'open' ? (drawer.value = true) : (drawer.value = false)
}

const toLink = index => {
  switch (index) {
    case 0:
      ElMessage.warning('暂不支持')
      break
    case 1:
      store.LoginOut()
      router.push('/login')
      break
  }
}
const toWork = () => {
  let url = import.meta.env.VITE_APP_CONSOLE_URL
  window.location.href = url
}

const changeDrawer = drawer => {
  openDrawer(drawer)
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.Header-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  box-shadow: -1px 2px 14px 0px;

  .logo {
    display: flex;
    align-items: center;
    height: 100%;

    .open {
      height: 100%;
      border: none;
      border-radius: 0px;
      background-color: #242f42;
      color: #fff;
    }

    img {
      width: 40px;
    }

    span {
      line-height: 50px;
      color: #fff;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      vertical-align: middle;
      margin-left: 5px;
    }
  }

  .line {
    color: #fff;
    margin: 0 5px 0 10px;
  }

  .work {
    flex: 1;
    height: 100%;
    line-height: 50px;
  }

  .right-menu {
    display: flex;
    align-items: center;
    padding-right: 20px;

    .support {
      margin: 0 4px;

      .el-button.is-text:not(.is-disabled).is-has-bg.el-button.is-text:not(.is-disabled).is-has-bg {
        background-color: #242f42;
      }
    }

    .help {
      .el-icon svg {
        color: #fff;
      }
    }

    .tip {
      margin: 0 20px;

      .el-icon svg {
        color: #fff;
      }
    }

    .userInfo {
      display: flex;
      align-items: center;

      img {
        margin: 0 5px 0 10px;
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      .el-dropdown-link:hover {
        cursor: pointer;
      }

      .el-dropdown {
        color: #fff;
      }
    }
  }
}
</style>
