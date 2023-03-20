// 导出 对应的不同接口的URL地址
const configUrl = {
  Base_POC_URL: 'http://10.4.84.27:8015', // POC 接口地址
  Base_Xterm_URL: 'http://10.4.84.27:1182', // xterm 接口地址
  Base_Login_URL: 'http://10.4.84.27:8000', // 登录 接口地址 测试
  Base_APV_URL: 'http://10.4.150.55:8018', // APV 接口地址 测试
  Base_APV_XTERM: '10.4.84.27:1182', // 在线终端 测试
  Base_NETCRYPTO_URL: import.meta.env.VITE_BASE_URL, // Netcrypto 接口地址
  Base_NETCRYPTO_CRYPTO_URL: import.meta.env.VITE_CRYPTO_URL, // Netcrypto crypto服务 接口地址
  Base_NETDEVOPS_URL: import.meta.env.VITE_BASE_URL, // NetDevOps 接口地址
  Base_NETCONSOLE_URL: import.meta.env.VITE_BASE_DRAWER_URL // 平台跳转栏 接口地址
  // Base_Login_URL: "http://172.16.71.179:8000", // 登录 接口地址 华耀
  // Base_APV_URL: "http://172.16.71.179:8018", // APV 接口地址 华耀
  // Base_APV_XTERM: "172.16.71.179:1182" // 在线终端 华耀
}
export default configUrl
