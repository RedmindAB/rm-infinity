/** @ignore */ /** */
import { _DataResult } from './types';

export function getMin(data: _DataResult[], ascending: boolean) {
  if (ascending) {
    return data
      .filter((dataResult) => dataResult.data.length > 0)
      .reduce((acc, curr) => Math.min(acc, curr.config.sortValue(curr.data[0])), Number.MAX_SAFE_INTEGER);
  }
  return data
    .filter((dataResult) => dataResult.data.length > 0)
    .reduce(
      (acc, curr) => Math.max(acc, curr.config.sortValue(curr.data[curr.data.length - 1])),
      Number.MIN_SAFE_INTEGER,
    );
}

export function getMax(data: _DataResult[], ascending: boolean) {
  if (ascending) {
    return data
      .filter((dataResult) => dataResult.data.length > 0)
      .reduce(
        (acc, curr) => Math.min(acc, curr.config.sortValue(curr.data[curr.data.length - 1])),
        Number.MAX_SAFE_INTEGER,
      );
  }
  return data
    .filter((dataResult) => dataResult.data.length > 0)
    .reduce((acc, curr) => Math.max(acc, curr.config.sortValue(curr.data[0])), Number.MIN_SAFE_INTEGER);
}
