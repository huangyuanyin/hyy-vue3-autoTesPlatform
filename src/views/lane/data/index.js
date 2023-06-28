export const disposeList = {
  netSignPrepare: [
    {
      serverName: '',
      main_bord_type: '',
      deployType: '',
      // deployVersion: 'netsign_5_6_2',
      deployVersion: '',
      packageName: '',
      ifha: 'y',
      ispbc: 'y',
      useNewDataType: 'y',
      isrbc: 'y',
      ifback: 'n',
      ifrs: 'y',
      startMidwareType: '',
      sysRest: false,
      reboot: true,
      serverConfig: {},
      showServerConfig: [
        { label: '设备IP：', value: '' },
        { label: '主板类型：', value: '' },
        { label: '设备型号：', value: '' },
        { label: '型号编码：', value: '' },
        { label: '配置编码：', value: '' },
        { label: 'cavium卡：', value: '' },
        { label: '国密卡：', value: '' },
        { label: '设备序列号：', value: '' },
        { label: '产品ID：', value: '' }
      ],
      deviceConfig: {},
      deviceConfigString: ''
    }
  ],
  netSignArrange: [
    {
      serverName: '',
      main_bord_type: '',
      ifback: 'n',
      ifrs: 'y',
      showServerConfig: [
        { label: '设备IP：', value: '' },
        { label: '主板类型：', value: '' },
        { label: '设备型号：', value: '' },
        { label: '型号编码：', value: '' },
        { label: '配置编码：', value: '' },
        { label: 'cavium卡：', value: '' },
        { label: '国密卡：', value: '' },
        { label: '设备序列号：', value: '' },
        { label: '产品ID：', value: '' }
      ],
      serverConfig: {},
      deviceConfig: {},
      deviceConfigString: '',
      packagePath: '',
      packageName: ''
    }
  ],
  interfaceTest: [
    {
      serverName: '',
      showServerConfig: [
        { label: '设备IP：', value: '' },
        { label: '主板类型：', value: '' },
        { label: '设备型号：', value: '' },
        { label: '型号编码：', value: '' },
        { label: '配置编码：', value: '' },
        { label: 'cavium卡：', value: '' },
        { label: '国密卡：', value: '' },
        { label: '设备序列号：', value: '' },
        { label: '产品ID：', value: '' }
      ],
      serverConfig: {},
      // log: ''
      pendingVersionOrigin: 'auto',
      pendingVersion: '',
      branch: '',
      netsignVersion: ''
    }
  ],
  dockerDeployment: [
    {
      serverName: '',
      serverConfig: {},
      showServerConfig: [
        { label: '设备IP：', value: '' },
        { label: '用户名：', value: '' },
        { label: '端口：', value: '' }
      ],
      number: null,
      fileList: [],
      shell: '# 此处输入shell命令（非必填） \n'
    }
  ],
  executeCommand: [{}]
}
