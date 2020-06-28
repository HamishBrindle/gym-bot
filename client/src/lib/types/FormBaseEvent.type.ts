import { FormBaseSchema } from './FormBaseSchema.type';
import BaseModel from '@/models/BaseModel';

/**
 * Event type emitted from FormBase component
 */
export type FormBaseEvent<T extends BaseModel> = {
  /**
   * Event name
   */
  on: string;
  /**
   * ID of FormBase instance
   */
  id: string;
  /**
   * Index array
   */
  index: Array<any>;
  /**
   * Parameters
   */
  params: {
    /**
     * Text inside element
     */
    text: string;
    /**
     * Form element type
     */
    tag: string;
    /**
     * Model
     */
    model?: any;
    /**
     * Open state
     */
    open?: any;
    /**
     * Index array
     */
    index: Array<any>;
  };
  /**
   * Key of schema object
   */
  key: string;
  /**
   * Value
   */
  value?: any;
  /**
   * TODO: Not entirely sure what this fucking thing is
   */
  obj: any;
  /**
   * Native event
   */
  event: Event;
  /**
   * Model the form represents
   */
  data: T;
  /**
   * The forms original schema object
   */
  schema: FormBaseSchema;
}
