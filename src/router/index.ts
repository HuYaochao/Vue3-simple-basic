import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Emp from "../views/Emp.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/home/emp',
      component: Home,
      
      children: [
        { path: 'emp', component: Emp },
      ]
    },
  ]
})

export default router
