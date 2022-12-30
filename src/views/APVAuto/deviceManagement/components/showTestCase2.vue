<template>
  <el-table :data="casesTableData" :border="parentBorder" style="width: 100%" stripe>
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <h3>模块数详情：</h3>
          <div class="card-wrap">
            <el-card v-if="props.row.headList.length >= 0">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(0, 6)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 5">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(6, 11)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 10">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(11, 16)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 15">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(16, 21)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 20">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(21, 26)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 25">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(26, 31)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 30">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(31, 36)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 35">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(36, 41)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 40">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(41, 46)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
            <el-card v-if="props.row.headList.length >= 46">
              <el-table style="width: 100%; margin: 10px" :data="props.row.valueList" :border="childBorder" :show-header="true">
                <el-table-column prop="数量" label="模块名" align="center">数量</el-table-column>
                <el-table-column
                  v-for="(item, index) in props.row.headList.slice(46, 51)"
                  :key="index"
                  :prop="item.value"
                  :label="item.key"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="版本名" prop="name" />
    <el-table-column label=" 用例数" prop="value" />
    <el-table-column label="模块数" prop="moduleLength" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { getCaseApi } from '@/api/APV/taskManagement.js'

const parentBorder = ref(false)
const childBorder = ref(false)
const casesTableData = ref([])

const optionsProps = {
  label: 'name',
  value: 'name'
}
// 调用 获取用例集接口
const getCase = async () => {
  let res = await getCaseApi()
  res.data.map(item => {
    ;(item.headList = []), (item.valueList = []), (item.moduleLength = item.children.length)
  })
  casesTableData.value = res.data || []
  await handleData(casesTableData.value)
}

// 处理用例集数据展示
const handleData = data => {
  data.map(val => {
    let headList: any = [{ key: '模块名', value: 'taghead' }]
    let valueList: any = [
      {
        taghead: '数量'
      }
    ]
    val.children.map((v: any) => {
      headList.push({
        key: String(v.name),
        value: String(v.name)
      })
      valueList[0][`${v.name}`] = v.value
    })
    val.headList = headList
    val.valueList = valueList
  })
}

onMounted(() => {
  getCase()
})
</script>

<style scoped lang="scss">
.testCase {
  height: 70vh;

  :deep(.el-scrollbar .el-cascader-menu__wrap) {
    height: 100%;
  }
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.card-wrap {
  display: flex;
  flex-wrap: wrap;

  .el-card {
    width: 47%;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>
