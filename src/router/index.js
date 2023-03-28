import { createRouter, createWebHistory } from 'vue-router'
import Navigation from '@/views/Navigation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'Navigation',
      component: Navigation,
      children: [

        {
          path:'home',
          name: 'home',
          component: () => import('@/views/home/Home.vue'),
        },
        {
          path:'chat',
          name: 'chat',
          component: () => import('@/views/chat/Chat.vue'),
        },
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
