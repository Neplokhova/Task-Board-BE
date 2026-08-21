import { Schema, model } from 'mongoose';
import { Card } from '../interfaces/card.interface.js';
import { CardStatus } from '../utils/enum.js';

const CardSchema = new Schema<Card>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: Object.values(CardStatus),
      required: true,
      default: CardStatus.TODO,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

CardSchema.index({
  boardId: 1,
  status: 1,
  position: 1,
});

export const CardModel = model('Card', CardSchema);
