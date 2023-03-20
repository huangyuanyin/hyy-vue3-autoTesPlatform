import request from '@/utils/request.js'

export function login(data: any) {
  return request({
    url: '/forum/login/',
    method: 'post',
    urlType: 'Login',
    data
  })
}

// 服务分组 - 获取
export function getCategoryApi() {
  return request({
    url: '/product/category/',
    method: 'Get',
    urlType: 'NetConsole'
  })
}

// 产品服务 - 获取（全部）
export function getProductApi() {
  return request({
    url: '/product/provider/',
    method: 'Get',
    urlType: 'NetConsole'
  })
}
