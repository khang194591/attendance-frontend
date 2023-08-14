<template>
  <div class="flex-1 flex flex-col gap-8 px-4">
    <div class="bg-white border my-4 rounded-lg">
      <div class="inline-flex justify-between p-4 w-full">
        <ElButton v-if="true" type="primary" :icon="IconPlus" @click="onCreate">{{ $t('common.button.add') }}</ElButton>
      </div>
      <AbsenceForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAbsenceStore } from '../absence.store'
import AbsenceForm from '../components/AbsenceForm.vue'
import { IconPlus } from '@tabler/icons-vue'

onMounted(async () => {
  await store.fetchAbsenceList()
})

const store = useAbsenceStore()

function onCreate() {
  store.patchAbsenceForm({ mode: 'create', open: true })
}
</script>
