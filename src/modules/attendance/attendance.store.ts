import axios from 'axios'
import { ElLoading, dayjs } from 'element-plus'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { useApiClient } from '@/shared/hooks/api'
import { showErrorNotification } from '@/shared/utils/notification'
import {
  AttendanceDto,
  AttendanceQueryParamDto,
  AttendanceResponseDto,
  UserAttendanceDto,
} from './constants/attendance.dto'
import { DATE_FORMAT, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, FormModal } from '@/shared/constants'
import { Action, PaginatedDto, Resource } from '@/shared/interfaces'
import { checkHaveAllPermissions } from '@/shared/utils'

export const useAttendanceStore = defineStore('attendance', () => {
  const apiService = useApiClient<AttendanceResponseDto, AttendanceDto>('attendance')

  const canCreate = checkHaveAllPermissions([`${Resource.attendance}#${Action.create}`])

  const params = ref<AttendanceQueryParamDto>({
    page: DEFAULT_PAGE,
    take: DEFAULT_PAGE_SIZE,
    startDate: dayjs().startOf('month').format(DATE_FORMAT),
    endDate: dayjs().endOf('month').format(DATE_FORMAT),
  })

  const overviewTableData = ref<PaginatedDto<UserAttendanceDto>>({ items: [], total: 0, totalPage: 0 })
  const detailTableData = ref<AttendanceDto[]>([])

  const attendanceForm = ref<FormModal<AttendanceDto>>({ open: false, data: undefined, mode: 'create' })

  function patchParams(val: Partial<AttendanceQueryParamDto>) {
    params.value = { ...params.value, ...val }
  }

  function patchAttendanceForm({ id, mode = 'create', open, data }: FormModal<AttendanceDto>) {
    attendanceForm.value = { id, mode, open, data }
  }

  const detailDialog = reactive({
    isOpen: false,
    params: {} as { userId: number; date: string },
  })

  function setDetailDialog(isOpen: boolean, params?: Partial<{ userId: number; date: string }>) {
    detailDialog.isOpen = isOpen
    detailDialog.params = { ...detailDialog.params, ...params }
  }

  async function fetchOverviewTableData(queryParams?: AttendanceQueryParamDto) {
    const loading = ElLoading.service({ target: '#attendance-table' })
    overviewTableData.value = await (
      await axios.get('/attendance/time-sheet', { params: queryParams ?? params.value })
    ).data
    loading.close()
  }

  async function fetchDetailTableData() {
    const loading = ElLoading.service({
      target: '#attendance-day-table',
    })
    try {
      const response = await axios.get<AttendanceDto[]>('/attendance/day', {
        params: detailDialog.params,
      })
      detailTableData.value = response.data
    } catch (error: any) {
      showErrorNotification(error.message)
    }
    loading.close()
  }

  watch(params, async () => await fetchOverviewTableData())

  return {
    apiService,
    canCreate,
    params,
    overviewTableData,
    detailTableData,
    detailDialog,
    attendanceForm,
    patchParams,
    fetchOverviewTableData,
    fetchDetailTableData,
    patchAttendanceForm,
    setDetailDialog,
  }
})
