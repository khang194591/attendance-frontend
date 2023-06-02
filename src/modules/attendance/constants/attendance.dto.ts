import { BaseQueryParamsDto } from '@/shared/interfaces'

export interface AttendanceDto {
  date: string
  checkIn: string
  checkOut: string
  userId: number
}

export interface AttendanceResponseDto extends AttendanceDto {
  id: number
}

export interface UserAttendanceDto {
  userId: number
  attendances: {
    date: number
    total: number
    items: AttendanceResponseDto[]
  }[]
}

export interface AttendanceQueryParamDto extends BaseQueryParamsDto {
  startDate: string
  endDate: string
}
