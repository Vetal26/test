import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { FixedSizeList, ListOnScrollProps } from 'react-window'
import { api } from '../api'
import Loading from './Loading'
import Row from './Row'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TItem } from '../types'

const LIMIT = '20'

const List = () => {
  const [list, setList] = useState<TItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [filter, setFilter] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasMore, setHasMore] = useState(true)

  const listRef = useRef<FixedSizeList<TItem[]>>(null)

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.trim())
    setPage(1)
  }

  const fetchData = (page: number, filter: string = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT,
      filter,
    }).toString()

    return api.getItems(`/items?${params}`)
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        const result = await fetchData(1, filter)
        setList(result.items)
        setHasMore(result.total > Number(LIMIT))
        setPage(1)
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const searchItems = async (filter: string) => {
      setIsLoading(true)
      try {
        const result = await fetchData(1, filter)
        setList(result.items)
        setHasMore(result.total > Number(LIMIT))
        setPage(1)
      } catch (error) {
        console.error('Error searching items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (filter) {
      searchItems(filter)
    } else {
      loadMoreItems(1, true)
    }

    searchItems(filter)
  }, [filter])

  const loadMoreItems = useCallback(
    async (newPage: number, reset = false) => {
      if (isLoading) return

      setIsLoading(true)
      try {
        const result = await fetchData(newPage, filter)

        setList((prev) => (reset ? result.items : [...prev, ...result.items]))
        setHasMore(
          result.items.length === Number(LIMIT) &&
            result.total > newPage * Number(LIMIT),
        )
        setPage(newPage)
      } catch (error) {
        console.error('Error loading more items:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, filter],
  )

  const handleScroll = useCallback(
    ({ scrollOffset, scrollUpdateWasRequested }: ListOnScrollProps) => {
      if (scrollUpdateWasRequested || !hasMore) return

      const list = listRef.current
      if (!list) return

      const offset = list.props.height as number
      const scrollPosition = scrollOffset + offset
      const totalHeight = list.props.itemCount * (list.props.itemSize as number)

      if (scrollPosition >= totalHeight - offset) {
        loadMoreItems(page + 1)
      }
    },
    [hasMore, loadMoreItems, page],
  )

  const toggleSelect = (id: number) => {
    const itemIdx = list.findIndex((i) => i.id === id)
    if (itemIdx !== -1) {
      const updatedItem = {
        ...list[itemIdx],
        isChecked: !list[itemIdx].isChecked,
      }
      setList([
        ...list.slice(0, itemIdx),
        updatedItem,
        ...list.slice(itemIdx + 1),
      ])

      api.updateItem('/items', { item: updatedItem })
    }
  }

  const moveRow = useCallback(async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    setList((prev) => {
      const newItems = [...prev]
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)

      if (toIndex > 0 && toIndex !== newItems.length - 1) {
        newItems[toIndex].order =
          (newItems[toIndex - 1].order + newItems[toIndex + 1].order) / 2
      } else if (toIndex === 0) {
        newItems[toIndex].order = toIndex
      } else {
        newItems[toIndex].order =
          (newItems[toIndex - 1].order + newItems.length) / 2
      }

      api.reorderItem('/items/reorder', { item: newItems[toIndex] })

      return newItems
    })
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <div className="search">
          <label>
            <span>Поиск: </span>
            <input type="text" value={filter} onChange={handleSearch} />
          </label>
        </div>
        {list.length > 0 && (
          <FixedSizeList
            ref={listRef}
            height={600}
            itemCount={list.length}
            itemSize={50}
            width="100%"
            onScroll={handleScroll}
          >
            {({ index, style }) => (
              <Row
                data={list}
                index={index}
                style={style}
                moveRow={moveRow}
                toggleSelect={toggleSelect}
              />
            )}
          </FixedSizeList>
        )}
        {isLoading && <Loading />}
      </div>
    </DndProvider>
  )
}

export default List
