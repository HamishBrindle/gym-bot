/**
 * InstanceOf infers a type of an instantiated object
 * of a certain type, T
 */
export type InstanceOf<T> = T extends new (...args: any[]) => infer R ? R : any;
