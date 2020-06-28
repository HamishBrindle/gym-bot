/**
 * General interface for arguments going to the API
 */
export interface IRequestArguments {
  [field: string]: any;
}

/**
 * Interface for create arguments going to the API
 */
export interface ICreateArguments extends IRequestArguments {
  accessToken: string;
}

/**
 * Interface for update arguments going to the API
 */
export interface IUpdateArguments extends IRequestArguments {
  id: string | number;
  accessToken: string;
}

/**
 * Interface for find-one arguments going to the API
 */
export interface IFindOneArguments extends IRequestArguments {
  id: string | number;
  accessToken: string;
}

/**
 * Interface for find arguments going to the API
 */
export interface IFindArguments extends IRequestArguments {
  accessToken: string;
}

/**
 * Interface for destroy arguments going to the API
 */
export interface IDestroyArguments extends IRequestArguments {
  id: string | number;
  accessToken: string;
}

export default IRequestArguments;
