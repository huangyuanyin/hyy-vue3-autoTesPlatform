<template>
  <div class="triggerSetting-warp">
    <div class="triggerSetting-warp-left">
      <ul class="at-nav">
        <li
          class="at-nav-item"
          v-for="(item, index) in navItems"
          :key="'navItems' + index"
          :class="currentNavItemIndex === index ? 'at-nav-item-actived' : ''"
        >
          <div class="at-nav-item-main" @click="selectNavItem(index)">
            <span class="text">{{ item.name }}</span>
            <el-switch v-model="item.status" :disabled="item.disabled" />
          </div>
        </li>
      </ul>
    </div>
    <div class="triggerSetting-warp-right">
      <WebhookTrigger v-if="currentNavItemIndex === 0" />
      <TimingTrigger v-else @formLabelAlign="formLabelAlign" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import WebhookTrigger from './components/WebhookTrigger.vue'
import TimingTrigger from './components/TimingTrigger.vue'

const emit = defineEmits(['formLabelAlign'])
const currentNavItemIndex = ref(1) //当前索引
const navItems = ref([
  { name: 'Webhook触发', status: false, disabled: true },
  { name: '定时触发', status: true, disabled: false }
])

const selectNavItem = (index: any) => {
  currentNavItemIndex.value = index
}

onMounted(() => {
  const e = {
    trigger_ways: 'period',
    trigger_week: [6],
    trigger_time: ['15:00', '16:00'],
    trigger_interval: '5',
    checked: false,
    type: 'regular'
  } // 初始化一个事件对象
  emit('formLabelAlign', e)
})

const formLabelAlign = (e: any) => {
  currentNavItemIndex.value === 0 ? (e.type = 'Webhook') : (e.type = 'regular')
  emit('formLabelAlign', e)
}
</script>

<style lang="scss" scoped>
.triggerSetting-warp {
  padding: 20px 120px;
  background-color: #f2f5f7;
  height: calc(100vh - 227px);
  display: flex;
  .triggerSetting-warp-left {
    max-height: calc(100vh - 100px);
    width: 280px;
    border: 1px solid #e9edf0;
    border: 1px solid var(--color-brand3-2, #e9edf0);
    border-radius: 4px;
    margin-right: 20px;
    background: #fff;
    .at-nav {
      line-height: 32px;
      margin-top: 8px;
      width: 100%;
      padding-left: 0px;
      .at-nav-item {
        list-style: none;
        margin: 8px 0;
        .at-nav-item-main {
          height: 32px;
          padding: 0px 20px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          .text {
            font-weight: 600;
            color: #262626;
          }
          &:hover {
            background: #f7f7f7 !important;
          }
        }
      }
      .at-nav-item-actived {
        &::before {
          background: #1b9aee;
          width: 2px;
          height: 32px;
          -webkit-transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          content: ' ';
          position: absolute;
          z-index: 2;
        }
      }
    }
  }
  .triggerSetting-warp-right {
    max-height: calc(100vh - 100px);
    // height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    overflow: hidden auto;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    border: 1px solid #e9edf0;
    border-radius: 4px;
    background: #fff;
    padding: 0 20px 40px;
  }
}
</style>
