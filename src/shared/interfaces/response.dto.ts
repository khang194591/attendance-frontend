import { sortOrderKeys } from '../constants'

export type SortOrder = (typeof sortOrderKeys)[number]

export interface BaseQueryParamsDto<S = any> {
  sortBy?: S
  sortOrder?: SortOrder

  page?: number
  take?: number
}

export interface PaginatedDto<T> {
  items: T[]
  total: number
  totalPage?: number
}

export interface BaseDto {
  id: number

  createdAt: Date
  updatedAt: Date
}

export interface ErrorResponse {
  statusCode?: number
  message: string
  error?: string
}
