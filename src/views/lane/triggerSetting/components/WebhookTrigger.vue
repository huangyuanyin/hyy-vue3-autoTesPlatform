<template>
  <div class="webhookTrigger-wrap">
    <header class="header">
      <div class="header__text">Webhook触发</div>
      <div class="header__desc">外部系统通过Webhook将环境参数传给流水线并触发运行，<span class="header__link">查看文档</span></div>
    </header>
    <div class="title">将Webhook复制到你的触发器（代码仓库触发请通过 流水线代码源->开启代码提交触发 完成配置）</div>
    <div class="next-form-item">
      <el-input v-model="input" placeholder="Please input">
        <template #append>
          <el-button :icon="CopyDocument" v-copy="input"></el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'

const input = ref('http://flow-openapi.aliyun.com/pipeline/webhook/RcWjnbEL7SBhpuqdCG6k')
</script>

<style lang="scss" scoped>
.webhookTrigger-wrap {
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
  .title {
    padding: 16px 0;
    color: #292929;
    font-size: 14px;
    font-weight: 500;
  }
  .next-form-item {
    .el-input-group__append .el-button {
      font-size: 16px;
      &:hover {
        color: #1b9aee;
      }
    }
  }
}
</style>
