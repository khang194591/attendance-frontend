<template>
  <ElSelect v-model="$i18n.locale" @change="handleChangeLanguage">
    <template #prefix>
      <component :is="IconLanguage" />
    </template>
    <ElOption
      v-for="language in $i18n.availableLocales"
      :value="language"
      :label="$t(`common.language.${language}`)"
      :key="language"
    >
    </ElOption>
  </ElSelect>
</template>

<script setup lang="ts">
import { IconLanguage } from '@tabler/icons-vue'
import { useTitle } from '@vueuse/core'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const title = useTitle()
const { name } = useRoute()

function handleChangeLanguage(val: string) {
  dayjs.locale(val)
  title.value = `${t(`common.module.label.${name?.toString()}`)} | ${import.meta.env.VITE_APP_TITLE}`
  localStorage.setItem('language', val)
}
</script>
