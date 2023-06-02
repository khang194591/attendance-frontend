import { showErrorNotification, showSuccessNotification } from '@/shared/utils'
import { ElLoading } from 'element-plus'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAttendanceStore } from './attendance.store'
import { AttendanceDto } from './constants/attendance.dto'
import { attendanceSchema } from './constants/attendance.schema'

export const useAttendanceForm = () => {
  const { t } = useI18n()

  const store = useAttendanceStore()

  const formData = computed(() => store.attendanceForm.data)
  const form = useForm<AttendanceDto>({ validationSchema: attendanceSchema })

  const onSubmit = form.handleSubmit(async (values) => {
    const loading = ElLoading.service({
      target: '#attendance-form',
    })
    try {
      if (store.attendanceForm.mode === 'update') {
        if (store.attendanceForm.id) {
          const updatedAttendance = await store.apiService.update(store.attendanceForm.id, values)
          updatedAttendance && showSuccessNotification(t('attendance.response.updateSuccess'))
        }
      } else {
        const createdAttendance = await store.apiService.create(values)
        createdAttendance && showSuccessNotification(t('attendance.response.createSuccess'))
      }
      await store.fetchDetailTableData()
      await store.fetchOverviewTableData()
      store.patchAttendanceForm({ open: false })
    } catch (error: any) {
      showErrorNotification(error.message)
    }
    loading.close()
  })

  watch(formData, () => {
    form.resetForm({ values: store.attendanceForm.data || {}, errors: {}, touched: {} })
  })

  return {
    ...form,
    onSubmit,
  }
}
