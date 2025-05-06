import list from "../services/listService.js";
class ListController {
    getList(req, res) {
        try {
            const { page, limit, filter } = req.query
            const data = list.getData(page, limit, filter)
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    updateItem(req, res) {
        try {
            list.updateItem(req.body.item)
            res.status(204)
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    reorderItem(req, res) {
        try {
            const { currentItemId, nextItemId } = req.body
            list.reorderItem(currentItemId, nextItemId)
            res.status(204)
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default new ListController()