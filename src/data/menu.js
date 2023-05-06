export const cheshiMenuData = [
  {
    id: 'test01',
    title: '测试',
    path: null,
    isDisabled: true,
    type: 1,
    children: []
  },
  {
    id: 'test02',
    title: '概览',
    path: '/test/overview',
    isDisabled: false,
    children: []
  },
  {
    id: 'test03',
    title: '测试管理',
    path: null,
    isDisabled: false,
    children: [
      {
        id: 'test0301',
        title: '测试一',
        path: '/ceshiOne',
        isDisabled: false,
        children: []
      }
    ]
  }
]

export const APVAutoMenuData = [
  {
    id: '01',
    title: '信安云效平台',
    icon: null,
    path: null,
    isDisabled: true,
    children: []
  },
  {
    id: '02',
    title: '概览',
    path: '/overview',
    icon: 'House',
    isDisabled: false,
    children: []
  },
  {
    id: '03',
    title: '系统配置',
    path: '/systemConfig',
    icon: 'School',
    isDisabled: false,
    children: []
  },
  {
    id: '04',
    title: '测试任务',
    path: '/testTask',
    icon: 'Suitcase',
    isDisabled: false,
    children: []
  }
  // {
  //   id: '05',
  //   title: '测试结果',
  //   path: '/testResult',
  //   icon: 'Money',
  //   isDisabled: false,
  //   children: []
  // }
]
