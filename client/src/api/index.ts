import { PaginatedItems, TItem } from '../types'

const BACKEND_URL = `/api`

const request = async (
  url = '',
  path = '',
  method = '',
  body: string | null,
) => {
  try {
    const response = await fetch(`${url}${path}`, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    })

    return await response.json()
  } catch (e) {
    return e
  }
}
export const api = {
  getItems: async (path: string): Promise<PaginatedItems> =>
    request(BACKEND_URL, path, 'GET', null),
  updateItem: async (path: string, body: { item: TItem }) =>
    request(BACKEND_URL, path, 'PUT', JSON.stringify(body)),
  reorderItem: async (path: string, body: { item: TItem }) =>
    request(BACKEND_URL, path, 'POST', JSON.stringify(body)),
}
