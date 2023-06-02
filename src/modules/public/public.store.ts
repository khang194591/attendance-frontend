import { PaginatedDto } from '@/shared/interfaces'
import { showErrorNotification } from '@/shared/utils/notification'
import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RoleResponseDto } from '../setting/role/constants/role.dto'
import { Gender, Status } from '../user/constants/user.constants'
import { UserResponseDto } from '../user/constants/user.dto'

interface IOption {
  value: string | number
  label: string
}

export const usePublicStore = defineStore('public', () => {
  type PublicUser = Pick<UserResponseDto, 'id' | 'name'>
  type PublicRole = Omit<RoleResponseDto, 'permissions'>
  type IBank = { name: string; code: string }

  const genderOptions = Object.values(Gender).map((item) => ({ label: item, value: item }))
  const statusOptions = Object.values(Status).map((item) => ({ label: item, value: item }))

  const userOptions = ref<IOption[]>([])
  const roleOptions = ref<IOption[]>([])
  const bankOptions = ref<IOption[]>([])
  const provinceOptions = ref<IOption[]>([])
  const districtOptions = ref<IOption[]>([])
  const wardOptions = ref<IOption[]>([])

  async function fetchUserOptions() {
    try {
      const response = await axios.get<PaginatedDto<PublicUser>>('/public/user')
      userOptions.value = response.data.items.map((item) => ({ value: item.id, label: item.name }))
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorNotification(error.message)
      }
    }
  }

  async function fetchRoleOptions() {
    try {
      const response = await axios.get<PaginatedDto<PublicRole>>('/public/role')
      roleOptions.value = response.data.items.map((item) => ({ value: item.id, label: item.name }))
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorNotification(error.message)
      }
    }
  }

  async function fetchBankOptions() {
    try {
      const response = await axios.get<PaginatedDto<IBank>>('/public/bank')
      bankOptions.value = response.data.items.map((item) => ({ value: item.name, label: item.name }))
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorNotification(error.message)
      }
    }
  }

  async function fetchProvinceOptions() {
    try {
      const response = await axios.get<PaginatedDto<string>>('/public/province')
      provinceOptions.value = response.data.items.map((item) => ({ value: item, label: item }))
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorNotification(error.message)
      }
    }
  }

  async function fetchDistrictOptions(province: string) {
    try {
      const response = await axios.get<PaginatedDto<string>>(`/public/province/${province}`)
      districtOptions.value = response.data.items.map((item) => ({ value: item, label: item }))
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorNotification(error.message)
      }
    }
  }

  async function fetchWardOptions(province: string, district: string) {
    try {
      const response = await axios.get<PaginatedDto<string>>(`/public/province/${province}/${district}`)
      wardOptions.value = response.data.items.map((item) => ({ value: item, label: item }))
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorNotification(error.message)
      }
    }
  }

  return {
    genderOptions,
    statusOptions,

    userOptions,
    fetchUserOptions,
    roleOptions,
    fetchRoleOptions,
    bankOptions,
    fetchBankOptions,
    provinceOptions,
    fetchProvinceOptions,
    districtOptions,
    fetchDistrictOptions,
    wardOptions,
    fetchWardOptions,
  }
})
