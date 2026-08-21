import { Schema, model } from 'mongoose';

import { Board } from '../interfaces/board.interface.js';
import { generatePublicId } from '../utils/generatePublicId.js';

const BoardSchema = new Schema<Board>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      default: generatePublicId,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const BoardModel = model('Board', BoardSchema);
