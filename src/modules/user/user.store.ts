import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, FormModal } from '@/shared/constants'
import { useApiClient } from '@/shared/hooks/api'
import { PaginatedDto } from '@/shared/interfaces'
import { mapSortOrder } from '@/shared/utils'
import { ElLoading } from 'element-plus'
import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { FilterBy, SearchBy } from './constants/user.constants'
import { UserDto, UserQueryParamsDto, UserResponseDto } from './constants/user.dto'

export const useUserStore = defineStore('user', () => {
  const apiService = useApiClient<UserResponseDto, UserDto>('user')

  const params = ref<UserQueryParamsDto>({ page: DEFAULT_PAGE, take: DEFAULT_PAGE_SIZE })

  const userList = ref<PaginatedDto<UserResponseDto>>({ items: [], total: 0, totalPage: 0 })

  const userForm = ref<FormModal<UserDto>>({ open: false, data: undefined, mode: 'create' })

  const filterForm = useForm<Pick<UserQueryParamsDto, SearchBy | FilterBy>>({})

  async function onChangeSort(sort: any) {
    params.value = { ...params.value, sortBy: sort.order && sort.prop, sortOrder: mapSortOrder(sort.order) }
  }

  async function onResetFilterForm() {
    filterForm.resetForm({ values: {} })
    patchParams(filterForm.values)
  }

  const onSearch = filterForm.handleSubmit((values) => patchParams(values))

  function patchParams(values: Partial<UserQueryParamsDto>) {
    params.value = { ...params.value, ...values }
  }

  function patchUserForm({ id, data, open, mode = 'create' }: FormModal<UserDto>) {
    userForm.value = { id, data, open, mode }
  }

  async function fetchUserList(val?: UserQueryParamsDto) {
    const loading = ElLoading.service({ target: '#user-page' })
    const response = await apiService.getAll(val ?? params.value)
    if (response) {
      userList.value = response
    }
    loading.close()
  }

  watch(params, async () => await fetchUserList())

  return {
    apiService,
    params,
    userList,
    userForm,
    filterForm,
    onSearch,
    onChangeSort,
    onResetFilterForm,
    patchParams,
    patchUserForm,
    fetchUserList,
  }
})
