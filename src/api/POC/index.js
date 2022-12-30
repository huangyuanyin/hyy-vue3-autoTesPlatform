import request from '@/utils/request.js'
import qs from 'qs'

export function datas(params) {
  return request({
    url: '/datas/datas/',
    method: 'get',
    urlType: 'POC',
    params
  })
}

export function xtermApi(params) {
  return request({
    url: '/websocke',
    method: 'post',
    urlType: 'Xterm',
    data: params,
    headers: {
      'Content-Type': 'application/json' // 如果写成contentType会报错
    }
  })
}
