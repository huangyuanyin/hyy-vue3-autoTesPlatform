import request from '@/utils/request.js'
import axios, { Axios, AxiosResponse, AxiosRequestConfig } from 'axios'

declare module 'axios' {
  interface AxiosResponse<T = any> {
    errorinfo: null
    code: null
    msg: ''
    data: T
    url: ''
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance
}

// import Vue from 'vue'
// function getBaseUrl() {
// 	return Vue.prototype.BASE_URL
// }

// ================================  加密/解密 ================================//

/*
	数据哈希
*/
export const dataHash = params => {
  return request({
    url: '/crypto/data_hash/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	对称加密
*/
export const symmEncry = params => {
  return request({
    url: '/crypto/symm_encry/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	对称解密
*/
export const symmDecry = params => {
  return request({
    url: '/crypto/symm_decry/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	base64编码
*/
export const base64Encode = params => {
  return request({
    url: '/crypto/base64_encode/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	base64解码
*/
export const base64Decode = params => {
  return request({
    url: '/crypto/base64_decode/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	非对称加密
*/
export const asymmEncry = params => {
  return request({
    url: '/crypto/asymm_encry/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	非对称解密
*/
export const asymmDecry = params => {
  return request({
    url: '/crypto/asymm_decry/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	URL编码
*/
export const urlEncode = params => {
  return request({
    url: '/crypto/url_encode/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	URL解码
*/
export const urlDecode = params => {
  return request({
    url: '/crypto/url_decode/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

// ================================  签名/验签 ================================//

/*
	裸签名
*/
export const rawSign = params => {
  return request({
    url: '/crypto/raw_sign/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	裸验签
*/
export const rawVerify = params => {
  return request({
    url: '/crypto/raw_verify/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
Attach签名
*/
export const attachSign = params => {
  return request({
    url: '/crypto/py_attach_sign/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

/*
Attach验签
*/
export const attachVerify = params => {
  return request({
    url: '/crypto/py_attach_verify/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

/**
Detach签名
*/
export const detachSign = params => {
  return request({
    url: '/crypto/py_detach_sign/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

/**
Detach验签
*/
export const detachVerify = params => {
  return request({
    url: '/crypto/py_detach_verify/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

// ================================  转换工具 ================================//

/*
	证书转换
*/
export const convert = params => {
  return request({
    url: '/crypto/convert/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

/*
	证书下载
*/
export const downFile = () => {
  return request({
    url: '/crypto/downFile/',
    method: 'post',
    urlType: 'Netcrypto',
  })
}

/*
	提取私钥
*/
export const getPriKey = params => {
  return request({
    url: '/crypto/prikey_get/',
    method: 'post',
    urlType: 'Netcrypto',
    data: params
  })
}

// ================================  生成证书 ================================//

/*
	批量生成证书
*/
export const BatchMakeCer = params => {
  return request({
    url: '/crypto/x509batch_makecer/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

/*
	P10生成证书
*/
export const P10MakeCer = params => {
  return request({
    url: '/crypto/p10subgroup_makecert/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

// 生成CRL证书
export const CrlMakeCer = params => {
  return request({
    url: '/crypto/py_makecrl_file/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}

// ================================  下载根证 ================================//
// 下载根证
export const GencertUpload = params => {
  return request({
    url: '/crypto/gencert_py_upload/',
    method: 'post',
    urlType: 'crypto',
    data: params
  })
}
