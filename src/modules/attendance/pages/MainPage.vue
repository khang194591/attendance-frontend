<template>
  <div class="flex-1 flex flex-col gap-8 px-4">
    <div class="bg-white border my-4 rounded-lg">
      <div class="inline-flex justify-between p-4 w-full">
        <div class="w-48">
          <ElDatePicker v-model="month" :editable="false" type="month" />
        </div>
        <ElButton v-if="store.canCreate" type="primary" :icon="IconPlus" @click="onCreate">{{
          $t('common.button.add')
        }}</ElButton>
      </div>
      <AttendanceTable />
      <AttendanceForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DATE_FORMAT } from '@/shared/constants'
import { IconPlus } from '@tabler/icons-vue'
import dayjs from 'dayjs'
import { computed, onMounted } from 'vue'
import { useAttendanceStore } from '../attendance.store'
import AttendanceForm from '../components/AttendanceForm.vue'
import AttendanceTable from '../components/AttendanceTable.vue'

onMounted(async () => {
  await store.fetchOverviewTableData()
})

const month = computed({
  get: () => dayjs(store.params.startDate, DATE_FORMAT).format('YYYY-MM'),
  set: (val) => {
    if (val) {
      const selected = dayjs(val)
      store.patchParams({
        startDate: selected.startOf('month').format(DATE_FORMAT),
        endDate: selected.endOf('month').format(DATE_FORMAT),
      })
    }
  },
})

const store = useAttendanceStore()

function onCreate() {
  store.patchAttendanceForm({ mode: 'create', open: true })
}
</script>
