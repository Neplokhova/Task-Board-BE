import {
  boardRepository,
  cardRepository,
} from '../repositories/index.repository.js';

import { AppError } from '../middleware/error.middleware.js';
import { CardStatus } from '../utils/enum.js';

class CardService {
  async createCard(title: string, publicId: string, description?: string) {
    const board = await boardRepository.findBoardByPublicId(publicId);

    if (!board) {
      throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    const lastCard = await cardRepository.findLastByBoardAndStatus(
      board._id,
      CardStatus.TODO,
    );

    const position = lastCard ? lastCard.position + 1 : 0;

    return await cardRepository.createOne({
      title: title.trim(),
      description: description?.trim() ?? '',
      status: CardStatus.TODO,
      boardId: board._id,
      position,
    });
  }

  async updateCard(cardId: string, title?: string, description?: string) {
    return await cardRepository.updateById(
      cardId,
      {
        title,
        description,
      },
      {
        new: true,
      },
    );
  }

  async moveCard(cardId: string, status: CardStatus, position: number) {
    const card = await cardRepository.moveCard(cardId, status, position);

    if (!card) {
      throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');
    }

    return card;
  }

  async deleteCard(id: string) {
    const card = await cardRepository.deleteById(id);

    if (!card) {
      throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');
    }

    return card;
  }

  async getCardById(id: string) {
    return await cardRepository.findById(id);
  }
}

export default new CardService();
