import { PaginatedItems, TItem } from '../types'

const BACKEND_URL = `http://localhost:8080/api`

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
  reorderItem: async (
    path: string,
    body: { currentItemId: TItem['id']; nextItemId: TItem['id'] | undefined },
  ) => request(BACKEND_URL, path, 'PUT', JSON.stringify(body)),
}
