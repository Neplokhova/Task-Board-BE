import express from 'express';
import boardsRouter from './board_route.js';
import cardsRouter from './card_route.js';

const router = express.Router();

router.get('/hc', (req, res) => res.json('HCS API is working'));
router.use('/board', boardsRouter);
router.use('/card', cardsRouter);
export default router;
