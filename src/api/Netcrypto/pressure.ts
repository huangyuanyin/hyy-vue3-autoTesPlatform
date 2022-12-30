import request from '@/utils/request.js'
import axios, { Axios, AxiosResponse, AxiosRequestConfig } from 'axios'

declare module "axios" {
	interface AxiosResponse<T = any> {
		errorinfo: null;
		code: null;
		msg: '',
		data: T,
		url:'',
	}
	export function create(config?: AxiosRequestConfig): AxiosInstance;
}

// import Vue from 'vue'
// // const urlPath = localStorage.getItem('BASE_URL')
// function getBaseUrl() {
//   return Vue.prototype.BASE_URL
// }

// /*
//   获取API接口
// */
// export const getApi = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/select_Api/`, params).then(res => res.data); 
// };

// /*
//   新增API接口
// */
// export const addApi = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/add_Api/`, params).then(res => res.data); 
// };

// /*
//   修改API接口
// */
// export const updateApi = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/update_Api/`, params).then(res => res.data); 
// };

// /*
//   删除API接口
// */
// export const removeApi = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/delete_Api/`, params).then(res => res.data); 
// };

// /*
//   复制API接口
// */
// export const copyApi = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/copy_api/`, params).then(res => res.data); 
// };

// /*
//   获取模板类列表
// */
// export const getTempClass = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/class_List/`, params).then(res => res.data); 
// };

// /*
//   获取API接口参数列表
// */
// export const getParam = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/param_List/`, params).then(res => res.data); 
// };

/*
	获取压测数据模板列表
*/
export const getPlain = params => {
	return request({
		url: '/pressure/plain_List/',
		method: 'post',
		urlType: 'Netcrypto',
		data: params
	})
};

// /*
//   获取接口项目列表
// */
// export const getProjApi = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/select_Pj/`, params).then(res => res.data); 
// };

// /*
//   获取配置文件
// */
// export const getConfig = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/select_Config/`, params).then(res => res.data); 
// };

// /*
//   获取配置文件列表
// */
// export const getConfigList = params => { 
//   return axios.post(`${getBaseUrl()}/pressure/config_List/`, params).then(res => res.data); 
// };

