class List {
    list = []
    itemsMap = new Map()

    constructor () {
        this.init()
    }

    init() {
        this.list = Array.from({ length: 1_000_000 }, (_, i) => {
            const item = {
                id: i,
                value: String(i + 1),
                isChecked: false,
                order: i + 1
            }
            this.itemsMap.set(item.id, item)
            return item
        })
    }

    getData(page = 1, limit = 20, filter = '') {
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        let filteredItems = this.list

        if (filter) {
            filteredItems = filteredItems.filter(item => item.value.includes(filter))
        }

        const sortedItems = filteredItems.sort((a, b) => a.order - b.order)

        return { 
            items: sortedItems.slice(startIndex, endIndex), 
            total: sortedItems.length
        }
    }

    updateItem(updatedItem) {
        const item = this.itemsMap.get(updatedItem.id)
        if (!item) throw Error('Not found!')

        Object.assign(item, updatedItem)
    }

    reorderItem(currentItemId, nextItemId) {
        const currentItem = this.itemsMap.get(currentItemId)
        if (!currentItem) throw new Error('Not found!')

        const nextItem = nextItemId !== undefined ? this.itemsMap.get(nextItemId) : null
        if (!nextItem) throw new Error('Not found!')

        const nextIndex = nextItem ? this.list.findIndex(i => i.id === nextItem.id) : this.list.length

        const prevOrder = nextIndex > 0 ? this.list[nextIndex - 1].order : 0
        const nextOrder = nextIndex < this.list.length ? this.list[nextIndex].order : this.list.length + 1
        currentItem.order = (prevOrder + nextOrder) / 2

        this.list.sort((a, b) => a.order - b.order)
    }
}

export default new List()