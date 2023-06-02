import { RoleResponseDto } from '@/modules/setting/role/constants/role.dto'
import { Gender, SortBy, Status } from './user.constants'
import { BaseDto, BaseQueryParamsDto } from '@/shared/interfaces'

export interface UserDto {
  email: string
  name: string
  avatarUrl: string
  phone: string
  birthDay: string
  gender: Gender
  address: string
  bank: string
  bankAccount: string
  citizenId: string
  status: Status
  roleId: number
  province: string
  district: string
  ward: string
}

export interface UserResponseDto extends UserDto, BaseDto {
  role: RoleResponseDto
}

export interface UserQueryParamsDto extends BaseQueryParamsDto<SortBy> {
  name?: string
  email?: string
  phone?: string
  gender?: Gender[]
  status?: Status[]
  roleId?: number[]
}
