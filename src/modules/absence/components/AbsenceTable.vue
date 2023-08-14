<template>
  <ElTable
    id="absence-table"
    width="100%"
    :data="store.absenceList.items"
    :header-cell-class-name="'border-t uppercase font-semibold'"
  >
    <ElTableColumn prop="userId" :label="$t('user.entity')">
      <template #default="scope">
        <div class="flex items-center gap-3">
          <ElAvatar :src="scope.row.user.avatarUrl">
            <img src="/avatar.png" />
          </ElAvatar>
          <div class="flex flex-col items-start">
            <p class="font-semibold">{{ scope.row.user.name }}</p>
            <p class="text-xs">{{ scope.row.user.email }}</p>
          </div>
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="createdAt" :label="$t('absence.form.createdAt.label')"></ElTableColumn>
    <ElTableColumn prop="date" :label="$t('absence.form.date.label')"></ElTableColumn>
    <ElTableColumn prop="reason" :label="$t('absence.form.reason.label')"></ElTableColumn>
    <ElTableColumn :label="$t('common.button.action')" width="120px" align="center">
      <template #default="scope">
        <div v-if="scope.row.status === 'pending'">
          <ElTooltip :content="$t('common.button.accept')">
            <ElButton circle type="success" :icon="IconCheck" @click="onAccept(scope.row)" />
          </ElTooltip>
          <ElTooltip :content="$t('common.button.reject')">
            <ElButton circle type="danger" :icon="IconX" @click="onReject(scope.row)" />
          </ElTooltip>
        </div>
        <div v-else>
          <ElTag :type="parseStatusType(scope.row.status)">{{ $t(`absence.status.${scope.row.status}`) }}</ElTag>
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { IconCheck, IconX } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { useAbsenceStore } from '../absence.store'
import { Status } from '../constants/absence.constants'
import axios from 'axios'

const { t } = useI18n()

const store = useAbsenceStore()

function parseStatusText(status: Status) {
  return status === Status.active ? 'accepted' : status === Status.pending ? 'pending' : 'rejected'
}

function parseStatusType(status: Status) {
  return status === Status.active ? 'success' : status === Status.pending ? 'warning' : 'danger'
}

async function onAccept(item: any) {
  console.log(item)
  await axios.put(`/absence/${item.id}`, { status: 'active' })
  await store.fetchAbsenceList()
}

async function onReject(item: any) {
  console.log(item)
  await axios.put(`/absence/${item.id}`, { status: 'inactive' })
  await store.fetchAbsenceList()
}
</script>
