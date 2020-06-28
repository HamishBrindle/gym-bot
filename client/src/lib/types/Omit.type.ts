/**
 * Omit a property, or union of properties, from an existing
 * type or interface
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
