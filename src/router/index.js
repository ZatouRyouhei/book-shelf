import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../store'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: About,
    meta: {
      isRequestAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

let isAuthed = function() {
  return store.getters.isAuth
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.isRequestAuth)
      && !isAuthed()) {
        next({ path: '/', query: { path: to.fullPath }})
      } else {
        next()
      }
});

export default router
