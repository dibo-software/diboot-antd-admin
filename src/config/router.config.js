// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/system/dictionary/list',
    children: [
      // 系统管理
      {
        path: '/system',
        redirect: '/system/dictionary/list',
        component: PageView,
        meta: { title: '系统管理', icon: 'dashboard' },
        children: [
          {
            path: '/system/dictionary/list',
            name: 'DictList',
            component: () => import('@/views/system/dictionary/list'),
            meta: { title: '数据字典管理', keepAlive: true, permission: ['Dictionary'] }
          },
          {
            path: '/system/iamUser/list',
            name: 'IamUserList',
            component: () => import('@/views/system/iamUser/list'),
            meta: { title: '系统用户管理', keepAlive: true, permission: ['IamUser'] }
          },
          {
            path: '/system/iamRole/list',
            name: 'IamRoleList',
            component: () => import('@/views/system/iamRole/list'),
            meta: { title: '角色权限管理', keepAlive: true, permission: ['IamRole'] }
          },
          {
            path: '/system/iamPermission/list',
            name: 'IamPermissionList',
            component: () => import('@/views/system/iamPermission/list'),
            meta: { title: '系统权限查看', keepAlive: true, permission: ['IamPermission'] }
          },
          {
            path: '/system/iamLoginTrace/list',
            name: 'IamLoginTraceList',
            component: () => import('@/views/system/iamLoginTrace/list'),
            meta: { title: '登录日志查看', keepAlive: true, permission: ['IamLoginTrace'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        meta: { title: '个人中心', icon: 'user', keepAlive: true },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true }
              },
              {
                path: '/account/settings/changePwd',
                name: 'ChangePwdSettings',
                component: () => import('@/views/account/settings/ChangePwd'),
                meta: { title: '更改密码', hidden: true, keepAlive: true }
              }
            ]
          }
        ]
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
