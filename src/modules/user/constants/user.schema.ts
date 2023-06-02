import { DATE_FORMAT, baseQuerySchema } from '@/shared/constants'
import dayjs from 'dayjs'
import { array, number, object, string } from 'yup'
import { Gender, Status } from './user.constants'

export const userSchema = object({
  email: string().email().required(),
  name: string().required(),
  avatarUrl: string().optional().nullable(),
  phone: string().optional().nullable(),
  birthDay: string()
    .optional()
    .nullable()
    .test('format', (val) => (val ? dayjs(val, DATE_FORMAT).isValid() : true)),
  gender: string().oneOf(Object.values(Gender)).optional().nullable(),
  address: string().optional().nullable(),
  bank: string().optional().nullable(),
  bankAccount: string().optional().nullable(),
  citizenId: string().optional().nullable(),
  status: string().oneOf(Object.values(Status)).optional().nullable().default(Status.pending),
  roleId: number().positive().required(),
  province: string().optional().nullable(),
  district: string().optional().nullable(),
  ward: string().optional().nullable(),
})

export const querySchema = baseQuerySchema.concat(
  object({
    name: string(),
    email: string(),
    phone: string(),
    gender: array().of(string().oneOf(Object.values(Gender))),
    status: array().of(string().oneOf(Object.values(Status))),
    roleId: array().of(number().positive()),
  }),
)
