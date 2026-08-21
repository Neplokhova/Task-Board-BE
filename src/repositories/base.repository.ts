import { Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T> {
  protected constructor(private model: Model<T>) {}

  createOne(doc: T) {
    return this.model.create(doc);
  }

  findById(id: string) {
    return this.model.findById(id);
  }

  updateById(id: string, update: UpdateQuery<T>, options?: object) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}

export default BaseRepository;
