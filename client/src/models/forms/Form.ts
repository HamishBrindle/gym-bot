import BaseModel from '../BaseModel';
import { FormBaseSchema } from '@/lib/types/FormBaseSchema.type';

export abstract class Form<T extends BaseModel> {
  /**
   * Schema used against Model for use within FormBase component
   */
  public abstract schema: FormBaseSchema;

  /**
   * Instance of the model
   */
  public model: T;

  /**
   * Constructor
   */
  constructor(model: T) {
    // @ts-ignore - Some global variable bullshit
    this.model = _.cloneDeep(model);
  }

  /**
   * When initialized, the model will be hydrated with default values
   * provided when passed a field name
   * @param field
   */
  protected abstract getDefault(field: string): string | number;

  /**
   * Function responsible for fetching default values for
   * a given field
   */
  public getSchema(): FormBaseSchema {
    return this.schema;
  }

  /**
   * Get the form's current record it's using as a model.
   */
  public getModel(): T {
    return this.model;
  }

  /**
   * Function responsible for fetching default values for
   * a given field
   */
  public setModel(model: T): T {
    this.model = model;
    return this.model;
  }

  /**
   * Basic form rules
   */
  public static get rules() {
    return {
      /**
       * Minimum length of a form field's input
       */
      minLength: (length: number) => (v: string | Array<any>) => (
        (v?.length >= length) || `Minimum length for this field is ${length}`
      ),

      /**
       * Maximum length of a form field's input
       */
      maxLength: (length: number) => (v: string | Array<any>) => (
        (v?.length <= length) || `Maximum length for this field is ${length}`
      ),

      /**
       * Check for required field and display message if not valid
       */
      required: (message = 'Required field.') => (v: any) => !!v || message,

      /**
       * Check for valid email string and display message if not
       */
      validEmail: (message = 'Invalid email.') => (v: string) => /.+@.+\..+/.test(v) || message,
    };
  }
}
