import { Action, Resource } from '@/shared/interfaces'
import { PageName } from '@/shared/meta'
import { RouteRecordRaw } from 'vue-router'

export default {
  path: 'user',
  name: PageName.User,
  component: () => import('./pages/MainPage.vue'),
  meta: {
    requireAuth: true,
    requirePermissions: [`${Resource.user}#${Action.read}`],
  },
} as RouteRecordRaw
