import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import User from './views/User.vue'
import NotFoundComponent from './views/NotFoundComponent.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/home/:id',
      component: Home,
      children: [{
        path: '',
        name: 'staff',
        component: () => import('./views/Staff.vue')
      }, ]
    },
    {
      path: '/',
      name: 'user',
      component: User
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFoundComponent
    }
  ]
})