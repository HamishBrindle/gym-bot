import BaseModel from '@/models/BaseModel';
import { DataTableHeader } from 'vuetify';

export interface ITableView<T extends BaseModel> {
  /**
   * Records to be displayed in the table
   */
  data: T[];
  /**
   * Selected record(s) from the data-table
   */
  selected: T[];
  /**
   * Array of DataTableHeaders to show columns in the data-table
   */
  headers: DataTableHeader[];
  /**
   * Fetch data from the server for the data-table. Return a Promise
   * for that data.
   */
  fetchData(): Promise<any>;
  /**
   * Initialize the component and it's data, making a call to
   * the `fetchData` function.
   *
   * Call this in either the `created` or `mounted` lifecycle hooks
   */
  init(): Promise<void>;
}
