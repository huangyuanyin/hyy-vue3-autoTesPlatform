import * as axios from 'axios'

declare module 'axios' {
  interface AxiosInstance {
    // eslint-disable-next-line no-undef
    (config: AxiosRequestConfig): Promise<any>
  }
}
