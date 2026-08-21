import { Board } from '../interfaces/board.interface.js';
import { BoardModel } from '../models/board.model.js';
import BaseRepository from './base.repository.js';

export default class BoardRepository extends BaseRepository<Board> {
  constructor() {
    super(BoardModel);
  }

  findBoardByPublicId(publicId: string) {
    return BoardModel.findOne({ publicId: publicId });
  }

  updateByPublicId(publicId: string, payload: object, options?: object) {
    return BoardModel.findOneAndUpdate(
      { publicId: publicId },
      payload,
      options,
    );
  }

  deleteByPublicId(publicId: string) {
    return BoardModel.findOneAndDelete({ publicId: publicId });
  }
}
