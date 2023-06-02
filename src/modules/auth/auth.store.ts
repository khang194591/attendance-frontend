import { defineStore } from 'pinia'
import { ref } from 'vue'
import { intersection } from 'lodash'
import { getCookie } from '@/shared/utils'
import { UserResponseDto } from '../user/constants/user.dto'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<UserResponseDto>()

  function getUserFromCookie() {
    try {
      const user = JSON.parse(decodeURIComponent(getCookie('user')))
      if (user satisfies UserResponseDto) {
        currentUser.value = user
        return user as UserResponseDto
      } else {
        throw Error()
      }
    } catch (error) {
      currentUser.value = undefined
    }
  }

  function hasAllPermissions(permissions: string[]) {
    const userPermissions = currentUser.value?.role?.permissions || []
    return intersection(userPermissions, permissions).length === permissions.length
  }

  function hasSomePermissions(permissions: string[]) {
    const userPermissions = currentUser.value?.role?.permissions || []


    return intersection(userPermissions, permissions).length !== 0
  }

  return {
    currentUser,
    getUserFromCookie,
    hasAllPermissions,
    hasSomePermissions,
  }
})
