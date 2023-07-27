import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { FindAllArgs } from './users.service';

import { ObjectId } from 'mongoose';

export type UpdatedModel = {
  matchedCount: number;
  modifiedCount: number;
  acknowledged: boolean;
  upsertedId: unknown | ObjectId;
  upsertedCount: number;
};

export type RemovedModel = {
  deletedCount: number;
  deleted: boolean;
};

export type CreatedModel = {
  id: string;
  created: boolean;
};

export class Repository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc: object, saveOptions?: SaveOptions): Promise<CreatedModel> {
    const createdEntity = new this.model(doc);
    const savedResult = await createdEntity.save(saveOptions);

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, null, options);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findAll({ skip = 0, take = 25 }: FindAllArgs): Promise<T[]> {
    return this.model.find().skip(skip).limit(take).exec();
  }

  async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
    const { deletedCount } = await this.model.deleteOne(filter);
    return { deletedCount, deleted: !!deletedCount };
  }

  async updateOne(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return await this.model.updateOne(filter, updated, options);
  }

  async updateMany(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return await this.model.updateMany(filter, updated, options);
  }

  async getCount(): Promise<number> {
    return this.model.countDocuments().exec();
  }
}
