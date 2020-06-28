import { Store } from 'vuex';
import { IRootState } from '.';

/**
 * Interface for our App's root state
 */
export interface ICustomStore extends Store<IRootState> {
  /**
   * Indicates if the Vuex state has been loaded from local storage
   * and is ready to use
   */
  restored: Promise<boolean>;
}
