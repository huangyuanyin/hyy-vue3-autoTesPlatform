import request from '@/utils/request.js'
import qs from 'qs'

// build管理 - 获取
export function buildApi(params) {
  return request({
    url: '/base/files/',
    method: 'get',
    urlType: 'APV',
    params
  })
}

// build管理 - 上传文件
export function buildUploadApi(params) {
  return request({
    url: '/base/files/',
    method: 'post',
    urlType: 'APV',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// build管理 - 删除
export function deleteBuildApi(params) {
  return request({
    url: '/base/files/',
    method: 'DELETE',
    urlType: 'APV',
    params
  })
}
