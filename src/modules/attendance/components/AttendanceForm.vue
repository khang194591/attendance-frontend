<template>
  <ElDialog
    id="attendance-form"
    v-model="isShow"
    destroy-on-close
    :fullscreen="!isLargeScreen"
    :title="$t(`attendance.formMode.${formMode}`)"
    :before-close="onClose"
  >
    <ElForm label-position="top" class="grid grid-cols-2 gap-x-6">
      <ElFormItem :label="$t('attendance.form.userId.label')" :error="form.errors.value.userId">
        <ElSelect
          v-model="userId"
          filterable
          :disabled="!!store.attendanceForm.id"
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
          :disabled="!!date"
          :disabled-date="disabledDate"
          :placeholder="$t('attendance.form.date.placeholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('attendance.form.time.label')" class="col-span-2" :error="form.errors.value.checkIn">
        <ElTimePicker
          v-model="timeRange"
          is-range
          :range-separator="$t('common.timeRange.separator')"
          :start-placeholder="$t('common.timeRange.start')"
          :end-placeholder="$t('common.timeRange.end')"
          :format="TIME_FORMAT"
          :value-format="TIME_FORMAT"
        />
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
import { DATE_FORMAT, TIME_FORMAT } from '@/shared/constants/format'
import { useAttendanceForm } from '../attendance.form'
import { useAttendanceStore } from '../attendance.store'
import { usePublicStore } from '@/modules/public/public.store'
import dayjs from 'dayjs'
import { useMediaQuery } from '@vueuse/core'

onMounted(async () => {
  await publicStore.fetchUserOptions()
})

const store = useAttendanceStore()
const publicStore = usePublicStore()

const form = useAttendanceForm()
const formMode = computed(() => store.attendanceForm.mode)

const isLargeScreen = useMediaQuery('(min-width: 768px)')

const userId = form.useFieldModel('userId')
const date = form.useFieldModel('date')
const checkIn = form.useFieldModel('checkIn')
const checkOut = form.useFieldModel('checkOut')

//@ts-ignore
const timeRange = computed<[string, string]>({
  get: () => [checkIn.value, checkOut.value],
  set: (val: [string, string]) => {
    form.setFieldValue('checkIn', val?.[0] ?? '')
    form.setFieldValue('checkOut', val?.[1] ?? '')
  },
})

const isShow = computed({
  get: () => store.attendanceForm.open,
  set: (val) => store.patchAttendanceForm({ open: val }),
})

const userOptions = computed(() => publicStore.userOptions)

const disabledDate = (date: string) => dayjs(date).get('day') % 6 === 0

function onClose() {
  store.patchAttendanceForm({})
  form.resetForm({ values: {}, errors: {}, touched: {} })
}
</script>
