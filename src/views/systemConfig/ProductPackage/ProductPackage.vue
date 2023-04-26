<template>
  <el-card class="build-card" shadow="never">
    <el-button type="primary" @click="handleEdit('add')" style="margin-bottom: 20px"> 新增 </el-button>
    <!-- <el-button type="primary" @click="openDownloadDialog = true" style="margin-left: 20px; margin-bottom: 20px"> 拉取包 </el-button> -->
    <el-table :data="state.buildData" border stripe v-loading="isLoading">
      <el-table-column prop="file_name" label="包名称" align="center" />
      <el-table-column prop="type" label="包类别" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'baseline'" type="success">待测版本</el-tag>
          <el-tag v-else type="warning">release版本</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标识" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.title === 'sar'" type="primary">信创</el-tag>
          <el-tag v-else type="info">非信创</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_mod_time" label="更新时间" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit('edit', scope.row.id)">编辑</el-button>
          <el-popconfirm
            title="确定删除这个文件?"
            trigger="click"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
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
  <UploadPackage :dialog="openUploadDialog" :dialogTitle="dialogTitle" :dialogId="dialogId" @cancel="closeUploadPackage" />
  <PullPackage :dialog="openDownloadDialog" @cancel="closePullPackage" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import PullPackage from './components/PullPackage.vue'
import UploadPackage from './components/UploadPackage.vue'
import { getProductPackageApi, deleteProductPackageApi } from '@/api/NetDevOps/index'
import { ElMessage } from 'element-plus'

const openDownloadDialog = ref(false)
const openUploadDialog = ref(false)
const dialogTitle = ref('')
const dialogId = ref(null)
const buildCurrentPage = ref(1)
const buildPageSize = ref(10)
const buildTotal = ref(0)
const isLoading = ref(false)
const state: any = reactive({
  buildData: [] // 包列表数据
})

const handleEdit = (type: String, id?: number) => {
  openUploadDialog.value = true
  if (type === 'add') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    dialogId.value = id
  }
}

// 删除
const handleDelete = async id => {
  let res = await deleteProductPackageApi(id)
  if (res.code === 1000) {
    buildCurrentPage.value = 1
    ElMessage.success('删除成功')
    getProductPackage()
  }
}

const handleBuildSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleBuildCurrentChange = (val: number) => {
  buildCurrentPage.value = val
  getProductPackage()
}

const closePullPackage = val => {
  openDownloadDialog.value = val
}

const closeUploadPackage = val => {
  openUploadDialog.value = val
  buildCurrentPage.value = 1
  dialogId.value = null
  getProductPackage()
}

const getProductPackage = async () => {
  const params = {
    page: buildCurrentPage.value,
    page_size: buildPageSize.value
  }
  isLoading.value = true
  let res = await getProductPackageApi(params)
  isLoading.value = false
  if (res.code === 1000) {
    state.buildData = res.data || []
    buildTotal.value = res.total
  }
}

onMounted(() => {
  getProductPackage()
})
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
