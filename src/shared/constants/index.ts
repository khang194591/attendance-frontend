export * from './format'
export * from './query-params'

export type FormMode = 'create' | 'update'

export interface FormModal<T> {
  // Id của item nếu mode = 'create'
  id?: number
  open?: boolean
  data?: T
  mode?: FormMode
}
