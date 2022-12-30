import { defineStore } from 'pinia'
import { login } from '@/api/user.ts'
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
      // let token =
      //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1heGYiLCJuaWNrbmFtZSI6Ilx1OWE2Y1x1NjY1M1x1OThkZSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoibWF4ZkBpbmZvc2VjLmNvbS5jbiIsImV4cCI6MTY2NjkzODk4OH0._i-cBOWcuOhtN8ogXRf8qiFFDRNT2pgcpBGM4Q8DStQ'
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
