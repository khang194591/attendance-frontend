import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, FormModal } from '@/shared/constants'
import { useApiClient } from '@/shared/hooks/api'
import { PaginatedDto } from '@/shared/interfaces'
import { mapSortOrder } from '@/shared/utils'
import { ElLoading } from 'element-plus'
import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { FilterBy, SearchBy } from './constants/absence.constants'
import { AbsenceDto, AbsenceQueryParamsDto, AbsenceResponseDto } from './constants/absence.dto'

export const useAbsenceStore = defineStore('absence', () => {
  const apiService = useApiClient<AbsenceResponseDto, AbsenceDto>('absence')

  const params = ref<AbsenceQueryParamsDto>({ page: DEFAULT_PAGE, take: DEFAULT_PAGE_SIZE })

  const absenceList = ref<PaginatedDto<AbsenceResponseDto>>({ items: [], total: 0, totalPage: 0 })

  const absenceForm = ref<FormModal<AbsenceDto>>({ open: false, data: undefined, mode: 'create' })

  const filterForm = useForm<Pick<AbsenceQueryParamsDto, SearchBy | FilterBy>>({})

  async function onChangeSort(sort: any) {
    params.value = { ...params.value, sortBy: sort.order && sort.prop, sortOrder: mapSortOrder(sort.order) }
  }

  async function onResetFilterForm() {
    filterForm.resetForm({ values: {} })
    patchParams(filterForm.values)
  }

  const onSearch = filterForm.handleSubmit((values) => patchParams(values))

  function patchParams(values: Partial<AbsenceQueryParamsDto>) {
    params.value = { ...params.value, ...values }
  }

  function patchAbsenceForm({ id, data, open, mode = 'create' }: FormModal<AbsenceDto>) {
    absenceForm.value = { id, data, open, mode }
  }

  async function fetchAbsenceList(val?: AbsenceQueryParamsDto) {
    const loading = ElLoading.service({ target: '#absence-page' })
    const response = await apiService.getAll(val ?? params.value)
    if (response) {
      absenceList.value = response
    }
    loading.close()
  }

  watch(params, async () => await fetchAbsenceList())

  return {
    apiService,
    params,
    absenceList,
    absenceForm,
    filterForm,
    onSearch,
    onChangeSort,
    onResetFilterForm,
    patchParams,
    patchAbsenceForm,
    fetchAbsenceList,
  }
})
