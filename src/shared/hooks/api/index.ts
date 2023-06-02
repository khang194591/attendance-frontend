import { BaseQueryParamsDto, PaginatedDto } from '@/shared/interfaces'
import { showErrorNotification, showSuccessNotification } from '@/shared/utils/notification'
import axios from 'axios'

// Simple CRUD api model
export const useApiClient = <ResponseDto, SendDto = ResponseDto>(url: string) => {
  async function getAll(params?: BaseQueryParamsDto<any>): Promise<PaginatedDto<ResponseDto> | undefined> {
    const response = await axios.get<PaginatedDto<ResponseDto>>(url, { params })
    if (response.success) {
      return response.data
    } else {
      showErrorNotification(response.message)
    }
  }

  async function getById(id: number): Promise<ResponseDto | undefined> {
    const response = await axios.get<ResponseDto>(`${url}/${id}`)
    if (response.success) {
      return response.data
    } else {
      showErrorNotification(response.message)
      return undefined
    }
  }

  async function create(data: SendDto): Promise<ResponseDto | undefined> {
    const response = await axios.post<ResponseDto>(url, data)
    if (response.success) {
      return response.data
    } else {
      showErrorNotification(response.message)
    }
  }

  async function update(id: number, data: SendDto): Promise<ResponseDto | undefined> {
    const response = await axios.put<ResponseDto>(`${url}/${id}`, data)
    if (response.success) {
      return response.data
    } else {
      showErrorNotification(response.message)
    }
  }

  async function deleteById(id: number): Promise<ResponseDto | undefined> {
    const response = await axios.delete<ResponseDto>(`${url}/${id}`)
    if (response.success) {
      return response.data
    } else {
      showErrorNotification(response.message)
    }
  }

  return { getAll, getById, create, update, deleteById }
}
