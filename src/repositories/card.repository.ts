import { Card } from '../interfaces/card.interface.js';
import { CardModel } from '../models/card.model.js';
import BaseRepository from './base.repository.js';
import { Types } from 'mongoose';

export default class CardRepository extends BaseRepository<Card> {
  constructor() {
    super(CardModel);
  }

  findByBoardAndDelete(id: string) {
    return CardModel.deleteMany({
      boardId: id,
    });
  }

  findByBoardId(boardId: Types.ObjectId) {
    return CardModel.find({ boardId }).sort({ position: 1 });
  }

  findByBoardAndStatus(boardId: string, status: string) {
    return CardModel.find({
      boardId,
      status,
    }).sort({
      position: 1,
    });
  }

  async findLastByBoardAndStatus(boardId: Types.ObjectId, status: string) {
    return CardModel.findOne({
      boardId,
      status,
    }).sort({ position: -1 });
  }

  async moveCard(cardId: string, newStatus: string, newPosition: number) {
    const card = await CardModel.findById(cardId);

    if (!card) {
      return null;
    }

    const oldStatus = card.status;
    const oldPosition = card.position;
    const boardId = card.boardId;

    if (oldStatus === newStatus) {
      if (oldPosition === newPosition) {
        return CardModel.findByIdAndUpdate(
          cardId,
          {
            status: newStatus,
            position: newPosition,
          },
          {
            new: true,
          },
        );
      }

      if (oldPosition < newPosition) {
        await CardModel.updateMany(
          {
            boardId,
            status: oldStatus,
            position: {
              $gt: oldPosition,
              $lte: newPosition,
            },
            _id: {
              $ne: card._id,
            },
          },
          {
            $inc: {
              position: -1,
            },
          },
        );
      } else {
        await CardModel.updateMany(
          {
            boardId,
            status: oldStatus,
            position: {
              $gte: newPosition,
              $lt: oldPosition,
            },
            _id: {
              $ne: card._id,
            },
          },
          {
            $inc: {
              position: 1,
            },
          },
        );
      }

      return CardModel.findByIdAndUpdate(
        cardId,
        {
          status: newStatus,
          position: newPosition,
        },
        {
          new: true,
        },
      );
    }

    await CardModel.updateMany(
      {
        boardId,
        status: oldStatus,
        position: {
          $gt: oldPosition,
        },
        _id: {
          $ne: card._id,
        },
      },
      {
        $inc: {
          position: -1,
        },
      },
    );

    await CardModel.updateMany(
      {
        boardId,
        status: newStatus,
        position: {
          $gte: newPosition,
        },
      },
      {
        $inc: {
          position: 1,
        },
      },
    );

    return CardModel.findByIdAndUpdate(
      cardId,
      {
        status: newStatus,
        position: newPosition,
      },
      {
        new: true,
      },
    );
  }
}
