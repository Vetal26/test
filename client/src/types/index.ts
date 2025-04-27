export type TItem = {
  id: number
  value: string
  isChecked: boolean
  order: number
}

export interface PaginatedItems {
  items: TItem[]
  total: number
}
