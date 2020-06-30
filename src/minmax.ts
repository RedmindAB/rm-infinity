/** @ignore */ /** */
import { _DataResult } from './types';

export function getMin(data: _DataResult[], ascending: boolean) {
  if (ascending) {
    return data
      .filter((dataResult) => dataResult.data.length > 0)
      .reduce((acc, curr) => Math.min(acc, findBeginning(curr, Number.MAX_SAFE_INTEGER)), Number.MAX_SAFE_INTEGER);
  }
  return data
    .filter((dataResult) => dataResult.data.length > 0)
    .reduce((acc, curr) => Math.max(acc, findEnd(curr, Number.MIN_SAFE_INTEGER)), Number.MIN_SAFE_INTEGER);
}

export function getMax(data: _DataResult[], ascending: boolean) {
  if (ascending) {
    return data
      .filter((dataResult) => dataResult.data.length > 0)
      .reduce((acc, curr) => Math.min(acc, findEnd(curr, Number.MIN_SAFE_INTEGER)), Number.MAX_SAFE_INTEGER);
  }
  return data
    .filter((dataResult) => dataResult.data.length > 0)
    .reduce((acc, curr) => Math.max(acc, findBeginning(curr, Number.MIN_SAFE_INTEGER)), Number.MIN_SAFE_INTEGER);
}

function findBeginning(dataResult: _DataResult, defaultValue: number) {
  const { config, data } = dataResult;
  const { skip } = config;
  if (!skip) {
    return config.sortValue(data[0]);
  }
  const filtered = data.filter((val) => !skip(val));
  if (filtered.length === 0) {
    return defaultValue;
  }
  return config.sortValue(filtered[0]);
}

function findEnd(dataResult: _DataResult, defaultValue: number) {
  const { config, data } = dataResult;
  const { skip } = config;
  if (!skip) {
    return config.sortValue(data[data.length - 1]);
  }
  const filtered = data.filter((val) => !skip(val));
  if (filtered.length === 0) {
    return defaultValue;
  }
  return config.sortValue(filtered[filtered.length - 1]);
}
