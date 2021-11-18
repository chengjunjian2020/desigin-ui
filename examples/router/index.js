import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: index
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import(/* webpackChunkName: "about" */ '../views/tree.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
