import { PageName } from '@/shared/meta'
import { RouteRecordRaw } from 'vue-router'

export default {
  path: '/',
  name: PageName.Home,
  component: () => import('./pages/MainView.vue'),
  meta: {
    requireAuth: true,
  },
} as RouteRecordRaw
