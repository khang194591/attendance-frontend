<template>
  <ElTable
    id="user-table"
    width="100%"
    :data="userList.items"
    :header-cell-class-name="'border-t uppercase font-semibold'"
    @sort-change="store.onChangeSort"
  >
    <!-- <ElTableColumn type="selection" width="50" align="center" /> -->
    <ElTableColumn prop="name" :label="$t('user.entity')" sortable="custom">
      <template #default="scope">
        <div class="flex items-center gap-3">
          <ElAvatar :src="scope.row.avatarUrl">
            <img src="/avatar.png" />
          </ElAvatar>
          <div class="flex flex-col items-start">
            <p class="font-semibold">{{ scope.row.name }}</p>
            <p class="text-xs">{{ scope.row.email }}</p>
          </div>
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="gender" :label="$t('user.form.gender.label')">
      <template #default="scope">
        <p :class="parseGenderColor(scope.row.gender).concat(' bg-clip-text text-transparent font-bold')">
          {{ $t(`user.gender.${scope.row.gender}`) }}
        </p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="phone" :label="$t('user.form.phone.label')" />
    <ElTableColumn prop="birthDay" :label="$t('user.form.birthDay.label')" />
    <ElTableColumn prop="role.name" :label="$t('user.form.role.label')" />
    <ElTableColumn align="center" width="160" prop="status" :label="$t('user.form.status.label')">
      <template #default="scope">
        <ElTag :type="parseStatusType(scope.row.status)">{{ $t(`user.status.${scope.row.status}`) }}</ElTag>
      </template>
    </ElTableColumn>

    <ElTableColumn :label="$t('common.button.action')" width="120px" align="center">
      <template #default="scope">
        <ElTooltip :content="$t('common.button.edit')">
          <ElButton circle type="primary" :icon="IconEdit" @click="onEdit(scope.row.id)" />
        </ElTooltip>
        <ElTooltip :content="$t('common.button.delete')">
          <ElButton circle :icon="IconTrash" @click="onDelete(scope.row.id)" />
        </ElTooltip>
      </template>
    </ElTableColumn>
    <!-- Empty data display -->
    <template #empty>
      <ElEmpty :description="'No data'" />
    </template>
  </ElTable>
  <div class="flex justify-end p-4">
    <ElPagination
      background
      layout="sizes, prev, pager, next"
      :total="userList.total"
      :page-sizes="DEFAULT_PAGE_SIZES"
      v-model:current-page="page"
      v-model:page-size="take"
    />
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_PAGE_SIZES } from '@/shared/constants'
import { showConfirmNotification, showErrorNotification, showSuccessNotification } from '@/shared/utils/notification'
import { IconEdit, IconTrash } from '@tabler/icons-vue'
import { ElLoading } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Gender, Status } from '../constants/user.constants'
import { useUserStore } from '../user.store'

const { t } = useI18n()

const store = useUserStore()

const { userList } = storeToRefs(store)

const page = computed({
  get: () => store.params.page,
  set: (val) => store.patchParams({ page: val }),
})

const take = computed({
  get: () => store.params.take,
  set: (val) => store.patchParams({ take: val }),
})

function parseStatusType(status: Status) {
  return status === Status.active ? 'success' : status === Status.pending ? 'warning' : 'danger'
}

function parseGenderColor(gender: Gender) {
  return gender === Gender.male
    ? 'bg-blue-500'
    : gender === Gender.female
    ? 'bg-pink-500'
    : 'bg-gradient-to-br from-red-500 via-green-500 to-fuchsia-500'
}

async function onEdit(id: number) {
  try {
    const loading = ElLoading.service({
      target: '#user-form',
    })
    const user = await store.apiService.getById(id)
    store.patchUserForm({ id, data: user, open: true, mode: 'update' })
    loading.close()
  } catch (error: any) {
    showErrorNotification(error.message)
  }
}

async function onDelete(id: number) {
  try {
    const isConfirm = await showConfirmNotification('Are you sure to delete this item', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
    if (isConfirm) {
      const loading = ElLoading.service({
        target: '#user-table',
      })
      const deletedItem = await store.apiService.deleteById(id)
      if (deletedItem) {
        showSuccessNotification(t('common.response.deleteSuccess', { field: t('user.entity') }))
      }
      await store.fetchUserList()
      loading.close()
    }
  } catch (error) {
    showErrorNotification()
  }
}
</script>
