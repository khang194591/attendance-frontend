import { RouteRecordRaw } from 'vue-router'
import { PageName } from '@/shared/meta'

export default {
  path: '/setting/role',
  name: PageName.SettingRole,
  component: () => import('./pages/MainPage.vue'),
} as RouteRecordRaw
