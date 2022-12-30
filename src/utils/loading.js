import { ElLoading } from 'element-plus'

let loadingRequestCount = 0 // 定义一个请求次数的变量,用来记录当前页面总共请求的次数
let loadingInstance // 初始化loading

/** 编写一个显示loading的函数,并且记录请求次数++  */
const showLoaing = target => {
  if (loadingRequestCount === 0) {
    loadingInstance = ElLoading.service({ target })
  }
  loadingRequestCount++
}

/** 编写一个隐藏loading的函数,并且记录请求次数--  */
const hideLoaing = () => {
  if (loadingRequestCount < 0) {
    return
  }
  loadingRequestCount--
  if (loadingRequestCount == 0) {
    loadingInstance.close()
  }
}

export { showLoaing, hideLoaing }
