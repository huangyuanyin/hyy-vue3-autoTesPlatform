<template>
  <div class="RecentlyRun-wrap">
    <section class="recentlyRun-top">
      <div class="recentlyRun-top-left">
        <div class="left-label">
          <span class="build-num"> # {{ props.runResult.execution_number }}</span>
          <div class="status-label">
            <svg-icon
              class="status-icon"
              :class="[props.runResult.status === 'in_progress' ? 'run-icon' : '']"
              :iconName="iconType[props.runResult.status]"
              style="font-size: 16px; margin-right: 8px"
            ></svg-icon>
            <span>{{ contentType[props.runResult.status] }}</span>
          </div>
        </div>
        <div class="left-info">
          <span class="info-label">触发信息</span>
          <div class="instance-trigger-info">
            <div class="title">huangyuanyin</div>
            &nbsp;•&nbsp;手动触发
          </div>
          <div class="info-divider"></div>
          <span class="info-label">开始时间</span>
          <span>{{ props.runResult.created_time }}</span>
          <div class="info-divider"></div>
          <span class="info-label">持续时间</span>
          <span>16s</span>
          <el-tooltip
            popper-class="box-item"
            effect="customized"
            content="流水线从开始运行到运行结束的间隔时长，并非流水线实际的耗时"
            placement="top"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="recentlyRun-top-right">
        <ul class="info-list">
          <li v-for="(item, index) in infoList" :key="'infoList' + index">
            <div class="info-item">
              <span class="item-num">{{ item.num }}</span>
              <span class="item-title">{{ item.title }}</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <div class="pipeline-instance">
      <div class="pipeline-instance__content">
        <div class="flow-groups" v-for="(item, index) in groups" :key="'group' + index">
          <div class="flow-group">
            <div class="group-head">{{ item.name }}</div>
            <div class="stages" :class="[index === 0 ? 'first-stages' : '', index === groups.length - 1 ? 'last-stages' : '']">
              <div
                v-for="(e, index2) in item.task_stages_history"
                :key="'task_stages_history' + index2"
                :class="[index2 === 0 ? 'first-card' : '', index2 === groups.length - 1 ? 'last-card' : '']"
              >
                <div class="stage">
                  <div
                    class="card"
                    :class="[cardTyp[it.status]]"
                    v-for="(it, index) in e.task_details_history"
                    :key="'task_details_history' + index"
                  >
                    <div class="content-job">
                      <div class="job-card">
                        <el-tooltip popper-class="box-item" effect="customized" :content="contentType[it.status]" placement="top">
                          <svg-icon
                            class="status-icon"
                            :class="[it.status === 'in_progress' ? 'run-icon' : '']"
                            :iconName="iconType[it.status]"
                            className="icon"
                            style="width: 24px"
                          ></svg-icon>
                        </el-tooltip>
                        <div class="card-content" :class="[cardTyp[it.status]]">
                          <div class="card-title">{{ it.name }}</div>
                          <div class="success-comp" v-if="it.status === 'success'">
                            <div class="card-info">
                              <span>15s</span>
                              <div class="operate">
                                <div class="report">
                                  <!-- <el-icon><Document /></el-icon> <span>扫描报告</span> -->
                                </div>
                                <div class="log" @click="handleLog(it)">
                                  <el-icon><Document /></el-icon> <span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="card-num">
                              <div class="stat-info">
                                <div class="stat-info-item" v-for="(item, index) in statList" :key="'statList' + index">
                                  <div class="stat-info-item-value" :class="[statColor[item.title]]">{{ item.num }}</div>
                                  <div class="stat-info-item-desc">{{ item.title }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="fail-comp" v-if="it.status === 'fail'">
                            <div class="card-info">
                              <span>15s</span>
                              <div class="operate">
                                <div class="log" @click="handleLog(it)">
                                  <el-icon><Document /></el-icon><span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="message">
                              <div>运行失败，请查看日志！</div>
                            </div>
                            <div class="button" @click="handleRun(it)">
                              <div>重试</div>
                            </div>
                          </div>
                          <div class="run-comp" v-if="it.status === 'in_progress'">
                            <div class="card-info">
                              <span>15s</span>
                              <div class="operate">
                                <div class="log" @click="handleLog(it)">
                                  <!-- <el-icon><Document /></el-icon> <span>日志</span> -->
                                </div>
                              </div>
                            </div>
                            <div class="message">
                              <div>运行中...</div>
                            </div>
                            <div class="button" @click="handleChannel(it)">
                              <div>取消</div>
                            </div>
                          </div>
                          <div class="channel-comp" v-if="it.status === 'channel'">
                            <div class="card-info">
                              <span>15s</span>
                              <div class="operate">
                                <div class="log" @click="handleLog(it)">
                                  <el-icon><Document /></el-icon> <span>日志</span>
                                </div>
                              </div>
                            </div>
                            <div class="message">
                              <div>用户已取消</div>
                            </div>
                            <div class="button" @click="handleRun(it)">
                              <div>重试</div>
                            </div>
                          </div>
                          <div class="wait-comp" v-if="it.status === 'not_start'">
                            <div class="time">
                              <div>0s</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-group-splitline" v-if="index !== groups.length - 1">
            <div
              style="width: 10px; height: 10px; position: absolute; top: 13.5%; left: 40%; border-radius: 50%; background-color: #dbdbdb"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="logDialog"
      :title="logTitle"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <CodeMirror :code="log" :codeStyle="{ height: '60vh' }" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { CircleCloseFilled, QuestionFilled, SuccessFilled, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import CodeMirror from '@/components/CodeMirror.vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  runResult: {
    type: Object,
    default: () => {}
  }
})

const logDialog = ref(false)
const logTitle = ref('')
const log = ref('暂无日志...')
const cardTyp = {
  success: '',
  fail: 'fail-card',
  in_progress: 'run-card',
  not_start: 'wait-card',
  channel: 'channel-card'
}
const iconType = {
  success: 'icon-zhengque',
  fail: 'icon-cuowu',
  in_progress: 'icon-shuaxin',
  not_start: 'icon-shijian',
  channel: 'icon-cuowu'
}
const contentType = {
  success: '运行成功',
  fail: '运行失败',
  in_progress: '运行中',
  not_start: '等待中',
  channel: '已取消'
}
const infoList = ref([
  { title: '代码变更', num: 0 },
  { title: '运行产物', num: 0 },
  { title: '环境变量', num: 7 }
])
const statList = ref([
  { title: '总数', num: 2 },
  { title: '阻塞', num: 0 },
  { title: '严重', num: 0 },
  { title: '一般', num: 2 }
])
const statColor = {
  总数: 'total',
  阻塞: 'block',
  严重: 'serious',
  一般: 'yiban'
}
const groups = ref([])

watch(
  () => props.runResult,
  val => {
    groups.value = val.task_swim_lanes_history || []
  },
  {
    immediate: true
  }
)

const handleChannel = (item: any) => {
  ElMessage.warning('取消')
}

const handleLog = (item: any) => {
  logDialog.value = true
  logTitle.value = item.name
  log.value = item.task_execute_record[0].execute_record
}

const handleRun = (item: any) => {
  ElMessage.warning('重试')
}

const handleClose = (done: () => void) => {
  done()
}
</script>

<style lang="scss" scoped>
.RecentlyRun-wrap {
  padding: 0 32px;
  .recentlyRun-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .recentlyRun-top-left {
      display: flex;
      flex-direction: column;
      .left-label {
        display: flex;
        margin-bottom: 8px;
        .build-num {
          font-size: 16px;
          color: #292929;
          line-height: 24px;
          font-weight: 600;
        }
        .status-label {
          margin-left: 12px;
          font-size: 14px;
          display: flex;
          align-items: center;
          span {
            color: #575757;
          }
          .el-icon {
            font-size: 18px;
            margin-right: 10px;
          }
        }
      }
      .left-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        .info-label {
          color: #8b8b8b;
          margin-right: 8px;
        }
        .instance-trigger-info {
          display: flex;
        }
        .info-divider {
          position: relative;
          top: -0.06em;
          display: inline-block;
          width: 1px;
          background: #e9edf0;
          height: 1em;
          margin: 0 8px;
          vertical-align: middle;
        }
        .el-icon {
          margin-left: 8px;
          cursor: pointer;
          color: #6e6e6e;
          font-size: 16px;
        }
      }
    }
    .recentlyRun-top-right {
      .info-list {
        display: flex;
        align-items: center;
        li {
          margin-right: 24px;
          list-style: none;
          .info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .item-num {
              font-size: 26px;
              font-family: DINPro;
            }
            .item-title {
              font-size: 14px;
              color: #6e6e6e;
            }
          }
        }
        li:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .pipeline-instance {
    padding: 1px 0px 16px;
    height: 70vh;
    .pipeline-instance__content {
      display: flex;
      box-shadow: 0 0 0 1px #e9edf0;
      background-color: #f2f5f7;
      border-radius: 4px;
      height: 100%;
      overflow: auto;
      .flow-groups {
        display: flex;
        height: 100%;
        .flow-group-splitline {
          position: relative;
          width: 48px;
          height: 100%;
          &::before {
            content: '';
            position: absolute;
            left: 50%;
            height: 100%;
            border-left: 1px solid #dbdbdb;
          }
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            width: 48px;
            border-top: 1px solid #dbdbdb;
            margin-left: -24px;
            top: 95px;
          }
          > svg {
            position: absolute;
            left: 50%;
            width: 20px;
            top: 86px;
            margin-left: -10px;
            z-index: 2;
            cursor: pointer;
          }
        }
        .flow-group {
          padding-top: 20px;
          padding-left: 20px;
          .group-head {
            color: #575757;
            font-size: 14px;
          }
          .stages {
            margin-top: 10px;
            .first-card {
              .card {
                &::before {
                  border-right: none !important;
                }
              }
            }
            .stage {
              display: flex;
              .card {
                position: relative;
                display: flex;
                align-items: center;
                margin: 0 14px;
                height: 200px;
                position: relative;
                cursor: pointer;
                &::before {
                  pointer-events: none;
                  content: '';
                  position: absolute;
                  left: -12%;
                  top: -77%;
                  border-left: 1px solid #dbdbdb;
                  border-right: 1px solid #dbdbdb;
                  border-bottom: 1px solid #dbdbdb;
                  width: 118%;
                  height: 100%;
                }

                .content-job {
                  display: flex;
                  align-items: center;
                  margin-left: 10px;
                  margin-right: 10px;
                }
                .job-card {
                  position: relative;
                  .status-icon {
                    position: absolute;
                    top: 18px;
                    left: -9px;
                    z-index: 9;
                    font-size: 24px;
                  }
                  .fail,
                  .channel {
                    color: #e62412;
                  }
                  .success {
                    color: #22b066;
                  }
                  .in_progress {
                    color: #409eff;
                  }
                  .not_start {
                    color: #909399;
                  }
                  .fail-card {
                    border-left-color: #f7aaa3 !important;
                    .card-title {
                      flex: 1;
                    }
                  }
                  .wait-card {
                    border-left-color: #dae0e5 !important;
                  }
                  .run-card {
                    border-left-color: #75c0f2 !important;
                    .card-title {
                      flex: 1;
                    }
                  }
                  .channel-card {
                    border-left-color: #f7aaa3 !important;
                    .card-title {
                      flex: 1;
                    }
                  }
                  .card-content {
                    height: 165px;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03), 0 0 0 1px #e8e8e8;
                    transition: box-shadow 0.2s ease-in, -webkit-box-shadow 0.2s ease-in;
                    border-left: 4px solid #90deb5;
                    display: flex;
                    flex-direction: column;
                    border-radius: 4px;
                    width: 288px;
                    margin: 1px;
                    position: relative;
                    .card-title {
                      padding: 16px 23px 0 23px;
                      background-color: #fff;
                      border-radius: 0 4px 0 0;
                      font-weight: 600;
                      color: #292929;
                      font-size: 14px;
                    }
                    .wait-comp {
                      .time {
                        background-color: #fff;
                        padding: 10px 20px 16px 23px;
                        color: #8b8b8b;
                        font-size: 12px;
                      }
                    }
                    .run-comp {
                      .message {
                        color: #1b9aee;
                      }
                      .button {
                        color: #e62412;
                      }
                    }
                    .card-info {
                      padding: 10px 20px 16px 23px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      flex: 1;
                      background-color: #fff;
                      span {
                        color: #8b8b8b;
                        font-size: 12px;
                      }
                      .operate {
                        display: flex;
                        align-items: center;
                        .report,
                        .log {
                          display: flex;
                          align-items: center;
                          .el-icon {
                            margin-right: 5px;
                            color: #8b8b8b;
                          }
                        }
                        .log {
                          margin-left: 20px;
                        }
                      }
                    }
                    .message {
                      background-color: #f0f9ff;
                      padding: 12px 20px 12px 16px;
                      border-top: 1px solid #e8e8e8;
                      color: #e62412;
                      font-size: 12px;
                      line-height: 18px;
                    }
                    .button {
                      flex: 1;
                      border-top: 1px solid #e8e8e8;
                      padding-right: 20px;
                      background-color: #fff;
                      color: #1b9aee;
                      font-size: 12px;
                      line-height: 40px;
                      text-align: end;
                    }
                    .card-num {
                      background-color: #fff;
                      border-top: 1px solid #e8e8e8;
                      padding: 12px 20px 12px 23px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      .stat-info {
                        display: flex;
                        justify-content: space-around;
                        width: 100%;
                        .stat-info-item {
                          min-width: 20%;
                          height: 58px;
                          padding: 4px 0;
                          .stat-info-item-value {
                            font-size: 20px;
                            font-family: DINPro;
                          }
                          .total {
                            color: #e62412;
                          }
                          .block {
                            color: #f56c6c;
                          }
                          .serious {
                            color: #fa8c15;
                          }
                          .yiban {
                            color: #8b8b8b;
                          }
                          .stat-info-item-desc {
                            font-size: 12px;
                            color: #8b8b8b;
                          }
                        }
                      }
                    }
                  }
                }
              }

              .wait-card {
                display: flex !important;
                flex-direction: column !important;
                .card-content {
                  height: 75px !important;
                  border-left-color: #dbdbdb !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
            }
          }
          .first-stages {
            .card {
              &::before {
                left: 3px !important;
                width: 105% !important;
                border-left: none !important;
              }
            }
          }
          .last-stages {
            .card {
              &::before {
                right: -3px !important;
                width: 105% !important;
                border-left: none !important;
                border-right: none !important;
              }
            }
          }
        }
      }
    }
  }
  .run-icon {
    animation: run 0.7s infinite;
  }
  @keyframes run {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>

<style lang="scss">
.box-item {
  padding: 6px 12px !important;
  background: linear-gradient(90deg, rgb(98, 101, 111), rgb(98, 101, 111)) !important;
  color: #fff;
}

.box-item .el-popper__arrow::before {
  background: linear-gradient(45deg, #626f6f, #626f6f) !important;
  right: 0 !important;
}
</style>
