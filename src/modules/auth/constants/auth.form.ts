import { router } from '@/shared/plugins/router'
import { showErrorNotification, showSuccessNotification } from '@/shared/utils'
import axios from 'axios'
import { ElLoading } from 'element-plus'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../auth.store'
import { signInSchema } from './auth.schema'

export const useAuthForm = () => {
  const { t } = useI18n()
  const authStore = useAuthStore()

  const form = useForm({
    validationSchema: signInSchema,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const loading = ElLoading.service({
      target: '#login-form',
    })
    const response = await axios.post('/auth/sign-in', values)
    if (response.success) {
      authStore.getUserFromCookie()
      router.push((router.currentRoute.value.query.redirect as string) || '/')
      showSuccessNotification(t('auth.message.signInSuccess'))
    } else {
      showErrorNotification(response.message)
    }
    loading.close()
  })

  return { ...form, onSubmit }
}
