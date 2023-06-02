<template>
  <ElTable
    id="user-table"
    width="100%"
    size="small"
    :data="tableData"
    :header-cell-class-name="'border-t uppercase font-semibold'"
    :cell-class-name="getCellStyle"
    @cell-click="onClickCell"
  >
    <ElTableColumn fixed align="center" prop="name" :label="$t('attendance.table.user')">
      <template #default="scope">
        <div class="flex items-center justify-center">
          <ElTooltip effect="dark" placement="right" :content="scope.row.name">
            <ElAvatar :src="scope.row.avatarUrl">
              <img src="/avatar.png" />
            </ElAvatar>
          </ElTooltip>
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn fixed align="center" width="48" prop="absence" :label="'A'" />
    <ElTableColumn fixed align="center" width="48" prop="late" :label="'L'" />
    <ElTableColumn align="center" :label="startDate.format('MMMM YYYY')">
      <ElTableColumn
        v-for="(day, index) in dayInMonths"
        align="center"
        width="48"
        :prop="`attendance.${String(day)}`"
        :label="formatHeaderLabel(index + 1)"
      >
        <template #default="scope">
          <div class="flex justify-center text-white">
            <ElIcon v-if="scope.row.attendances[day] >= 8" :size="24">
              <component :is="IconCheck" />
            </ElIcon>
            <p v-else>
              {{ scope.row.attendances[day] && Number(scope.row.attendances[day]).toFixed(2) }}
            </p>
          </div>
        </template>
      </ElTableColumn>
    </ElTableColumn>
  </ElTable>
  <div class="flex justify-end p-4">
    <ElPagination
      background
      hide-on-single-page
      layout="sizes, prev, pager, next"
      :total="store.overviewTableData.total"
      :page-sizes="DEFAULT_PAGE_SIZES"
      v-model:current-page="page"
      v-model:page-size="take"
    />
  </div>
  <AttendanceDayTable :user-id="store.detailDialog.params.userId || NaN" :date="store.detailDialog.params.date || ''" />
</template>

<script setup lang="ts">
import { DEFAULT_PAGE_SIZES } from '@/shared/constants'
import { DATE_FORMAT } from '@/shared/constants/format'
import { IconCheck } from '@tabler/icons-vue'
import dayjs from 'dayjs'
import { TableColumnCtx } from 'element-plus'
import { computed, onMounted } from 'vue'
import { useAttendanceStore } from '../attendance.store'
import { UserAttendanceDto } from '../constants/attendance.dto'
import AttendanceDayTable from './AttendanceDayTable.vue'

onMounted(async () => {
  await store.fetchOverviewTableData()
})

const store = useAttendanceStore()

const page = computed({
  get: () => store.params.page,
  set: (val) => store.patchParams({ page: val }),
})

const take = computed({
  get: () => store.params.take,
  set: (val) => store.patchParams({ take: val }),
})

const startDate = computed(() => dayjs(store.params.startDate, DATE_FORMAT))

const tableData = computed(() => {
  return store.overviewTableData.items.map((item) => ({
    ...item,
    attendances: Object.fromEntries(item.attendances.map((attendance) => [attendance.date, attendance.total])),
  }))
})

const dayInMonths = computed(() => [...Array(startDate.value.daysInMonth()).keys()])

function formatHeaderLabel(val: number) {
  return startDate.value.startOf('month').set('date', val).format('DD')
}

function getCellStyle(cell?: any) {
  const date = (cell.columnIndex - 3) as number
  if (cell.columnIndex === 0) {
    return ''
  } else if (cell.columnIndex === 1) {
    return 'text-red-500'
  } else if (cell.columnIndex === 2) {
    return 'text-yellow-500'
  }

  const day = startDate.value.set('date', date + 1)
  const today = dayjs()
  const bgColor = () => {
    if (today.isBefore(day)) return ''
    if (day.get('day') % 6 === 0) return '!bg-gray-400'
    const total = cell.row.attendances[date] || 0
    return total >= 8 ? '!bg-green-500' : total >= 4 ? '!bg-yellow-500' : '!bg-red-500'
  }
  const cursor = today.isBefore(day) || day.get('day') % 6 === 0 ? 'pointer-events-none' : 'cursor-pointer'
  return `${bgColor()} ${cursor}`
}

function onClickCell(row: any, column: TableColumnCtx<UserAttendanceDto>) {
  const userId = row.id
  const date = dayjs(store.params.startDate, DATE_FORMAT)
    .startOf('month')
    .set('date', column.no + 1)
    .format(DATE_FORMAT)

  store.setDetailDialog(true, { userId, date })
  store.patchAttendanceForm({ id: userId, mode: 'create', data: { userId, date, checkIn: '', checkOut: '' } })
}
</script>
