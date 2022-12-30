<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="line" alt="" />
      </div>
      <span class="logo">
        <img :src="logo" alt="" />
      </span>
      <span class="title">APV自动化平台概览</span>
      <div class="title-right">
        <img :src="refresh" class="qiehuan" @click="handleRefresh" />
        <span class="datetime">{{ getNowDate() }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 测试平台使用情况图表 -->
          <div class="testingPlatform-container">
            <h2>测试平台使用情况</h2>
            <div class="details">
              <div class="item">
                <img src="../../../assets/icon_01.png" />
                <span>测试平台总数</span>
                <p>
                  <span class="num">100780</span>
                  <span class="white-font">(条)</span>
                </p>
              </div>
              <div class="item">
                <img src="../../../assets/icon_02.png" />
                <span>任务运行总数</span>
                <p>
                  <span class="num">780</span>
                  <span class="white-font">(条)</span>
                </p>
              </div>
              <div class="item">
                <img src="../../../assets/icon_03.png" />
                <span>平台使用次数</span>
                <p>
                  <span class="num">670</span>
                  <span class="white-font">(条)</span>
                </p>
              </div>
            </div>
            <TaskBar />
          </div>
          <div class="WeeklyVersion-container">
            <h2>周版本使用情况</h2>
            <WeeklyVersion />
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- Case图表 -->
          <CasesEcharts v-if="isRefresh" />
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 任务列表图表 -->
          <TaskEcharts v-if="isRefresh" />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, nextTick, ref } from 'vue'
import { getThemeValue } from '@/utils/theme_utils'
import { useAppStore } from '@/store/modules/app'
import TaskEcharts from './component/TaskEcharts.vue'
import CasesEcharts from './component/CasesEcharts.vue'
import TaskBar from './component/TaskBar.vue'
import WeeklyVersion from './component/WeeklyVersion.vue'
import { getNowDate } from '@/utils/util.js'
import logo from '@/assets/logo.png'
import line from '@/assets/header_border_dark.png'
import refresh from '@/assets/qiehuan_dark.png'

const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: false
  },
  rootKey: {
    type: Boolean,
    default: false
  }
})

const store = useAppStore()

const containerStyle = computed(() => {
  return {
    backgroundColor: getThemeValue(store.theme).backgroundColor,
    color: getThemeValue(store.theme).titleColor
  }
})
// const logoSrc = computed(() => {
//   return '@/assets/' + getThemeValue(store.theme).logoSrc
// })
// const headerSrc = computed(() => {
//   return '@/assets/' + getThemeValue(store.theme).headerBorderSrc
// })
// const themeSrc = computed(() => {
//   return '@/assets/' + getThemeValue(store.theme).themeSrc
// })

const fullScreenStatus = {
  // 定义每一个图表的全屏状态
  trend: false,
  seller: false,
  map: false,
  rank: false,
  hot: false,
  stock: false
}

const isRefresh = ref(true)
const handleRefresh = () => {
  isRefresh.value = false
  nextTick(() => {
    isRefresh.value = true
  })
}
</script>

<style lang="scss" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: calc(100% - 61px);
  // padding: 0 20px;
  background-color: rgba(7, 10, 88, 0.99) !important;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  background-color: rgba(3, 14, 70, 0.5) !important;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-60%);
    height: 100%;
  }

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 20px;
    top: 60%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 80px;
    }
  }
}

.screen-body {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  margin-top: 10px;
  justify-content: flex-start;
  // justify-content: flex-end;

  .screen-left {
    height: 100%;
    width: 27.6%;

    .testingPlatform-container {
      background-color: rgba(3, 14, 70, 0.5) !important;
      height: 100%;

      .details {
        display: flex;
        justify-content: space-around;
        padding-top: 10px;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;

          p {
            display: block;
          }

          .white-font {
            color: #fff;
            line-height: 26px;
            margin-left: 5px;
            font-size: 16px;
          }

          .num {
            color: #02cbff;
            font-weight: 400;
            font-size: 22px;
          }

          span {
            color: #fff;
            font-size: 15px;
          }

          img {
            width: 40px;
            margin-bottom: 10px;
          }
        }
      }

      h2 {
        color: #007bff !important;
        text-align: center;
        margin: 0;
        line-height: 40px;
      }
    }

    .WeeklyVersion-container {
      background-color: rgba(3, 14, 70, 0.5) !important;
      height: 84%;
      margin-top: 15px;

      h2 {
        color: #007bff !important;
        text-align: center;
        margin: 0;
        line-height: 40px;
      }
    }

    #left-top {
      height: 53%;
      position: relative;
    }

    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 100%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;
    background-color: rgba(3, 14, 70, 0.5) !important;

    #right-top {
      height: 46%;
      position: relative;
    }

    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
