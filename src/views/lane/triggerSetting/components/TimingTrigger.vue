<template>
  <div class="TimingTrigger-warp">
    <header class="header">
      <div class="header__text">定时触发</div>
      <div class="header__desc">定时单次或周期触发流水线自动运行，<span class="header__link">查看文档</span></div>
    </header>
    <el-form label-position="top" label-width="100px" class="timer-scheduler" :model="formLabelAlign" style="max-width: 460px">
      <el-form-item label="触发方式">
        <el-radio-group v-model="formLabelAlign.triggerMethod">
          <el-radio label="cycle">周期触发</el-radio>
          <el-radio label="one">单次触发</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="日期选择">
        <div class="weeks">
          <div
            class="weeks-item"
            :class="{ actived: item.active }"
            v-for="(item, index) in weeks"
            :key="'weeks' + index"
            @click="selectWeek(item, index)"
          >
            {{ item.label }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="触发时间">
        <el-input v-model="formLabelAlign.region" />
      </el-form-item>
      <el-form-item label="间隔时间" v-if="formLabelAlign.triggerMethod === 'cycle'">
        <el-select v-model="formLabelAlign.Intervals" placeholder="">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in IntervalList" :key="'IntervalList' + index" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="next-form-item">
      <label>
        <span>代码变更时定时器触发<svg-icon iconName="icon-bangzhu"></svg-icon></span>
        <el-checkbox v-model="formLabelAlign.checked" label="" size="large" />
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const formLabelAlign = ref({
  triggerMethod: 'cycle',
  date: <any>[],
  region: '',
  Intervals: '5',
  checked: false
})
const IntervalList = ref([
  { label: '5分钟', value: '5' },
  { label: '10分钟', value: '10' },
  { label: '20分钟', value: '20' },
  { label: '30分钟', value: '30' },
  { label: '40分钟', value: '40' },
  { label: '50分钟', value: '50' },
  { label: '60分钟', value: '60' }
])
const weeks = ref([
  { label: '周一', value: '1', active: false },
  { label: '周二', value: '2', active: false },
  { label: '周三', value: '3', active: false },
  { label: '周四', value: '4', active: false },
  { label: '周五', value: '5', active: false },
  { label: '周六', value: '6', active: true },
  { label: '周七', value: '7', active: false }
])

const selectWeek = (val: Object, index: number) => {
  weeks.value[index].active = !weeks.value[index].active // 选中日期筛选标签
  var arr = [] as any // 定义空数组，接收遍历的值
  weeks.value.forEach(item => {
    if (item.active) {
      // 筛选active为true的加到arr中
      arr.push(item.value)
    }
  })
  formLabelAlign.value.date = arr
  if (formLabelAlign.value.date.length === 0) {
    weeks.value[5].active = true
    formLabelAlign.value.date = [weeks.value[5].value]
  }
}
</script>

<style lang="scss" scoped>
.TimingTrigger-warp {
  .header {
    width: calc(100% + 38px);
    margin-left: -19px;
    padding: 17px 0 17px 17px;
    border-bottom: 1px solid #e9edf0;
    .header__text {
      font-size: 16px;
      color: #292929;
      font-weight: 550;
      margin-bottom: 4px;
    }
    .header__desc {
      font-size: 14px;
      color: #8b8b8b;
      .header__link {
        color: #1b9aee;
        cursor: pointer;
        margin-left: 3px;
      }
    }
  }
  .timer-scheduler {
    margin-top: 10px;
    .weeks {
      height: 40px;
      width: 100%;
      max-width: 560px;
      border-radius: 4px;
      border: 1px solid #e9edf0;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      .weeks-item {
        width: auto;
        height: 100%;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background: #ddf1ff;
        }
      }
      .actived {
        background: #ddf1ff;
      }
    }
  }
  .next-form-item {
    font-size: 14px;
    color: #575757;
    label {
      display: flex;
      align-items: center;
      svg {
        margin: 0 10px 0 2px;
      }
    }
  }
}
</style>
