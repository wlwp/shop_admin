// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router.js'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'
// 使用API时必须在请求头中使用 Authorization 字段提供 token 令牌
import axios from 'axios'
// common
// var ElTreeGridElTreeGrid from '' = require('element-tree-grid')
import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid)
// 处理axios的三个问题
// 处理一:基路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 处理二 : 把axios 挂载到 vue 的原型上 ,就不用每次都引入啦
Vue.prototype.$axios = axios
// 处理三: 自动携带token
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
axios.interceptors.request.use(
  function (config) {
    // 拦截每次请求,携带token
    config.headers.Authorization = localStorage.getItem('token')

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
