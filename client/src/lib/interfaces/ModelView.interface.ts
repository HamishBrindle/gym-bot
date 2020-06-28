import BaseModel from '@/models/BaseModel';

export interface IModelView<T extends BaseModel> {
  /**
   * Records to be displayed in the table
   */
  data: T;
  /**
   * Fetch data from the server for the data-table. Return a Promise
   * for that data.
   */
  fetchData(): Promise<T> | T;
  /**
   * Initialize the component and it's data, making a call to
   * the `fetchData` function.
   *
   * Call this in either the `created` or `mounted` lifecycle hooks
   */
  init(): Promise<void> | void;
}
