import request from '@/utils/request.js'

/* ---------------------------- /devops/device_manage/ ---------------------------- */
export function getDeviceApi(params: any) {
  return request({
    url: '/devops/device_manage/',
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addDeviceApi(params: any) {
  return request({
    url: '/devops/device_manage/',
    method: 'POST',
    urlType: 'NetDevOps',
    data: params
  })
}

export function editDeviceApi(params: any) {
  return request({
    url: '/devops/device_manage/',
    method: 'PUT',
    urlType: 'NetDevOps',
    data: params
  })
}

export function deletetDeviceApi(params) {
  return request({
    url: `/devops/device_manage/${params}`,
    method: 'DELETE',
    urlType: 'NetDevOps'
  })
}

/* ---------------------------- /devops/product_package/ ---------------------------- */
export function getProductPackageApi(params: any) {
  return request({
    url: '/devops/product_package/',
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addProductPackageApi(params: any) {
  return request({
    url: '/devops/product_package/',
    method: 'POST',
    urlType: 'NetDevOps',
    data: params
  })
}

export function editProductPackageApi(params: any) {
  return request({
    url: '/devops/product_package/',
    method: 'PUT',
    urlType: 'NetDevOps',
    data: params
  })
}

export function deleteProductPackageApi(id: number) {
  return request({
    url: `/devops/product_package/${id}`,
    method: 'DELETE',
    urlType: 'NetDevOps'
  })
}

/* ---------------------------- /devops/task_info/ ---------------------------- */
export function getTaskInfoApi(params: any) {
  return request({
    url: '/devops/task_info/',
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addTaskInfoApi(params: any) {
  return request({
    url: '/devops/task_info/',
    method: 'post',
    urlType: 'NetDevOps',
    data: params
  })
}

export function editTaskInfoApi(params: any) {
  return request({
    url: '/devops/task_info/',
    method: 'put',
    urlType: 'NetDevOps',
    data: params
  })
}

export function deleteTaskInfoApi(id: number) {
  return request({
    url: `/devops/task_info/${id}`,
    method: 'DELETE',
    urlType: 'NetDevOps'
  })
}

export function runTaskInfoApi(params: any) {
  return request({
    url: `/devops/task_info/run`,
    method: 'post',
    urlType: 'NetDevOps',
    data: params
  })
}

/* ---------------------------- /devops/statistics/ ---------------------------- */

export function getStatisticsApi() {
  return request({
    url: '/devops/statistics/total',
    method: 'get',
    urlType: 'NetDevOps'
  })
}

/* ---------------------------- /devops/deploy_version/ ---------------------------- */

export function getDeployVersionApi(params) {
  return request({
    url: `/devops/deploy_version/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

/* ---------------------------- /devops/task_info/stop/ ---------------------------- */

export function stopTaskApi(params) {
  return request({
    url: `/devops/task_info/stop/`,
    method: 'POST',
    urlType: 'NetDevOps',
    data: params
  })
}

/* ---------------------------- /devops/task_history/ ---------------------------- */
export function getTaskHistoryApi(params) {
  return request({
    url: `/devops/task_history/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

/* ---------------------------- /devops/task_info/release_device/ ---------------------------- */
export function releaseDeviceApi(params) {
  return request({
    url: `/devops/task_info/release_device/`,
    method: 'POST',
    urlType: 'NetDevOps',
    data: params
  })
}

/* ---------------------------- /devops/interface/ ---------------------------- */
export function getStatisticsTotalApi(params) {
  return request({
    url: `/devops/interface/statistics/total`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function getClassNameApi(params) {
  return request({
    url: `/devops/interface/class_name`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function getMethodsApi(params) {
  return request({
    url: `/devops/interface/method_detail`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

/* ---------------------------- /devops/pipeline_group/ ---------------------------- */
export function getPipelineGroupApi(params) {
  return request({
    url: `/devops/pipeline_group/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addPipelineGroupApi(params) {
  return request({
    url: `/devops/pipeline_group/`,
    method: 'post',
    urlType: 'NetDevOps',
    data: params
  })
}

export function editPipelineGroupApi(params) {
  return request({
    url: `/devops/pipeline_group/`,
    method: 'put',
    urlType: 'NetDevOps',
    data: params
  })
}

export function deletePipelineGroupApi(id) {
  return request({
    url: `/devops/pipeline_group/${id}`,
    method: 'delete',
    urlType: 'NetDevOps'
  })
}

/* ---------------------------- /devops/task_info/update_group_tag/ ---------------------------- */
export function updateGroupTagApi(params) {
  return request({
    url: `/devops/task_info/update_group_tag/`,
    method: 'post',
    urlType: 'NetDevOps',
    data: params
  })
}

/* ---------------------------- /devops/main_product_package/ ---------------------------- */

export function getMainProductPackageApi(params) {
  return request({
    url: `/devops/main_product_package/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addMainProductPackageApi(params) {
  return request({
    url: `/devops/main_product_package/`,
    method: 'post',
    urlType: 'NetDevOps',
    data: params
  })
}

export function editMainProductPackageApi(params) {
  return request({
    url: `/devops/main_product_package/`,
    method: 'put',
    urlType: 'NetDevOps',
    data: params
  })
}

export function deleteMainProductPackageApi(id: number) {
  return request({
    url: `/devops/main_product_package/${id}`,
    method: 'DELETE',
    urlType: 'NetDevOps'
  })
}

/* ---------------------------- /devops/favorite_task/ ---------------------------- */
export function getFavoriteTaskApi(params) {
  return request({
    url: `/devops/favorite_task/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

/* ---------------------------- /devops/pipeline_tag/ ---------------------------- */
export function getPipelineTagApi(params) {
  return request({
    url: `/devops/pipeline_tag/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addPipelineTagApi(params) {
  return request({
    url: `/devops/pipeline_tag/`,
    method: 'post',
    urlType: 'NetDevOps',
    data: params
  })
}

/* ---------------------------- /devops/netsign_version/ ---------------------------- */
export function getNetsignVersionApi(params) {
  return request({
    url: `/devops/netsign_version/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

/* ---------------------------- /devops/netsign_branch/ ---------------------------- */
export function getNetsignBranchApi(params) {
  return request({
    url: `/devops/netsign_branch/`,
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}
