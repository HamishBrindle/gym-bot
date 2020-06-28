import {
  IUpdateArguments,
  ICreateArguments,
  IDestroyArguments,
  IFindArguments,
  IFindOneArguments,
} from '@/lib/interfaces';

/**
 * A Model's API service wrapper
 */
export interface IApiService {
  [func: string]: Function;

  /**
   * Create a record on the server
   */
  create(args: ICreateArguments): Promise<any>;

  /**
   * Find a single record from the server
   */
  findOne(args: IFindOneArguments): Promise<any>;

  /**
   * Find a list of records from the server
   */
  find(args: IFindArguments): Promise<any>;

  /**
   * Update an existing record on the server
   */
  update(args: IUpdateArguments): Promise<any>;

  /**
   * Destroy an existing record on the server
   */
  destroy(args: IDestroyArguments): Promise<any>;
}
