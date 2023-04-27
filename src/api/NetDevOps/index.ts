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
