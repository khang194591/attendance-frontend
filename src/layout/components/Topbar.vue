<template>
  <div class="relative flex flex-row h-14 w-full items-center px-4 border-b bg-white">
    <ElIcon :size="36">
      <img src="/favicon.ico" />
    </ElIcon>
    <span class="flex-1" />
    <div class="inline-flex items-center gap-4">
      <div class="w-40">
        <SelectLanguage />
      </div>
      <ElDropdown trigger="click">
        <ElAvatar :src="avatarUrl"></ElAvatar>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem divided :icon="IconLogout" @click="onClickLogout">
              {{ $t('auth.action.signOut') }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store'
import { PageName } from '@/shared/meta'
import { showErrorNotification, showSuccessNotification } from '@/shared/utils'
import { IconLogout } from '@tabler/icons-vue'
import axios from 'axios'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SelectLanguage from './SelectLanguage.vue'

onMounted(() => {
  authStore.getUserFromCookie()
})

const authStore = useAuthStore()

const router = useRouter()

const user = computed(() => authStore.currentUser)

const avatarUrl = computed(() => user.value?.avatarUrl || '/avatar.png')

async function onClickLogout() {
  try {
    const redirect = router.currentRoute.value.fullPath
    const response = await axios.delete('/auth/sign-out')
    if (response.success) {
      showSuccessNotification(response.message)
      authStore.currentUser = undefined
      router.push({ name: PageName.SignIn, query: { redirect } })
    }
  } catch (error: any) {
    showErrorNotification(error.message)
  }
}
</script>
