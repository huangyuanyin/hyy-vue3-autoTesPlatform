import { getDockerDeviceManageApi, addDeviceApi, editDeviceApi } from '@/api/NetDevOps/index'

export default function useDockerDeviceManage() {
  const getDockerDeviceManage = params => {
    return getDockerDeviceManageFun(isLoading, params)
  }
  const addDevice = async params => {
    return await addDeviceApi(params)
  }
  const editDevice = async params => {
    return await editDeviceApi(params)
  }
  return {
    getDockerDeviceManage,
    addDevice,
    editDevice
  }
}

const getDockerDeviceManageFun = async (isLoading, params) => {
  isLoading.value = true
  let res = await getDockerDeviceManageApi(params)
  if (res.code === 1000) {
    isLoading.value = false
    return res.data
  }
}
