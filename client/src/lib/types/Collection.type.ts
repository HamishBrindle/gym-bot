import BaseModel from '@/models/BaseModel';

/**
 * Collection type is an array of element that extend from
 * the BaseModel
 */
export type Collection<M extends BaseModel = BaseModel> = M[]
