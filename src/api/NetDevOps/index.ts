import request from '@/utils/request.js'

/* ---------------------------- /machine/device/ ---------------------------- */
export function getDeviceApi(params: any) {
  return request({
    url: '/machine/device/',
    method: 'get',
    urlType: 'NetDevOps',
    params
  })
}

export function addDeviceApi(params: any) {
  return request({
    url: '/machine/device/',
    method: 'POST',
    urlType: 'NetDevOps',
    data: params
  })
}

export function editDeviceApi(params: any) {
  return request({
    url: '/machine/device/',
    method: 'PUT',
    urlType: 'NetDevOps',
    data: params
  })
}

export function deletetDeviceApi(params) {
  return request({
    url: `/machine/device/`,
    method: 'DELETE',
    urlType: 'NetDevOps',
    params
  })
}
