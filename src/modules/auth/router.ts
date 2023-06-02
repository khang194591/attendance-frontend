import { PageName } from '@/shared/meta'
import { RouteRecordRaw } from 'vue-router'

export default {
  path: '/auth',
  component: () => import('./pages/MainPage.vue'),
  meta: { requireAuth: false },
  children: [
    {
      path: 'sign-in',
      name: PageName.SignIn,
      component: () => import('./pages/SignInPage.vue'),
    },
  ],
} as RouteRecordRaw
