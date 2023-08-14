<template>
  <ElDialog
    id="absence-form"
    v-model="isShow"
    destroy-on-close
    :title="$t(`absence.formMode.${formMode}`)"
    :before-close="onClose"
  >
    <ElForm label-position="top" class="grid grid-cols-2 gap-x-6">
      <ElFormItem :label="$t('attendance.form.userId.label')" :error="form.errors.value.userId">
        <ElSelect
          v-model="userId"
          filterable
          :disabled="!!store.absenceForm.id || !authStore.currentUser?.super"
          :placeholder="$t('attendance.form.userId.placeholder')"
        >
          <ElOption v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('attendance.form.date.label')" :error="form.errors.value.date">
        <ElDatePicker
          v-model="date"
          type="date"
          :format="DATE_FORMAT"
          :value-format="DATE_FORMAT"
          :placeholder="$t('attendance.form.date.placeholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('absence.form.reason.label')" :error="form.errors.value.reason">
        <ElInput v-model="reason" :placeholder="$t('absence.form.reason.placeholder')" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton type="primary" @click="form.onSubmit">{{ $t('common.button.submit') }}</ElButton>
      <ElButton @click="onClose">{{ $t('common.button.cancel') }}</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { usePublicStore } from '@/modules/public/public.store'
import { useAbsenceStore } from '../absence.store'
import { useAbsenceForm } from '../absence.form'
import { DATE_FORMAT } from '@/shared/constants'
import { useAuthStore } from '@/modules/auth/auth.store'
onMounted(async () => {
  await publicStore.fetchUserOptions()
})

const store = useAbsenceStore()
const publicStore = usePublicStore()
const authStore = useAuthStore()

const form = useAbsenceForm()
const formMode = computed(() => store.absenceForm.mode)

const userId = form.useFieldModel('userId')
const date = form.useFieldModel('date')
const reason = form.useFieldModel('reason')

const isShow = computed({
  get: () => store.absenceForm.open,
  set: (val) => store.patchAbsenceForm({ open: val }),
})

const userOptions = computed(() => publicStore.userOptions)

function onClose() {
  store.patchAbsenceForm({})
  form.resetForm({ values: {}, errors: {}, touched: {} })
}
</script>
