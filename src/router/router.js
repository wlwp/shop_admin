import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/Login'
import Home from '../components/home/Home'
import Users from '../components/users/Users'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [{ path: '/users/:page?', component: Users }]
    }
  ]
})

export default router
