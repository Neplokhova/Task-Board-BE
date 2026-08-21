import express from 'express';
import {
  createBoard,
  updateBoardById,
  getBoardByPublicId,
  deleteBoardById,
} from '../controllers/board.controller.js';
import { createCard } from '../controllers/card.controller.js';
import { validateMiddleware } from '../middleware/validate.middleware.js';
import {
  createBoardSchema,
  updateBoardSchema,
} from '../validation/board.validation.js';
import { createCardSchema } from '../validation/card.validation.js';

const router = express.Router();

router.route('/').post(validateMiddleware(createBoardSchema), createBoard);

router
  .route('/:publicId')
  .get(getBoardByPublicId)
  .patch(validateMiddleware(updateBoardSchema), updateBoardById)
  .delete(deleteBoardById);

router.post(
  '/:publicId/cards',
  validateMiddleware(createCardSchema),
  createCard,
);

export default router;
