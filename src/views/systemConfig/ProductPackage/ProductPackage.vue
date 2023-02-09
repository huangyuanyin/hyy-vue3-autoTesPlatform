<template>
  <el-card class="build-card" shadow="never">
    <el-upload class="upload-demo" :show-file-list="false" action="action" :http-request="handleUpload" :on-success="handleSuccess">
      <el-button type="primary" style="margin-bottom: 20px" :auto-upload="false"> 上传包 </el-button>
    </el-upload>
    <el-button type="primary" @click="openDownloadDialog = true" style="margin-left: 20px" :auto-upload="false"> 拉取包 </el-button>
    <el-table :data="state.buildData" border stripe height="62vh">
      <el-table-column prop="name" label="包名称" align="center" />
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
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

const openDownloadDialog = ref(false)
const buildCurrentPage = ref(1)
const buildPageSize = ref(10)
const buildTotal = ref(0)
const state: any = reactive({
  buildData: [
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' },
    { name: 'ArrayOS-Rel_APV_10_4_2_43.array' }
  ] // 包列表数据
})

// 删除
const handleDelete = (type, id) => {}

// 文件上传
const handleUpload = async files => {
  if (state.buildName.includes(files.file.name)) {
    ElMessage.error('请勿重复上传该文件！')
    return false
  }
  let formData = new FormData()
  formData.append('file', files.file)
  formData.append('filetype', 'apvbuild')
  // buildUpload(formData)
}

const handleSuccess: UploadProps['onSuccess'] = () => {
  // getBuild()
}

const handleBuildSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleBuildCurrentChange = (val: number) => {
  // groupCurrentPage.value = val
  // getD_group(groupCurrentPage.value)
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
