import { Types } from 'mongoose';
import { CardStatus } from '../utils/enum.js';

export interface Card {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  status: CardStatus;
  boardId: Types.ObjectId;
  position: number;
}
