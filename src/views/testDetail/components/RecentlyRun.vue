<template>
  <div class="RecentlyRun-wrap">
    <section class="recentlyRun-top">
      <div class="recentlyRun-top-left">
        <div class="left-label">
          <span class="build-num"> # 1</span>
          <div class="status-label">
            <el-icon color="#F56C6C"><CircleCloseFilled /></el-icon>
            <span>运行失败</span>
          </div>
        </div>
        <div class="left-info">
          <span class="info-label">触发信息</span>
          <div class="instance-trigger-info">
            <div class="title">huangyuanyin</div>
            &nbsp;•&nbsp;页面手动触发
          </div>
          <div class="info-divider"></div>
          <span class="info-label">开始时间</span>
          <span>2023-04-28 14:29:26</span>
          <div class="info-divider"></div>
          <span class="info-label">持续时间</span>
          <span>16s</span>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="流水线从开始运行到运行结束的间隔时长，并非流水线实际的计费耗时，流水线计费耗时规则"
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
        <div class="flow-groups">
          <div class="flow-group">
            <div class="group-head">构建</div>
            <div class="stages">
              <div class="stage">
                <div class="card first-stage">
                  <div class="content-job">
                    <div class="job-card">
                      <el-icon class="status-icon success"><SuccessFilled /></el-icon>
                      <div class="card-content">
                        <div class="card-title">java代码扫描</div>
                        <div class="card-info">
                          <span>15s</span>
                          <div class="operate">
                            <div class="report">
                              <el-icon><Document /></el-icon> <span>扫描报告</span>
                            </div>
                            <div class="log">
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
                    </div>
                  </div>
                </div>
                <div class="card first-stage">
                  <div class="content-job">
                    <div class="job-card">
                      <el-icon class="status-icon success"><SuccessFilled /></el-icon>
                      <div class="card-content">
                        <div class="card-title">java代码扫描</div>
                        <div class="card-info">
                          <span>15s</span>
                          <div class="operate">
                            <div class="report">
                              <el-icon><Document /></el-icon> <span>扫描报告</span>
                            </div>
                            <div class="log">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-group-splitline">
            <div
              style="width: 10px; height: 10px; position: absolute; top: 13.5%; left: 40%; border-radius: 50%; background-color: #dbdbdb"
            ></div>
          </div>
        </div>
        <div class="flow-groups">
          <div class="flow-group">
            <div class="group-head">部署</div>
            <div class="stages">
              <div class="stage">
                <div class="card">
                  <div class="content-job">
                    <div class="job-card">
                      <el-icon class="status-icon success"><SuccessFilled /></el-icon>
                      <div class="card-content">
                        <div class="card-title">java代码扫描</div>
                        <div class="card-info">
                          <span>15s</span>
                          <div class="operate">
                            <div class="report">
                              <el-icon><Document /></el-icon> <span>扫描报告</span>
                            </div>
                            <div class="log">
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
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="content-job">
                    <div class="job-card">
                      <el-icon class="status-icon fail"><CircleCloseFilled /></el-icon>
                      <div class="card-content fail-card">
                        <div class="card-title">环境部署</div>
                        <div class="card-info">
                          <span>2分14s</span>
                          <div class="operate">
                            <div class="log">
                              <el-icon><Document /></el-icon> <span>日志</span>
                            </div>
                          </div>
                        </div>
                        <div class="message">
                          <div>运行失败，请查看日志！</div>
                        </div>
                        <div class="button">
                          <div>重试</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-group-splitline">
            <div
              style="width: 10px; height: 10px; position: absolute; top: 13.5%; left: 40%; border-radius: 50%; background-color: #dbdbdb"
            ></div>
          </div>
        </div>
        <div class="flow-groups">
          <div class="flow-group">
            <div class="group-head">接口测试</div>
            <div class="stages">
              <div class="stage">
                <div class="card wait-card">
                  <div class="content-job">
                    <div class="job-card">
                      <el-icon class="status-icon waiting"><Eleme /></el-icon>
                      <div class="card-content">
                        <div class="card-title">接口测试</div>
                        <div class="card-info">
                          <span>0s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-group-splitline">
            <div
              style="width: 10px; height: 10px; position: absolute; top: 13.5%; left: 40%; border-radius: 50%; background-color: #dbdbdb"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  CirclePlusFilled,
  CaretRight,
  CaretBottom,
  RemoveFilled,
  Plus,
  CircleCloseFilled,
  QuestionFilled,
  SuccessFilled,
  Document,
  Eleme
} from '@element-plus/icons-vue'

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
            .stage {
              .card {
                position: relative;
                display: flex;
                align-items: center;
                margin: 0 14px;
                height: 200px;
                position: relative;
                cursor: pointer;
                &::before {
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

                &:first-child::before {
                  border-left: none;
                  border-right: none;
                  border-radius: 0 !important;
                }

                &:nth-last-child(2)::before {
                  border-radius: 0 0 16px 16px;
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
                  .fail {
                    color: #e62412;
                  }
                  .success {
                    color: #22b066;
                  }
                  .waiting {
                    color: #909399;
                  }
                  .fail-card {
                    border-left-color: #f7aaa3 !important;
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
                    .card-info {
                      padding: 10px 20px 16px 23px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
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
                display: flex;
                align-items: flex-start;
                .card-content {
                  height: 75px !important;
                  border-left-color: #dbdbdb !important;
                }
                .content-job {
                  margin-top: 5%;
                }
              }
              .first-stage {
                &::before {
                  left: 3px;
                  width: 105%;
                  border-left: none !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
