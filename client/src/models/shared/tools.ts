
/**
 * Prepare a payload's data for inserting/updating records using specified
 * mapping function
 * @param payload
 * @param mapping Callback for use with map function
 */
export function prepareData(data: any, mapping: Function) {
  if (!data) throw Error('Unable to prepare data for model without `data` parameter');
  if (!mapping) throw Error('Unable to prepare data for model with `mapping` function parameter');
  const isArray = Array.isArray(data);

  if (!isArray) data = [data];

  const newData = data.map(mapping);

  if (isArray) return newData;
  return newData[0];
}
