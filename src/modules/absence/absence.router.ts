import { PageName } from '@/shared/meta'
import { RouteRecordRaw } from 'vue-router'

export default {
  path: 'absence',
  name: PageName.Absence,
  component: () => import('./pages/MainPage.vue'),
  meta: {
    requireAuth: true,
  },
} as RouteRecordRaw
