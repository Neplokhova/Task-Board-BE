import {
  boardRepository,
  cardRepository,
} from '../repositories/index.repository.js';
import { Board } from '../interfaces/board.interface.js';
import { CardStatus } from '../utils/enum.js';
import { CardsByStatus } from '../utils/types.js';
import { AppError } from '../middleware/error.middleware.js';

class BoardService {
  async createBoard(payload: Board) {
    return await boardRepository.createOne(payload);
  }

  async getBoardByPublicId(publicId: string) {
    const board = await boardRepository.findBoardByPublicId(publicId);

    if (!board) {
      throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    const cardsMass = await cardRepository.findByBoardId(board._id);

    const cards: CardsByStatus = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    for (const card of cardsMass) {
      if (card.status === CardStatus.TODO) {
        cards.todo.push({
          id: card._id!.toString(),
          name: card.title,
          description: card.description,
          status: 'todo',
          position: card.position,
        });
      }

      if (card.status === CardStatus.IN_PROGRESS) {
        cards['in-progress'].push({
          id: card._id!.toString(),
          name: card.title,
          description: card.description,
          status: 'in-progress',
          position: card.position,
        });
      }

      if (card.status === CardStatus.DONE) {
        cards.done.push({
          id: card._id!.toString(),
          name: card.title,
          description: card.description,
          status: 'done',
          position: card.position,
        });
      }
    }

    return {
      id: board.publicId,
      name: board.title,
      cards,
    };
  }

  async updateBoard(id: string, payload: Partial<Board>) {
    const board = await boardRepository.updateByPublicId(id, payload, {
      new: true,
    });

    if (!board) {
      throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    return board;
  }

  async deleteBoard(publicId: string) {
    const board = await boardRepository.findBoardByPublicId(publicId);

    if (!board) {
      throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    await cardRepository.findByBoardAndDelete(board.id);
    return await boardRepository.deleteByPublicId(publicId);
  }
}

export default new BoardService();
