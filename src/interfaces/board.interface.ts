import { Types } from 'mongoose';

export interface Board {
  _id?: Types.ObjectId;
  title: string;
  publicId: string;
}
