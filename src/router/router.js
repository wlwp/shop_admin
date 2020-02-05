import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/Login'
import Home from '../components/home/Home'
import Users from '../components/users/Users'
import Roles from '../components/roles/Roles'
import Rights from '../components/rights/Rights'
import Goods from '../components/goods/Goods'
import Categories from '../components/categories/Categories'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users/:page?', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/goods', component: Goods },
        { path: '/categories', component: Categories }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
})

export default router
