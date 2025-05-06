import { Router } from 'express';
import listController from '../controllers/listController.js';

const router = Router();

router.get('/items', listController.getList.bind(listController))
router.put('/items', listController.updateItem.bind(listController))
router.put('/items/reorder', listController.reorderItem.bind(listController))

export default router