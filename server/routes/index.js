import { Router } from 'express';
import listController from '../controllers/listController.js';

const router = Router();

router.get('/api/items', listController.getList)
router.put('/api/items', listController.updateItem)
router.post('/api/items/reorder', listController.reorderItem)

export default router