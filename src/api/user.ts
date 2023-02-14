import request from '@/utils/request.js'

export function login(data: any) {
  return request({
    url: '/forum/login/',
    method: 'post',
    urlType: 'Login',
    data
  })
}
