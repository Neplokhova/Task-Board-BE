import express from 'express';

import {
  updateCardById,
  moveCard,
  deleteCardById,
} from '../controllers/card.controller.js';

import { validateMiddleware } from '../middleware/validate.middleware.js';

import {
  updateCardSchema,
  moveCardSchema,
} from '../validation/card.validation.js';

const router = express.Router();

router.patch('/:cardId/move', validateMiddleware(moveCardSchema), moveCard);

router
  .route('/:cardId')
  .patch(validateMiddleware(updateCardSchema), updateCardById)
  .delete(deleteCardById);

export default router;
