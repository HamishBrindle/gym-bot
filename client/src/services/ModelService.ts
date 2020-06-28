import BaseModel from '@/models/BaseModel';
import { Create, Insert, InsertOrUpdate, UpdateObject } from '@vuex-orm/core/lib/modules/payloads/Actions';
import { Query } from '@vuex-orm/core';
import { IApiService } from '@/lib/interfaces';
import { Collections, Item, Collection } from '@/lib/types';
import { ApiService } from './ApiService';
import { IApiUserService } from '@/lib/interfaces/ApiUserService.interface';

export abstract class ModelService<T extends BaseModel> {

  /**
   * Model that this service deals with
   */
  protected abstract readonly model: typeof BaseModel;

  /**
   * Model-specific path appended to the API endpoint. Must start
   * with a "/".
   */
  protected abstract readonly path: ((args: any) => string) | string;

  /**
   * Service for making requests to the API
   */
  protected readonly apiService: ApiService = ApiService.getInstance();

  /**
   * Create model record(s) and return list of records created, including
   * through associations, and also clearing out existing records of this
   * type
   * @param payload Args
   */
  public abstract async create(payload: Create): Promise<Collections>;

  /**
   * Update model record(s) and return list of records updated, including
   * through associations
   * @param payload Args
   */
  public abstract async update(payload: UpdateObject): Promise<Collections>;

  /**
   * Insert model record(s) and return list of records inserted, including
   * through associations
   * @param payload Args
   */
  public abstract async insert(payload: Insert): Promise<Collections>;

  /**
   * Insert or update model record(s) and return list of records inserted and/or
   * updated, including through associations
   * @param payload Args
   */
  public abstract async insertOrUpdate(payload: InsertOrUpdate): Promise<Collections>;

  /**
   * Search ORM for single record
   * @param options
   */
  public abstract find(options: string | number | (string | number)[]): Item<T>

  /**
   * Search ORM for multiple records
   * @param options
   */
  public abstract findIn(options: (string | number | (string | number)[])[]): Collection<T>

  /**
   * Return a query builder for searching the ORM
   */
  public abstract query(): Query<T>;

  /**
   * Retrieve all records from ORM
   */
  public abstract all(): Collection<T>;

  /**
   * Model's API wrapper
   */
  public abstract get api(): IApiService | IApiUserService;
}

export default ModelService;
