import { showErrorNotification, showSuccessNotification } from '@/shared/utils/notification'
import { ElLoading } from 'element-plus'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserDto } from './constants/user.dto'
import { userSchema } from './constants/user.schema'
import { useUserStore } from './user.store'

export const useUserForm = () => {
  const { t } = useI18n()
  const store = useUserStore()

  const formData = computed(() => store.userForm.data)
  const form = useForm<UserDto>({ validationSchema: userSchema })

  const onSubmit = form.handleSubmit(async (values) => {
    const loading = ElLoading.service({
      target: '#user-form',
    })
    try {
      if (store.userForm.mode === 'update') {
        if (store.userForm.id) {
          const updatedUser = await store.apiService.update(store.userForm.id, values)
          updatedUser && showSuccessNotification(t('user.response.updateSuccess'))
        }
      } else {
        const createdUser = await store.apiService.create(values)
        createdUser && showSuccessNotification(t('user.response.createSuccess'))
      }
      await store.fetchUserList()
      store.patchUserForm({ open: false })
    } catch (error: any) {
      showErrorNotification(error.message)
    }
    loading.close()
  })

  watch(formData, () => {
    form.resetForm({ values: store.userForm.data || {}, errors: {}, touched: {} })
  })

  return {
    ...form,
    onSubmit,
  }
}
