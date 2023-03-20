import router from '@/router/index.js'
// import { getToken } from '@/utils/auth.js'

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.path != '/login') {
    return next({
      path: '/login'
    })
  }
  // 防止重复登录
  if (token && to.path == '/login') {
    return next({
      path: from.path ? from.path : 'home'
    })
  }
  next()
})
