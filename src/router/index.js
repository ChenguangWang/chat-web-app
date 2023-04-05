import { createRouter, createWebHistory } from 'vue-router';
import Navigation from '@/views/Navigation.vue';

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
          path: 'home',
          name: 'home',
          component: () => import('@/views/home/Home.vue')
        },
        {
          path: 'user/info',
          name: 'userInfo',
          meta: {
            name: '个人信息'
          },
          component: () => import('@/views/user-info/UserInfo.vue')
        },
        {
          path: 'chat',
          name: 'chat',
          meta: {
            name: '会话'
          },
          component: () => import('@/views/chat/Chat.vue')
        },
        {
          path: 'upgrade',
          name: 'upgrade',
          component: () => import('@/views/upgrade/Upgrade.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue')
    }
  ]
});

export default router;
