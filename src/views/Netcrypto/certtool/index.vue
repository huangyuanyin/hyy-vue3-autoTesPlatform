<template>
  <el-tabs v-model="activeName" class="certtool-wrap">
    <el-tab-pane label="证书转换工具" name="certConvert">
      <Certconvert />
    </el-tab-pane>
    <el-tab-pane label="私钥提取" name="extractPri">
      <Extractpri />
    </el-tab-pane>
    <el-tab-pane label="批量生成证书" name="genCert">
      <Massproductioncer />
    </el-tab-pane>
    <el-tab-pane label="P10生成证书" name="p10Cert">
      <P10productioncer />
    </el-tab-pane>
    <el-tab-pane label="生成CRL" name="crlCert">
      <CRLproductioncer />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import Certconvert from './components/certconvert.vue'
import Extractpri from './components/extractpri.vue'
import Massproductioncer from './components/massproductioncer.vue'
import P10productioncer from './components/p10productioncer.vue'
import CRLproductioncer from './components/crlproductioncer.vue'
import { ref } from 'vue'

const activeName = ref('certConvert')
</script>

<style lang="scss" scoped>
.certtool-wrap {
  margin: 0 20px;
}
</style>
