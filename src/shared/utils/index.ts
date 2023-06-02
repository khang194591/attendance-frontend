export * from './notification'

import { useAuthStore } from '@/modules/auth/auth.store'

export const mapSortOrder = (order: string) =>
  order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : undefined

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
  return ''
}

export function checkHaveAllPermissions(permissions: string[]) {
  const authStore = useAuthStore()
  const isSuper = (authStore.currentUser as unknown as any)?.super
  if (isSuper) return true
  return authStore.hasAllPermissions(permissions)
}

export function checkHaveSomePermissions(permissions: string[]) {
  const authStore = useAuthStore()
  const isSuper = (authStore.currentUser as unknown as any)?.super
  if (isSuper || permissions.length === 0) return true
  return authStore.hasSomePermissions(permissions)
}
