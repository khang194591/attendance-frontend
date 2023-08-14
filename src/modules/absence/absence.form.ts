import { showErrorNotification, showSuccessNotification } from '@/shared/utils'
import { ElLoading } from 'element-plus'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAbsenceStore } from './absence.store'
import { AbsenceDto } from './constants/absence.dto'

export const useAbsenceForm = () => {
  const { t } = useI18n()

  const store = useAbsenceStore()

  const formData = computed(() => store.absenceForm.data)
  const form = useForm<AbsenceDto>({})

  const onSubmit = form.handleSubmit(async (values) => {
    const loading = ElLoading.service({
      target: '#absence-form',
    })
    try {
      if (store.absenceForm.mode === 'update') {
        if (store.absenceForm.id) {
          const updatedAbsence = await store.apiService.update(store.absenceForm.id, values)
          updatedAbsence && showSuccessNotification(t('absence.response.updateSuccess'))
        }
      } else {
        const createdAbsence = await store.apiService.create(values)
        createdAbsence && showSuccessNotification(t('absence.response.createSuccess'))
      }
      await store.fetchAbsenceList()
      store.patchAbsenceForm({ open: false })
    } catch (error: any) {
      showErrorNotification(error.message)
    }
    loading.close()
  })

  watch(formData, () => {
    form.resetForm({ values: store.absenceForm.data || {}, errors: {}, touched: {} })
  })

  return {
    ...form,
    onSubmit,
  }
}
