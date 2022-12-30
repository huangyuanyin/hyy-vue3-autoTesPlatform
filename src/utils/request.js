import axios from 'axios'
import { ElMessage } from 'element-plus'
// import { useCookies } from '@vueuse/integrations/useCookies'
import { getToken } from './auth'
import baseUrl from '@/config/api'
const service = axios.create({
  // baseURL: "http://10.20.70.89:8082", // 登录
  timeout: 120000
})

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 往header头中自动添加token
    const hastoken = getToken()
    if (
      hastoken &&
      config.url !== '/forum/login/' &&
      config.url !== '/datas/datas/' &&
      config.url !== '/WEBt/terminals/' &&
      config.url !== '/autoapv/device/' &&
      config.url !== '/autoapv/d_type/' &&
      config.url !== '/autoapv/d_group/' &&
      config.url !== '/autoapv/task/' &&
      config.url !== '/base/build/' &&
      config.url !== '/base/files/' &&
      config.url !== '/autoapv/taskrun/' &&
      config.url !== '/autoapv/case/' &&
      config.url !== '/autoapv/task_config/' &&
      config.url !== '/autoapv/report/'
    ) {
      config.headers['Authorization'] = hastoken
    }
    switch (config.urlType) {
      case 'POC':
        config.url = baseUrl.Base_POC_URL + config.url
        break
      case 'Xterm':
        config.url = baseUrl.Base_Xterm_URL + config.url
        break
      case 'Login':
        config.url = baseUrl.Base_Login_URL + config.url
        break
      case 'APV':
        config.url = baseUrl.Base_APV_URL + config.url
        break
      case 'Netcrypto':
        config.url = baseUrl.Base_NETCRYPTO_URL + config.url
        break
      case 'crypto':
        config.url = baseUrl.Base_NETCRYPTO_CRYPTO_URL + config.url
        break
    }
    // 请求拦截进来 显示loading效果
    return config
  },
  function (error) {
    // 对请求错误做些什么
    // return Promise.reject(error);
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.data.code != '1000') {
      ElMessage({
        message: response.data?.msg || '请求失败',
        type: 'error',
        duration: 3500
      })
      // return Promise.reject(response.data);
    } else {
      return response.data
    }
  },
  function (error) {
    // 对响应错误做点什么
    ElMessage({
      message: error.data?.msg || '请求失败',
      type: 'error',
      duration: 3500
    })
    // return Promise.reject(error);
  }
)

export default service
