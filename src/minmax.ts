import { _DataResult } from './types';

export function getMin(data: _DataResult[], ascending: boolean) {
  if (ascending) {
    return data
      .filter((dataResult) => dataResult.data.length > 0)
      .reduce((acc, curr) => Math.min(acc, curr.config.comparator(curr.data[0])), Number.MAX_VALUE);
  }
  return data
    .filter((dataResult) => dataResult.data.length > 0)
    .reduce((acc, curr) => Math.max(acc, curr.config.comparator(curr.data[curr.data.length - 1])), Number.MIN_VALUE);
}

export function getMax(data: _DataResult[], ascending: boolean) {
  if (ascending) {
    return data
      .filter((dataResult) => dataResult.data.length > 0)
      .reduce((acc, curr) => Math.min(acc, curr.config.comparator(curr.data[curr.data.length - 1])), Number.MAX_VALUE);
  }
  return data
    .filter((dataResult) => dataResult.data.length > 0)
    .reduce((acc, curr) => Math.max(acc, curr.config.comparator(curr.data[0])), Number.MIN_VALUE);
}
