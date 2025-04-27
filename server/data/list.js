class List {
    list = []

    init() {
        this.list = Array.from({ length: 1_000_000 }, (_, i) => ({
            id: i,
            value: String(i + 1),
            isChecked: false,
            order: i
        }))

        return this
    }

    getData(page = 1, limit = 20, filter = '') {
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        let data = this.list

        if (filter) {
            data = data.filter(item => item.value.includes(filter))
        }

        return { 
            items: data.slice(startIndex, endIndex), 
            total: data.length
        }
    }

    updateItem(item) {
        const itemIdx = this.list.findIndex(i => item.id === i.id)

        if (itemIdx === -1) {
            throw Error('Not found!')
        }

        this.list[itemIdx] = item
    }

    reorderItem(item) {
        this.updateItem(item)
        this.list.sort((a, b) => a.order - b.order)
    }
}

const list = new List()
list.init()

export default list