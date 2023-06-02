import axios, { AxiosError, AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL

axios.interceptors.request.use(function (request) {
  request.headers['x-custom-lang'] = localStorage.getItem('language')
  return request
})

axios.interceptors.response.use(
  function (response) {
    const message = response.data?.message
    return { ...response, message, success: true }
  },
  function (error: AxiosError<any>): IResponse<any> {
    if (error.response) {
      const response = error.response
      let message = response.data.message

      if (!navigator.onLine) {
        message = 'No internet connection'
      }
      return { ...response, message, success: false }
    } else if (error.request) {
      return { ...error.response!, message: 'Network error', success: false }
    } else {
      return { ...error.response!, message: 'Network error', success: false }
    }
  },
)

export interface IResponse<T> {
  config: InternalAxiosRequestConfig
  data: T
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  request?: any
  status: number
  statusText: string
  // Thuộc tính custom
  success?: boolean
  message?: string
}
