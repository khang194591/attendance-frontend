import { Action, Resource } from '@/shared/interfaces'
import { PageName } from '@/shared/meta'
import { RouteRecordRaw } from 'vue-router'

export default {
  path: 'attendance',
  name: PageName.Attendance,
  component: () => import('./pages/MainPage.vue'),
  meta: {
    requireAuth: true,
    requirePermissions: [`${Resource.attendance}#${Action.read}`, `${Resource.attendance}#${Action.read_personal}`],
  },
} as RouteRecordRaw
