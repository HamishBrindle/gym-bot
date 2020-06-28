import { ModelService } from '.';
import { Create, UpdateObject, Insert, InsertOrUpdate } from '@vuex-orm/core/lib/modules/payloads/Actions';
import { Collection, Query, Collections } from '@vuex-orm/core';
import { Item } from '@/lib/types';
import { User } from '@/models/User';
import { IApiService, IRequestArguments } from '@/lib/interfaces';

export class UserService extends ModelService<User> {

  protected model = User;

  protected path = '/users';

  /**
   * Cached instance of the service
   */
  private static instance: UserService | null = null;

  /**
   * Constructor
   */
  private constructor() {
    super();
  }

  /**
   * Get an instance of the UserService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
      return this.instance;
    }
    return this.instance;
  }

  public create(payload: Create): Promise<Collections> {
    return this.model.create(payload);
  }

  public update(payload: UpdateObject): Promise<Collections> {
    return this.model.update(payload);
  }

  public insert(payload: Insert): Promise<Collections> {
    return this.model.insert(payload);
  }

  public insertOrUpdate(payload: InsertOrUpdate): Promise<Collections> {
    return this.model.insertOrUpdate(payload);
  }

  public find(options: string | number | (string | number)[]): Item<User> {
    return this.model.find(options);
  }

  public findIn(options: (string | number | (string | number)[])[]): Collection<User> {
    return this.model.findIn(options);
  }

  public query(): Query<User> {
    return this.model.query();
  }

  public all(): Collection<User> {
    return this.model.all();
  }

  /**
   * Get the active User
   */
  public getActive(): Item<User> {
    return this.model.getActive();
  }

  /**
   * Set the active User
   */
  public setActive(record: User | string | number): Item<User> {
    return this.model.setActive(record);
  }

  /**
   * Get the active User
   */
  public getActiveToken(): string {
    const user = (this.model.getActive() as User);
    return user.accessToken ?? '';
  }

  public get api(): IApiService {
    return {
      /**
       * Find a list of Users on the server via GET request
       */
      find: async (args) => this.apiService.get(this.path, args),

      /**
       * Get currently logged-in User's data
       */
      me: async (args: IRequestArguments) => this.apiService.get('auth/me', args),

      /**
       * Sign in using a email and password, and get back a User's
       * data and authentication token
       */
      login: async (args: IRequestArguments) => this.apiService.post('auth/login', args),

      /**
       * Register a new User with the API and recieve a token for
       * confirming an email
       */
      register: async (args: IRequestArguments) => this.apiService.post('auth/register', args),

      create: () => {
        throw Error('Method has not been implemented yet.');
      },

      findOne: () => {
        throw Error('Method has not been implemented yet.');
      },

      update: () => {
        throw Error('Method has not been implemented yet.');
      },

      destroy: () => {
        throw Error('Method has not been implemented yet.');
      },
    };
  }
}
