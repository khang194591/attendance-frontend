import { useApiClient } from '@/shared/hooks/api'
import { defineStore } from 'pinia'
import { RoleDto, RoleResponseDto } from './constants/role.dto'
import { ref } from 'vue'
import { PaginatedDto } from '@/shared/interfaces'
import { ElLoading } from 'element-plus'

export const useRoleStore = defineStore('role', () => {
  const apiService = useApiClient<RoleResponseDto, RoleDto>('setting/role')

  const roleList = ref<PaginatedDto<RoleResponseDto>>({ items: [], total: 0 })

  async function fetchRoleList() {
    const loading = ElLoading.service({ target: '#role-page' })
    const response = await apiService.getAll()
    response && (roleList.value = response)
    loading.close()
  }

  async function update(id: number, data: RoleDto) {
    await apiService.update(id, data)
  }

  return { roleList, fetchRoleList, update }
})
