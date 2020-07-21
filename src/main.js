// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // iamPermission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

Vue.use(Viewer)
Viewer.setDefaults({
  // 需要配置的属性
  toolbar: true
})
new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
