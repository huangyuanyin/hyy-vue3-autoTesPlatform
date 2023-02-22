import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import Layout from '@/views/Layout/index.vue' // 布局组件 不需要懒加载

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录页面'
    },
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/page',
    name: 'Page',
    meta: {
      title: '测试页面'
    },
    component: () => import('@/views/page/card.vue')
  },
  {
    path: '/',
    redirect: '/overview',
    component: Layout
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '/autoTestPlatform',
        name: 'AutoTestPlatform',
        meta: {
          title: '自动化测试'
        },
        redirect: '/overview', // 该配置是若点击选择一级菜单时，默认选中并跳转到该一级菜单下的第一个二级菜单
        component: () => import('@/views/index.vue'),
        children: [
          {
            path: '/overview',
            name: 'Overview',
            meta: {
              title: '概览',
              keepAlive: false
            },
            component: () => import('@/views/overview/index.vue')
          },
          {
            path: '/systemConfig',
            name: 'SystemConfig',
            meta: {
              title: '系统配置',
              keepAlive: false
            },
            component: () => import('@/views/systemConfig/index.vue')
          },
          {
            path: '/testTask',
            name: 'TestTask',
            meta: {
              title: '测试任务',
              keepAlive: false
            },
            component: () => import('@/views/testTask/index.vue')
          },
          {
            path: '/testTask/addTestTask',
            name: 'AddTestTask',
            meta: {
              title: '新建任务',
              keepAlive: false
            },
            component: () => import('@/views/lane/index.vue')
          },
          {
            path: '/testResult',
            name: 'TestResult',
            meta: {
              title: '测试结果',
              keepAlive: false
            },
            component: () => import('@/views/testResult/index.vue')
          }
        ]
      },
      {
        path: '/test',
        name: 'Test',
        meta: {
          title: '测试'
        },
        redirect: '/test/overview', // 该配置是若点击选择一级菜单时，默认选中并跳转到该一级菜单下的第一个二级菜单
        component: () => import('@/views/test/index.vue'),
        children: [
          {
            path: '/test/overview',
            meta: {
              title: '概览'
            },
            component: () => import('@/views/test/overview.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      title: '404页面'
    },
    component: () => import('@/views/exception/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory('/netautotestplatform/'),
  routes
})

export default router
