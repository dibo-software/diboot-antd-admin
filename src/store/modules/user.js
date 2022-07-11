import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { permissionListToPermissions } from '@/utils/permissions'
import { welcome } from '@/utils/util'
import defaultAvatar from '@/assets/logo.png'
import { logout as ssoLogout } from '@/utils/sso'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      if (avatar) {
        state.avatar = avatar
      } else {
        state.avatar = defaultAvatar
      }
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response.data
          storage.set(ACCESS_TOKEN, data, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          if (result.role) {
            const role = result.role
            // 更改permission的默认的列表字段
            if (result.role.permissionList.length > 0) {
              role.permissions = permissionListToPermissions(result.role.permissionList)
              role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            } else {
              role.permissions = []
              role.permissionList = []
            }
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('请配置该账号的角色与权限！'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        const reset = () => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          ssoLogout()
          resolve()
        }

        logout(state.token).then(() => {
          reset()
        }).catch(() => {
          reset()
        })
      })
    }

  }
}

export default user
