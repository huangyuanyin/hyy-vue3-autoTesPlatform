import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import Layout from '@/views/Layout/index.vue' // 布局组件 不需要懒加载

const staticRoutes = [
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
    redirect: '/myTestTask',
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
          title: '信安云效平台'
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
            path: '/myTestTask',
            name: 'MyTestTask',
            meta: {
              title: '我的流水线',
              keepAlive: false
            },
            component: () => import('@/views/testTask/myTest.vue')
          },
          {
            path: '/testTask',
            name: 'TestTask',
            meta: {
              title: '全部流水线',
              keepAlive: false
            },
            component: () => import('@/views/testTask/allTest.vue')
          },
          {
            path: '/compTest/:id',
            name: 'compTest',
            meta: {
              title: '111',
              keepAlive: false
            },
            component: () => import('@/views/testTask/compTest.vue')
          },
          {
            path: '/ungrouped',
            name: 'Ungrouped',
            meta: {
              title: '未分组',
              keepAlive: false
            },
            component: () => import('@/views/testTask/ungrouped.vue')
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
            path: '/testTask/editTestTask',
            name: 'EditTestTask',
            meta: {
              title: '编辑任务',
              keepAlive: false
            },
            component: () => import('@/views/lane/index.vue')
          },
          {
            path: '/testTask/lookTestTaskConfig',
            name: 'LookTestTaskConfig',
            meta: {
              title: '任务配置（仅查看）',
              keepAlive: false
            },
            component: () => import('@/views/lane/index.vue')
          },
          {
            path: '/testTask/detailTestTask',
            name: 'detailTestTask',
            meta: {
              title: '任务详情',
              keepAlive: false
            },
            component: () => import('@/views/testDetail/index.vue')
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
  history: createWebHashHistory('/netDevOps/'),
  routes: staticRoutes
})

export default router
