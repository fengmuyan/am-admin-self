import store from '@/store'
import { getToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 100000
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    if (config.data && config.data.$_isFormData === true) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      config.data = config.data.formData
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(res => {
  const code = res.data.code
  if (code === 401) {
    ELEMENT.MessageBox({
      message: '登录状态已过期。',
      type: 'error',
      duration: 5 * 1000,
      customClass: 'el-message-box-err'
    }).then(() => {
      store.dispatch('LogOut').then(() => {
        location.reload()
      })
    })
  } else if (code !== 200) {
    ELEMENT.MessageBox({
      message: res.data.msg,
      type: 'error',
      duration: 5 * 1000,
      customClass: 'el-message-box-err'
    })
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    console.log('err' + error)
    ELEMENT.MessageBox({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
      customClass: 'el-message-box-err'
    })
    return Promise.reject(error)
  }
)

export default service
