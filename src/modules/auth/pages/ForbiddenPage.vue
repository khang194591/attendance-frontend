<template>
  <div class="grid h-screen px-4 bg-white place-content-center">
    <div class="text-center">
      <h1 class="font-black text-gray-200 text-9xl">403</h1>

      <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

      <p v-t="'common.error.forbiddenMessage'" class="mt-4 text-gray-500"></p>

      <button
        class="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
        @click="onClickReturn"
      >
        {{ $t('common.button.goHome') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PageName } from '@/shared/meta'
import { useRouter } from 'vue-router'

const router = useRouter()

function onClickReturn() {
  router.push({ name: PageName.Home })
}
</script>
