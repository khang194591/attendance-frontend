<template>
  <ElDialog
    id="user-form"
    v-model="isShow"
    top="5vh"
    :fullscreen="!isLargeScreen"
    :title="$t(`user.formMode.${formMode}`)"
    :before-close="onClose"
  >
    <ElUpload
      class="flex justify-center items-center mb-12"
      :show-file-list="false"
      :action="uploadUrl"
      :on-success="handleUploadSuccess"
    >
      <ElAvatar :src="avatarUrl" :size="128" :icon="IconPlus" />
    </ElUpload>
    <ElForm label-position="top" class="grid grid-cols-2 lg:grid-cols-3 gap-x-6">
      <ElFormItem required :label="$t('user.form.name.label')" :error="form.errors.value.name">
        <ElInput v-model="name" :placeholder="$t('user.form.name.placeholder')" />
      </ElFormItem>
      <ElFormItem required :label="$t('user.form.email.label')" :error="form.errors.value.email">
        <ElInput v-model="email" :placeholder="$t('user.form.email.placeholder')" />
      </ElFormItem>
      <ElFormItem :label="$t('user.form.birthDay.label')" :error="form.errors.value.birthDay">
        <ElDatePicker
          v-model="birthDay"
          type="date"
          :placeholder="$t('user.form.birthDay.placeholder')"
          :format="DATE_FORMAT"
          :value-format="DATE_FORMAT"
        />
      </ElFormItem>
      <ElFormItem :label="$t('user.form.gender.label')" :error="form.errors.value.gender">
        <ElSelect v-model="gender" :placeholder="$t('user.form.gender.placeholder')">
          <ElOption
            v-for="item in genderOptions"
            :key="item.value"
            :label="$t(`user.gender.${item.label}`)"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.phone.label')" :error="form.errors.value.phone">
        <ElInput v-model="phone" :placeholder="$t('user.form.phone.placeholder')" />
      </ElFormItem>
      <ElFormItem :label="$t('user.form.citizenId.label')" :error="form.errors.value.citizenId">
        <ElInput v-model="citizenId" :placeholder="$t('user.form.citizenId.placeholder')" />
      </ElFormItem>
      <ElFormItem :label="$t('user.form.bank.label')" :error="form.errors.value.bank">
        <ElSelect v-model="bank" filterable :placeholder="$t('user.form.bank.placeholder')">
          <ElOption v-for="item in bankOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.bankAccount.label')" :error="form.errors.value.bankAccount">
        <ElInput v-model="bankAccount" :placeholder="$t('user.form.bankAccount.placeholder')" />
      </ElFormItem>
      <ElFormItem
        v-if="store.userForm.mode === 'update'"
        :label="$t('user.form.status.label')"
        :error="form.errors.value.status"
      >
        <ElSelect v-model="status" :placeholder="$t('user.form.status.placeholder')">
          <ElOption
            v-for="item in statusOptions"
            :key="item.value"
            :label="$t(`user.status.${item.label}`)"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem required :label="$t('user.form.role.label')" :error="form.errors.value.roleId">
        <ElSelect v-model="roleId" :placeholder="$t('user.form.role.placeholder')">
          <ElOption v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.province.label')" :error="form.errors.value.province">
        <ElSelect
          v-model="province"
          filterable
          :placeholder="$t('user.form.province.placeholder')"
          @change="
            () => {
              district = ''
              ward = ''
            }
          "
        >
          <ElOption v-for="item in provinceOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.district.label')" :error="form.errors.value.district">
        <ElSelect
          :disabled="Boolean(!province || !districtOptions.length)"
          v-model="district"
          filterable
          :placeholder="$t('user.form.district.placeholder')"
          @change="ward = ''"
        >
          <ElOption v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('user.form.ward.label')" :error="form.errors.value.ward">
        <ElSelect
          :disabled="Boolean(!district || !wardOptions.length)"
          v-model="ward"
          filterable
          :placeholder="$t('user.form.district.placeholder')"
        >
          <ElOption v-for="item in wardOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton type="primary" @click="form.onSubmit">Submit</ElButton>
      <ElButton @click="onClose">Cancel</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { usePublicStore } from '@/modules/public/public.store'
import { DATE_FORMAT } from '@/shared/constants/format'
import { IconPlus } from '@tabler/icons-vue'
import { computed, onMounted, watch } from 'vue'
import { useUserForm } from '../user.form'
import { useUserStore } from '../user.store'
import { useMediaQuery } from '@vueuse/core'
import { UploadFile } from 'element-plus'

onMounted(async () => {
  await publicStore.fetchRoleOptions()
  await publicStore.fetchBankOptions()
  await publicStore.fetchProvinceOptions()
})

const store = useUserStore()
const publicStore = usePublicStore()

const form = useUserForm()
const formMode = store.userForm.mode

const uploadUrl = `${import.meta.env.VITE_APP_API_URL}/public/upload`

const isLargeScreen = useMediaQuery('(min-width: 768px)')

const avatarUrl = form.useFieldModel('avatarUrl')
const name = form.useFieldModel('name')
const email = form.useFieldModel('email')
const phone = form.useFieldModel('phone')
const birthDay = form.useFieldModel('birthDay')
const gender = form.useFieldModel('gender')
const address = form.useFieldModel('address')
const bank = form.useFieldModel('bank')
const bankAccount = form.useFieldModel('bankAccount')
const citizenId = form.useFieldModel('citizenId')
const status = form.useFieldModel('status')
const roleId = form.useFieldModel('roleId')
const province = form.useFieldModel('province')
const district = form.useFieldModel('district')
const ward = form.useFieldModel('ward')

const genderOptions = computed(() => publicStore.genderOptions)

const statusOptions = computed(() => publicStore.statusOptions)

const roleOptions = computed(() => publicStore.roleOptions)

const bankOptions = computed(() => publicStore.bankOptions)

const provinceOptions = computed(() => publicStore.provinceOptions)

const districtOptions = computed(() => publicStore.districtOptions)

const wardOptions = computed(() => publicStore.wardOptions)

const isShow = computed({
  get: () => store.userForm.open,
  set: (val) => store.patchUserForm({ open: val }),
})

function onClose() {
  store.patchUserForm({})
  form.resetForm({ values: {}, errors: {}, touched: {} })
}

function handleUploadSuccess(response: any, uploadFile: UploadFile) {
  avatarUrl.value = `${import.meta.env.VITE_APP_API_URL}/public/file/${response}`
}

watch(province, async () => {
  if (province.value) {
    await publicStore.fetchDistrictOptions(province.value)
  }
})

watch(district, async () => {
  if (district.value) {
    await publicStore.fetchWardOptions(province.value, district.value)
  } else {
  }
})
</script>
