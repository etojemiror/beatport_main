import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/components/HomeView.vue";
import Login from "@/components/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router
