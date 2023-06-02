<template>
  <ElConfigProvider :locale="locale">
    <RouterView />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import en from 'element-plus/dist/locale/en.mjs'
import vi from 'element-plus/dist/locale/vi.mjs'
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { SupportLanguage } from './shared/plugins/vue-i18n'

const locale = computed(() => {
  return localStorage.getItem('language') === SupportLanguage.en ? en : vi
})
</script>
