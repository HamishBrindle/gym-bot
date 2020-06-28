import BaseModel from '@/models/BaseModel';
import { AttrField, OrmModel, PrimaryKey, StringField } from 'vuex-orm-decorators';

@OrmModel('users')
export class User extends BaseModel {
  /**
   * Unique identifier for this User on the API.
   */
  @PrimaryKey()
  @AttrField()
  public id!: number | string;

  /**
   * Unique email string for the User.
   */
  @StringField()
  public email!: string;

  /**
   * Token required for this User to communicate with
   * the server. Must be sent in with practically every
   * request to the backend.
   */
  @StringField()
  public accessToken!: string;

  /**
   * User's first name.
   */
  @StringField()
  public firstName!: string;

  /**
   * User's last name.
   */
  @StringField()
  public lastName!: string;

  /**
   * Account object
   *
   * TODO: Turn into model
   */
  @AttrField(null)
  public account!: any

  @StringField()
  public createdAt!: string;

  @StringField()
  public updatedAt!: string;
}

export default User;
