<template>
  <ElDialog id="attendance-day-table" width="80%" destroy-on-close v-model="isShow" :before-close="onClose">
    <template #header>
      <div class="inline-flex items-center gap-4">
        <p>{{ upperFirst($t('attendance.entity')) }}</p>
        <ElButton v-if="store.canCreate" size="small" type="primary" @click="onCreate">{{
          $t('common.button.create')
        }}</ElButton>
      </div>
    </template>
    <ElTable :data="store.detailTableData" :border="true" :header-cell-class-name="'!bg-slate-50'">
      <ElTableColumn v-if="store.canCreate" type="selection" width="50" align="center" />
      <ElTableColumn prop="user.name" :label="$t('attendance.table.user')" />
      <ElTableColumn prop="checkIn" :label="$t('attendance.table.checkIn')" />
      <ElTableColumn prop="checkOut" :label="$t('attendance.table.checkOut')" />
      <ElTableColumn prop="date" :label="$t('attendance.table.date')" />
      <ElTableColumn v-if="store.canCreate" :label="$t('common.button.action')" width="120px" align="center">
        <template #default="scope">
          <ElButton circle type="primary" :icon="IconEdit" @click="onEdit(scope.row)" />
          <ElButton circle type="danger" :icon="IconTrash" @click="onDelete(scope.row.id)" />
        </template>
      </ElTableColumn>
    </ElTable>
  </ElDialog>
</template>

<script setup lang="ts">
import { showConfirmNotification, showErrorNotification, showSuccessNotification } from '@/shared/utils/notification'
import { IconEdit, IconTrash } from '@tabler/icons-vue'
import { ElLoading } from 'element-plus'
import { computed, watch } from 'vue'
import { useAttendanceStore } from '../attendance.store'
import { AttendanceResponseDto } from '../constants/attendance.dto'
import { upperFirst } from 'lodash'

const props = defineProps<{ userId: number; date: string }>()

const store = useAttendanceStore()

const isShow = computed({
  get: () => store.detailDialog.isOpen,
  set: (val) => store.setDetailDialog(val, {}),
})

const queryParams = computed(() => store.detailDialog.params)

function onCreate() {
  store.patchAttendanceForm({
    id: props.userId,
    mode: 'create',
    open: true,
    data: { ...props, checkIn: '', checkOut: '' },
  })
}

async function onEdit(data: AttendanceResponseDto) {
  try {
    const loading = ElLoading.service({
      target: '#user-form',
    })
    store.patchAttendanceForm({
      id: props.userId,
      mode: 'update',
      open: true,
      data: data,
    })
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
        target: '#attendance-day-table',
      })
      await store.apiService.deleteById(id)
      await store.fetchDetailTableData()
      await store.fetchOverviewTableData()
      loading.close()
      showSuccessNotification()
    }
  } catch (error) {
    showErrorNotification()
  }
}

function onClose() {
  store.setDetailDialog(false)
}

watch(queryParams, async () => {
  await store.fetchDetailTableData()
})
</script>
