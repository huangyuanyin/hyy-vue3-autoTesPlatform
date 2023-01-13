import { defineStore } from 'pinia'
import { login } from '@/api/user'
import jwt_decode from 'jwt-decode'
import { removeToken, setToken } from '../../../utils/auth'

interface BaseUserInfo {
  id: string
  nickName: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: {} as BaseUserInfo,
    token: '' as string
  }),
  getters: {
    nickName: state => state.userInfo.nickName
  },
  actions: {
    async Login(loginInfo: { username: string; password: string }) {
      const { token } = await login(loginInfo)
      this.userInfo = jwt_decode(token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      this.token = token
      setToken(this.token)
      return token
    },
    async LoginOut() {
      await removeToken()
      localStorage.removeItem('userInfo')
    }
  }
})
