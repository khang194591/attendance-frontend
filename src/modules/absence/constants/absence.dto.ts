import { BaseDto, BaseQueryParamsDto } from '@/shared/interfaces'
import { SortBy, Status } from './absence.constants'

export interface AbsenceDto {
  date: string
  reason: string
  status: Status
  userId: number
}

export interface AbsenceResponseDto extends AbsenceDto, BaseDto {}

export interface AbsenceQueryParamsDto extends BaseQueryParamsDto<SortBy> {
  date?: string
}
