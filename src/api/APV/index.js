import request from '@/utils/request.js'
import qs from 'qs'

// 设备管理 - 获取
export function deviceApi(params) {
  return request({
    url: '/autoapv/device/',
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 设备管理 - 添加
export function addDeviceApi(params) {
  return request({
    url: '/autoapv/device/',
    method: 'post',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 设备管理 - 编辑
export function editDeviceApi(params) {
  return request({
    url: '/autoapv/device/',
    method: 'PUT',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 设备管理 - 删除
export function deleteDeviceApi(params) {
  return request({
    url: `/autoapv/device/`,
    method: 'DELETE',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 设备类型 - 获取
export function d_typeApi(params) {
  return request({
    url: '/autoapv/d_type/',
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 设备类型 - 添加
export function addD_typeApi(params) {
  return request({
    url: '/autoapv/d_type/',
    method: 'post',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 设备类型 - 编辑
export function editD_typeApi(params) {
  return request({
    url: '/autoapv/d_type/',
    method: 'PUT',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 设备类型 - 删除
export function deleteD_typeApi(params) {
  return request({
    url: '/autoapv/d_type/',
    method: 'DELETE',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 分组管理 - 获取
export function d_groupApi(params) {
  return request({
    url: '/autoapv/d_group/',
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 分组管理 - 添加
export function addD_groupApi(params) {
  return request({
    url: '/autoapv/d_group/',
    method: 'post',
    urlType: 'APV',
    data: params
  })
}

// 分组管理 - 编辑
export function editD_groupApi(params) {
  return request({
    url: '/autoapv/d_group/',
    method: 'PUT',
    urlType: 'APV',
    data: params
  })
}

// 分组管理 - 删除
export function deleteD_groupApi(params) {
  return request({
    url: `/autoapv/d_group/`,
    method: 'DELETE',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}
