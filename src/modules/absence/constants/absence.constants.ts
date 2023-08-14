import { baseSortByKeys, baseUniqueKeys } from '@/shared/constants'

// Những trường unique để tìm kiếm
export const uniqueKeys = ['date', ...baseUniqueKeys] as const
export type Unique = (typeof uniqueKeys)[number]

// Những trường có thể sắp xếp
export const sortByKeys = ['date', ...baseSortByKeys] as const
export type SortBy = (typeof sortByKeys)[number]

// Những trường dùng để tìm kiếm
export const searchByKeys = ['date'] as const
export type SearchBy = (typeof searchByKeys)[number]

// Những trường để lọc theo giá trị chính xác,
export const filterByKeys = ['date'] as const
export type FilterBy = (typeof filterByKeys)[number]

export enum Status {
  active = 'active',
  pending = 'pending',
  inactive = 'inactive',
}
