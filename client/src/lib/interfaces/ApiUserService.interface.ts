import {
  IRequestArguments,
} from '@/lib/interfaces';
import { AxiosResponse } from 'axios';

/**
 * A Model's API service wrapper
 */
export interface IApiUserService {
  [func: string]: Function | undefined;

  /**
   * Sign in with an existing user's credentials
   */
  login: (args: IRequestArguments) => Promise<AxiosResponse<any>>;

  /**
   * Register a new user
   */
  register: (args: IRequestArguments) => Promise<AxiosResponse<any>>;
}
