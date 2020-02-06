import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login/Login'
// import Home from '../components/home/Home'
// import Users from '../components/users/Users'
// import Roles from '../components/roles/Roles'
// import Rights from '../components/rights/Rights'
// import Goods from '../components/goods/Goods'
// import Categories from '../components/categories/Categories'
// import addGoods from '../components/add_goods/addGoods'

// 路由懒加载,按需加载
const Login = () => import('../components/login/Login')
const Home = () => import('../components/home/Home')
const Roles = () => import('../components/roles/Roles')
const Rights = () => import('../components/rights/Rights')
const Goods = () => import('../components/goods/Goods')
const Categories = () => import('../components/categories/Categories')
const addGoods = () => import('../components/add_goods/addGoods')
const Users = () => import('../components/users/Users')
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
        { path: '/goods/:page?', component: Goods },
        { path: '/categories/:page?', component: Categories },
        { path: '/add_goods', component: addGoods }
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
