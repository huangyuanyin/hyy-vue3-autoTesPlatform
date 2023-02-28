<template>
  <el-card class="build-card" shadow="never">
    <el-button type="primary" @click="openUploadDialog = true" style="margin-bottom: 20px"> 上传包 </el-button>
    <el-button type="primary" @click="openDownloadDialog = true" style="margin-left: 20px; margin-bottom: 20px"> 拉取包 </el-button>
    <el-table :data="state.buildData" border stripe>
      <el-table-column prop="name" label="包名称" align="center" />
      <el-table-column prop="type" label="包类别" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-popconfirm
            title="确定删除这个文件?"
            trigger="click"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            @confirm="handleDelete('build', scope.row.name)"
          >
            <template #reference>
              <el-button link type="primary" size="small">删除包</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="buildCurrentPage"
      v-model:page-size="buildPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="buildTotal"
      @size-change="handleBuildSizeChange"
      @current-change="handleBuildCurrentChange"
    />
  </el-card>
  <UploadPackage :dialog="openUploadDialog" @cancel="closeUploadPackage" />
  <PullPackage :dialog="openDownloadDialog" @cancel="closePullPackage" />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import PullPackage from './components/PullPackage.vue'
import UploadPackage from './components/UploadPackage.vue'

const openDownloadDialog = ref(false)
const openUploadDialog = ref(false)
const buildCurrentPage = ref(1)
const buildPageSize = ref(10)
const buildTotal = ref(0)
const state: any = reactive({
  buildData: [
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array', type: '全量包' }
  ] // 包列表数据
})

// 删除
const handleDelete = (type, id) => {}

const handleBuildSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleBuildCurrentChange = (val: number) => {
  // groupCurrentPage.value = val
  // getD_group(groupCurrentPage.value)
}

const closePullPackage = val => {
  openDownloadDialog.value = val
}

const closeUploadPackage = val => {
  openUploadDialog.value = val
}
</script>

<style lang="scss" scoped>
.build-card {
  margin-top: 10px;
  .upload-demo {
    display: inline-block;
  }
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
}
</style>
