import { ElMessageBox, ElMessageBoxOptions, ElNotification } from 'element-plus'
import { i18n } from '../plugins/vue-i18n'

export function showErrorNotification(message?: string, title?: string) {
  ElNotification({
    type: 'error',
    title: title || i18n.global.t('common.status.error'),
    message,
  })
}

export function showSuccessNotification(message?: string, title?: string) {
  ElNotification({
    type: 'success',
    title: title || i18n.global.t('common.status.success'),
    message,
  })
}

export function showInfoNotification(message?: string, title?: string) {
  ElNotification({
    type: 'info',
    title: title || i18n.global.t('common.status.notification'),
    message,
  })
}

export async function showConfirmNotification(message?: string, options?: ElMessageBoxOptions) {
  try {
    await ElMessageBox.confirm(message, options)
    return true
  } catch (error) {
    return false
  }
}
