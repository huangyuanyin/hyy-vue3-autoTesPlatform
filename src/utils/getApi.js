import { datas } from '@/api/POC/index.js'
import { getCaseApi } from '@/api/APV/taskManagement.js'

// 根据任务ID 调取接口
export const getDataApi = async id => {
  let tableData = []
  const params = {
    resultid: id
  }
  const res = await datas(params)
  if (res.code == 1000) {
    tableData = res.data
  }
  return tableData
}

// 获取用例集数据
export const getCasesData = async () => {
  let casesData = []
  let res = await getCaseApi()
  if (res.code == 1000) {
    casesData = res.data || []
  }
  return casesData
}
