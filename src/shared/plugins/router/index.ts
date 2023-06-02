import lodash, { join } from 'lodash'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'
import authRoute from '@/modules/auth/router'
import AppLayout from '@/layout/AppLayout.vue'
import { modulesRoutes } from './utils'
import { checkHaveAllPermissions, checkHaveSomePermissions, showErrorNotification } from '@/shared/utils'
import { PageName } from '@/shared/meta'
import { useTitle } from '@vueuse/core'
import { i18n } from '../vue-i18n'
import ForbiddenPage from '@/modules/auth/pages/ForbiddenPage.vue'

let routes: RouteRecordRaw[] = []

lodash.forEach(modulesRoutes, (module) => {
  routes = lodash.concat(routes, module as RouteRecordRaw)
})

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: AppLayout,
      children: routes,
      meta: {
        requireAuth: true,
        requirePermission: [],
      },
    },
    authRoute,
    {
      path: '/error',
      children: [
        {
          path: '403',
          name: PageName.Forbidden,
          component: ForbiddenPage,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const title = useTitle()
  title.value = `${i18n.global.t(`common.module.label.${to.name?.toString()}`)} | ${import.meta.env.VITE_APP_TITLE}`
  const redirect = to.fullPath

  if (to.meta.requireAuth) {
    const authStore = useAuthStore()
    if (authStore.currentUser) {
      return next()
    }
    const user = authStore.getUserFromCookie()
    if (user) {
      const requirePermissions = (to.meta.requirePermissions || []) as string[]

      const hasPermissions = checkHaveSomePermissions(requirePermissions)

      if (!hasPermissions) {
        return next({ name: PageName.Forbidden })
      }
      return next()
    } else {
      showErrorNotification('You must login to do that!')
      return next({ name: PageName.SignIn, query: { redirect } })
    }
  } else {
    return next()
  }
})
