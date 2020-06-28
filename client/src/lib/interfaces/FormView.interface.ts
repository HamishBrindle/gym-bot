import { Form } from '@/models/forms/Form';
import BaseModel from '@/models/BaseModel';

export interface IFormView<T extends BaseModel> {
  /**
   * Reference to the form we want to validate. Create
   * a reference by setting the `ref` attribute on an
   * element or component
   */
  formRef: any;

  /**
   * A Form object that looks after the model, schema, and
   * record for displaying data within a FormView
   */
  form: Form<T>;
}

export interface ICreateFormView<T extends BaseModel> extends IFormView<T> {
  /**
   * Save form to the server and return the newly saved data
   * @param model
   */
  save(model: T): Promise<T>;
}

export interface IEditFormView<T extends BaseModel> extends IFormView<T> {
  /**
   * Identifier of the model this form represents
   */
  id?: number | string;

  /**
   * Fetch data from the server or orm to hydrate the form
   * @param id
   */
  fetchData(id: string | number): Promise<T> | T;

  /**
   * Initialize the component and it's data, making a call to
   * the `fetchData` function.
   *
   * Call this in either the `created` or `mounted` lifecycle hooks
   */
  init(): Promise<void> | void;

  /**
   * Save form to the server and return the newly saved data
   * @param model
   */
  save(model: T): Promise<T>;
}
