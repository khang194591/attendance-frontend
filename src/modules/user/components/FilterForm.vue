<template>
  <div class="p-4 pb-0 border-b">
    <div class="flex flex-row items-center justify-between mb-4">
      <p class="text-sm font-bold">{{ $t('common.button.filter') }}</p>
      <div>
        <ElButton type="danger" @click="store.onResetFilterForm">{{ $t('common.button.reset') }}</ElButton>
        <ElButton type="primary" @click="store.onSearch">{{ $t('common.button.search') }}</ElButton>
      </div>
    </div>
    <ElForm label-position="top" class="grid grid-cols-3 gap-4">
      <ElFormItem :label="$t('user.form.role.label')" :error="form.errors.roleId">
        <ElSelect v-model="roleId" multiple collapse-tags :placeholder="$t('user.form.role.placeholder')">
          <ElOption v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.gender.label')" :error="form.errors.gender">
        <ElSelect v-model="gender" multiple collapse-tags :placeholder="$t('user.form.gender.placeholder')">
          <ElOption
            v-for="item in genderOptions"
            :key="item.value"
            :label="$t(`user.gender.${item.label}`)"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.status.label')" :error="form.errors.status">
        <ElSelect v-model="status" multiple collapse-tags :placeholder="$t('user.form.status.placeholder')">
          <ElOption
            v-for="item in statusOptions"
            :key="item.value"
            :label="$t(`user.status.${item.label}`)"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { usePublicStore } from '@/modules/public/public.store'
import { computed, onMounted } from 'vue'
import { useUserStore } from '../user.store'

onMounted(async () => {
  await publicStore.fetchRoleOptions()
})

const store = useUserStore()
const publicStore = usePublicStore()

const form = computed(() => store.filterForm)

const roleId = form.value.useFieldModel('roleId')
const status = form.value.useFieldModel('status')
const gender = form.value.useFieldModel('gender')

const roleOptions = computed(() => publicStore.roleOptions)
const genderOptions = computed(() => publicStore.genderOptions)
const statusOptions = computed(() => publicStore.statusOptions)
</script>
