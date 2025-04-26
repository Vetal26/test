import { Router } from 'express';

const router = Router();

router.get('/api', (req, res) => {
    res.status(200).send('Success!')
})

export default router