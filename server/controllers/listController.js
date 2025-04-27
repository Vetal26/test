import list from "../data/list.js";

class ListController {
    getList(req, res) {
        try {
            const { page, limit, filter } = req.query
            const data = list.getData(page, limit, filter)
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send(error);
        }
    }

    updateItem(req, res) {
        try {
            list.updateItem(req.body.item)
            res.status(200)
        } catch (error) {
            res.status(500).send(error);
        }
    }

    reorderItem(req, res) {
        try {
            list.reorderItem(req.body.item)
            res.status(200)
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new ListController()