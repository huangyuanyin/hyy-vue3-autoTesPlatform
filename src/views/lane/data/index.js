export const disposeList = {
  netSignPrepare: [
    {
      serverName: '',
      main_bord_type: '',
      deployType: '',
      deployVersion: 'netsign_5_6_2',
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
        { label: '设备编码：', value: '' },
        { label: 'cavium卡：', value: '' },
        { label: '国密卡：', value: '' },
        { label: '设备序列号：', value: '' },
        { label: '产品ID：', value: '' }
      ],
      deviceConfig: {}
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
        { label: '设备编码：', value: '' },
        { label: 'cavium卡：', value: '' },
        { label: '国密卡：', value: '' }
      ],
      serverConfig: {},
      deviceConfig: {},
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
        { label: '设备编码：', value: '' },
        { label: 'cavium卡：', value: '' },
        { label: '国密卡：', value: '' }
      ],
      serverConfig: {},
      // log: ''
      pendingVersionOrigin: 'auto',
      pendingVersion: '',
      branch: '',
      netsignVersion: ''
    }
  ],
  executeCommand: [{}]
}
