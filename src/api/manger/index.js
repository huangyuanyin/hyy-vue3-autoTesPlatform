import axios from '@/utils/request.js'

export function getInfo() {
  return axios.post('/admin/getinfo')
}
