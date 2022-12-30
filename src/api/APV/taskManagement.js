import request from '@/utils/request.js'
import qs from 'qs'

// 任务管理 - 获取
export function taskApi(params) {
  return request({
    url: '/autoapv/task/',
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 任务管理 - 添加
export function addTaskApi(params) {
  return request({
    url: '/autoapv/task/',
    method: 'post',
    urlType: 'APV',
    data: params
  })
}

// 任务管理 - 编辑
export function editTaskApi(params) {
  return request({
    url: '/autoapv/task/',
    method: 'PUT',
    urlType: 'APV',
    data: params
  })
}

// 任务管理 - 删除
export function deleteTaskApi(params) {
  return request({
    url: `/autoapv/task/`,
    method: 'DELETE',
    urlType: 'APV',
    params
  })
}

// 获取任务执行进度包含（任务日志/用例进度）
export function taskRunApi(params) {
  return request({
    url: `/autoapv/taskrun/`,
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 任务start or stop
export function taskStatusApi(params) {
  return request({
    url: `/autoapv/taskrun/`,
    method: 'post',
    urlType: 'APV',
    data: qs.stringify(params)
  })
}

// 增加测试环境
export function putTestPlatApi(params) {
  return request({
    url: `/autoapv/taskrun/`,
    method: 'PUT',
    urlType: 'APV',
    data: params
  })
}

// 移除测试环境
export function deleteTestPlatApi(params) {
  return request({
    url: `/autoapv/taskrun/`,
    method: 'delete',
    urlType: 'APV',
    params
  })
}

// 获取用例集
export function getCaseApi(params) {
  return request({
    url: `/autoapv/case/`,
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 获取用例集 - 刷新
export function getCaseRefreshApi(params) {
  return request({
    url: `/autoapv/case/`,
    method: 'put',
    urlType: 'APV',
    params
  })
}

// 获取参数配置列表
export function getTaskConfigApi(params) {
  return request({
    url: `/autoapv/task_config/`,
    method: 'get',
    urlType: 'APV',
    params
  })
}
