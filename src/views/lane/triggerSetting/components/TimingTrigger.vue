<template>
  <div class="TimingTrigger-warp">
    <header class="header">
      <div class="header__text">定时触发</div>
      <div class="header__desc">定时单次或周期触发流水线自动运行，<span class="header__link">查看文档</span></div>
    </header>
    <el-form label-position="top" label-width="100px" class="timer-scheduler" :model="formLabelAlign" style="max-width: 460px">
      <el-form-item label="触发方式">
        <el-radio-group v-model="formLabelAlign.trigger_ways">
          <el-radio label="period">周期触发</el-radio>
          <el-radio label="once">单次触发</el-radio>
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
        <div class="selectTime-wrap">
          <el-time-select
            v-model="startTime"
            :max-time="endTime"
            class="mr-4"
            placeholder="开始时间"
            start="08:30"
            step="00:15"
            end="22:30"
            @change="selectTime1"
          />
          <span style="margin: 0 20px" v-if="formLabelAlign.trigger_ways !== 'once'">至</span>
          <el-time-select
            v-if="formLabelAlign.trigger_ways !== 'once'"
            v-model="endTime"
            :min-time="startTime"
            placeholder="结束时间"
            start="08:30"
            step="00:15"
            end="22:30"
            @change="selectTime2"
          />
        </div>
      </el-form-item>
      <el-form-item label="间隔时间" v-if="formLabelAlign.trigger_ways === 'period'">
        <el-select v-model="formLabelAlign.trigger_interval" placeholder="">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in IntervalList" :key="'IntervalList' + index" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="next-form-item">
      <label>
        <span>代码变更时定时器触发<svg-icon iconName="icon-bangzhu"></svg-icon></span>
        <el-checkbox v-model="formLabelAlign.checked" label="" size="large" disabled />
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import bus from '@/utils/bus'

const emit = defineEmits(['formLabelAlign'])
const startTime = ref('08:30')
const endTime = ref('18:30')
const formLabelAlign = ref({
  trigger_ways: 'period',
  trigger_week: <any>[6],
  trigger_time: null,
  trigger_interval: '5',
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
      arr.push(Number(item.value))
    }
  })
  formLabelAlign.value.trigger_week = arr
  if (formLabelAlign.value.trigger_week.length === 0) {
    weeks.value[5].active = true
    formLabelAlign.value.trigger_week = [weeks.value[5].value]
  }
}

function selectTime1(val) {
  startTime.value = val
  formLabelAlign.value.trigger_ways === 'period'
    ? (formLabelAlign.value.trigger_time = [startTime.value, endTime.value])
    : (formLabelAlign.value.trigger_time = [startTime.value])
}

function selectTime2(val) {
  endTime.value = val
  formLabelAlign.value.trigger_time = [startTime.value, endTime.value]
}

watch(
  () => formLabelAlign.value,
  () => {
    formLabelAlign.value.trigger_time =
      formLabelAlign.value.trigger_ways === 'period' ? [startTime.value, endTime.value] : [startTime.value]
    emit('formLabelAlign', formLabelAlign.value)
  },
  { deep: true }
)

// 获取缓存触发设置数据
const getTriggerSettingData = val => {
  startTime.value = val.trigger_time[0]
  endTime.value = val.trigger_time[1] ? val.trigger_time[1] : '18:30'
  mateWeeks(val.trigger_week)
  for (const key in val) {
    if (formLabelAlign.value.hasOwnProperty(key)) {
      formLabelAlign.value[key] = val[key]
    }
  }
}

function mateWeeks(val) {
  for (let i = 0; i < val.length; i++) {
    for (let j = 0; j < weeks.value.length; j++) {
      if (val[i] === Number(weeks.value[j].value)) {
        weeks.value[j].active = true
      }
    }
  }
}

onMounted(() => {
  bus.on('TriggerSettingData', getTriggerSettingData)
})
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
  .selectTime-wrap {
    display: flex;
    justify-content: space-between;
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
