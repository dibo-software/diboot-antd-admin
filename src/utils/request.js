import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import router from '@/router/index'
import qs from 'qs'

// baseURL
const BASE_URL = '/api'
// token在Header中的key，需要与后端对diboot.iam.jwt-signkey配置相同
const JWT_HEADER_KEY = 'authtoken'
// token自动刷新（发送心跳）的时间间隔（分钟），建议为后端配置的token过期时间的1/8
const TOKEN_REFRESH_EXPIRE = 10
// 心跳计时器
let pingTimer = {}
setPingTimer()

// 创建 axios 实例
const service = axios.create({
  baseURL: BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[JWT_HEADER_KEY] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  // 只针对get方式进行序列化
  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  // 检查是否携带有新的token
  const newToken = response.headers[JWT_HEADER_KEY]
  if (newToken) {
    // 将该token设置到vuex以及本地存储中
    Vue.ls.set(ACCESS_TOKEN, newToken, 7 * 24 * 60 * 60 * 1000)
    store.commit('SET_TOKEN', newToken)
  }
  // 如果请求成功，则重置心跳定时器
  if (response.status === 200) {
    resetPingTimer()
  }

  // 如果返回的自定义状态码为 4001， 则token过期，需要清理掉token并跳转至登录页面重新登录
  if (response.data && response.data.code === 4001) {
    Vue.ls.remove(ACCESS_TOKEN)
    store.commit('SET_TOKEN', '')
    store.commit('SET_ROLES', [])
    router.push('/login')
    throw new Error('登录过期，请重新登录')
  }

  // 如果当前请求是下载请求
  if (response.headers.filename) {
    return {
      data: response.data,
      filename: decodeURI(response.headers.filename),
      code: parseInt(response.headers['err-code'] || '0'),
      msg: decodeURI(response.headers['err-msg'] || '')
    }
  }
  return response.data
}, err)

// 自定义dibootApi请求快捷方式
const dibootApi = {
  get (url, params) {
    return service.get(url, {
      params
    })
  },
  post (url, data) {
    return service({
      method: 'POST',
      url,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  put (url, data) {
    return service({
      method: 'PUT',
      url,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  /**
   * 删除
   * @param url
   * @param params
   * @returns {AxiosPromise}
   */
  delete (url, params) {
    return service({
      url,
      method: 'DELETE',
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  },
  /***
   * 上传文件接口
   * @param url
   * @param formData
   * @returns {AxiosPromise}
   */
  upload (url, formData) {
    return service({
      url,
      method: 'POST',
      data: formData
    })
  },
  /**
   * GET下载文件
   * @param url
   * @param data
   * @returns {AxiosPromise}
   */
  download (url, params) {
    return service({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      observe: 'response',
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  },
  /**
   * POST下载文件（常用于提交json数据下载文件）
   * @param url
   * @param data
   * @returns {AxiosPromise}
   */
  postDownload (url, data) {
    return service({
      url,
      method: 'POST',
      responseType: 'arraybuffer',
      observe: 'response',
      data: JSON.stringify(data),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  }
}

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

/***
 * 设置一个心跳定时器
 */
function setPingTimer () {
  pingTimer = setTimeout(() => {
    dibootApi.post('/iam/ping')
    resetPingTimer()
  }, TOKEN_REFRESH_EXPIRE * 60 * 1000)
}

/***
 * 重置一个心跳定时器
 */
function resetPingTimer () {
  clearTimeout(pingTimer)
  setPingTimer()
}

export {
  installer as VueAxios,
  service as axios,
  BASE_URL as baseURL,
  dibootApi
}
