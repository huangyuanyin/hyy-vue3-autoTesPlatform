<template>
  <el-tabs type="border-card" v-model="tabValue">
    <el-tab-pane label="主线版本" name="主线版本">
      <div class="build-card">
        <el-button type="primary" :icon="CirclePlus" @click="handleEdit('addMain')" style="margin-bottom: 20px"> 新增 </el-button>
        <el-table :data="state.mainProductPackageData" border stripe v-loading="isLoading">
          <el-table-column prop="file_name" label="包名称" align="center" width="500" />
          <el-table-column prop="type" label="包类别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.type === 'project'" type="success">待测版本</el-tag>
              <el-tag v-else type="warning">release版本</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_user" label="创建人" align="center" width="150" />
          <el-table-column prop="last_mod_time" label="更新时间" align="center" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleEdit('editMain', scope.row.id)">编辑</el-button>
              <el-popconfirm
                title="确定删除这个文件?"
                trigger="click"
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                @confirm="handleDelete('deleteMain', scope.row.id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="mainCurrentPage"
          v-model:page-size="mainPageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, prev, pager, next, jumper"
          :total="mainTotal"
          @size-change="handleMainSizeChange"
          @current-change="handleMainCurrentChange"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane label="项目版本" name="项目版本">
      <div class="build-card">
        <el-button type="primary" :icon="CirclePlus" @click="handleEdit('addBuild')" style="margin-bottom: 20px"> 新增 </el-button>
        <!-- <el-button type="primary" @click="openDownloadDialog = true" style="margin-left: 20px; margin-bottom: 20px"> 拉取包 </el-button> -->
        <el-table :data="state.buildData" border stripe v-loading="isLoading">
          <el-table-column prop="file_name" label="包名称" align="center" width="500" />
          <el-table-column prop="type" label="包类别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.type === 'project'" type="success">待测版本</el-tag>
              <el-tag v-else type="warning">release版本</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标识" align="center" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.title === 'sar'">信创</el-tag>
              <el-tag v-else type="info">非信创</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_user" label="创建人" align="center" width="150" />
          <el-table-column prop="last_mod_time" label="更新时间" align="center" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleEdit('editBuild', scope.row.id)">编辑</el-button>
              <el-popconfirm
                title="确定删除这个文件?"
                trigger="click"
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                @confirm="handleDelete('deleteBuild', scope.row.id)"
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
      </div>
    </el-tab-pane>
  </el-tabs>
  <UploadPackage :dialog="openUploadDialog" :dialogTitle="dialogTitle" :dialogId="dialogId" @cancel="closeUploadPackage" />
  <PullPackage :dialog="openDownloadDialog" @cancel="closePullPackage" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import PullPackage from './components/PullPackage.vue'
import UploadPackage from './components/UploadPackage.vue'
import { getProductPackageApi, deleteProductPackageApi, getMainProductPackageApi, deleteMainProductPackageApi } from '@/api/NetDevOps/index'
import { ElMessage } from 'element-plus'
import { CirclePlus, Search } from '@element-plus/icons-vue'

const openDownloadDialog = ref(false)
const openUploadDialog = ref(false)
const dialogTitle = ref('')
const dialogId = ref(null)
const buildCurrentPage = ref(1)
const buildPageSize = ref(10)
const buildTotal = ref(0)
const mainCurrentPage = ref(1)
const mainPageSize = ref(10)
const mainTotal = ref(0)
const isLoading = ref(false)
const tabValue = ref('主线版本')
const state: any = reactive({
  buildData: [], // 包列表数据
  mainProductPackageData: [] // 主线版本列表
})

const handleEdit = (type: String, id?: number) => {
  openUploadDialog.value = true
  switch (type) {
    case 'addBuild':
      dialogTitle.value = '新增项目版本'
      break
    case 'editBuild':
      dialogTitle.value = '编辑项目版本'
      dialogId.value = id
      break
    case 'addMain':
      dialogTitle.value = '新增主线版本'
      break
    case 'editMain':
      dialogTitle.value = '编辑主线版本'
      dialogId.value = id
      break
  }
}

const handleDelete = async (type, id) => {
  let res = type === 'deleteMain' ? await deleteMainProductPackageApi(id) : await deleteProductPackageApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    if (type === 'deleteMain') {
      mainCurrentPage.value = 1
      getMainProductPackage()
    } else {
      buildCurrentPage.value = 1
      getProductPackage()
    }
  }
}

const handleBuildSizeChange = (val: number) => {}
const handleBuildCurrentChange = (val: number) => {
  buildCurrentPage.value = val
  getProductPackage()
}

const handleMainSizeChange = (val: number) => {}
const handleMainCurrentChange = (val: number) => {
  mainCurrentPage.value = val
  getMainProductPackage()
}

const closePullPackage = val => {
  openDownloadDialog.value = val
}

const closeUploadPackage = val => {
  openUploadDialog.value = val
  dialogId.value = null
  buildCurrentPage.value = 1
  getProductPackage()
  mainCurrentPage.value = 1
  getMainProductPackage()
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
    // @ts-ignore
    buildTotal.value = res.total
  }
}

const getMainProductPackage = async () => {
  const params = {
    page: mainCurrentPage.value,
    page_size: mainPageSize.value
  }
  let res = await getMainProductPackageApi(params)
  if (res.code === 1000) {
    state.mainProductPackageData = res.data || []
    // @ts-ignore
    mainTotal.value = res.total
  }
}

onMounted(() => {
  getMainProductPackage()
  getProductPackage()
})
</script>

<style lang="scss" scoped>
.build-card {
  margin: 15px 0 0 20px;
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
