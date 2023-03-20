import request from '@/utils/request.js'

/* ---------------------------- /machine/device/ ---------------------------- */
export function getDeviceApi(params: any) {
  return request({
    url: '/machine/device/',
    method: 'get',
    urlType: 'NetDevOps',
    data: params
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
