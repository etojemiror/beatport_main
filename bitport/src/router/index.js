import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/components/HomeView.vue";
import Login from "@/components/Login.vue";
import SearchRelease from "@/components/SearchRelease.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path:'/searchrelease',
      name: 'search',
      component: SearchRelease
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router
