import { NextFunction, Request, Response } from 'express';

import CardService from '../services/card.service.js';
import { CardStatus } from '../utils/enum.js';

async function createCard(req: Request, res: Response, next: NextFunction) {
  const { title, description } = req.body;
  const { publicId } = req.params;

  try {
    const card = await CardService.createCard(
      title,
      publicId.toString(),
      description,
    );

    return res.status(201).json({
      success: true,
      data: card,
      message: 'Card created successfully',
    });
  } catch (e) {
    return next(e);
  }
}

async function updateCardById(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;
  const { title, description } = req.body;

  try {
    const card = await CardService.updateCard(
      cardId.toString(),
      title,
      description,
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
        code: 'CARD_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: card,
      message: 'Card updated successfully',
    });
  } catch (e) {
    return next(e);
  }
}

async function moveCard(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;
  const { status, position } = req.body;

  try {
    const card = await CardService.moveCard(
      cardId.toString(),
      status as CardStatus,
      position,
    );

    return res.status(200).json({
      success: true,
      data: card,
      message: 'Card moved successfully',
    });
  } catch (e) {
    return next(e);
  }
}

async function deleteCardById(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;

  try {
    const card = await CardService.getCardById(cardId.toString());

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
        code: 'CARD_NOT_FOUND',
      });
    }

    await CardService.deleteCard(cardId.toString());

    return res.status(200).json({
      success: true,
      message: 'Card deleted successfully',
    });
  } catch (e) {
    return next(e);
  }
}

export { createCard, updateCardById, moveCard, deleteCardById };
