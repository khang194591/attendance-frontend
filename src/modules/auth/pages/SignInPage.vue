<template>
  <div id="login-form" class="px-8 py-6 bg-white rounded-lg">
    <ElForm label-position="top" class="min-w-[360px]">
      <ElFormItem :label="$t('auth.form.email.label')" :error="form.errors.value.email">
        <ElInput v-model="email" :placeholder="$t('auth.form.email.placeholder')" />
      </ElFormItem>
      <ElFormItem :label="$t('auth.form.password.label')">
        <ElInput show-password v-model="password" :placeholder="$t('auth.form.password.placeholder')" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" class="w-full" @click="form.onSubmit"> {{ $t('auth.action.signIn') }} </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { useAuthForm } from '../constants/auth.form'

const form = useAuthForm()

const email = form.useFieldModel('email')
const password = form.useFieldModel('password')
</script>
