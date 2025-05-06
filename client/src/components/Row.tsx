import { useId, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { TItem } from '../types'

type TItemProps = {
  item: TItem
  index: number
  style: React.CSSProperties
  moveRow: (fromIndex: number, toIndex: number) => void
  toggleSelect: (id: number) => void
}
const Row = ({ item, index, style, moveRow, toggleSelect }: TItemProps) => {
  const checkboxId = useId()
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: 'ROW',
    drop: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index)
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'ROW',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      className={`item ${item.isChecked ? 'checked' : ''}`}
      ref={ref}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <input
        type="checkbox"
        id={checkboxId}
        checked={item.isChecked}
        onChange={() => toggleSelect(item.id)}
        style={{ margin: '0 10px' }}
      />
      <label htmlFor={checkboxId}>{item.value}</label>
    </div>
  )
}

export default Row
