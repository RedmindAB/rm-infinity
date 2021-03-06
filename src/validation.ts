/** @ignore */ /** */
import { _DataResult, InfinityEngineConfig, ValidationError } from './types';

export const getErrorMessage = (error: ValidationError, result: _DataResult, config: InfinityEngineConfig) => {
  let errorMessage: string = '';
  switch (error) {
    case ValidationError.INVALID_ORDER:
      errorMessage = `${result.config.name} seems to be in ${
        config.ascending ? 'decending' : 'ascending'
      } order update your InfinityEngineConfig or change your query`;
      break;
    default:
      errorMessage = 'Unknown error';
  }
  return {
    error,
    message: errorMessage,
  };
};

export const validateData = (result: _DataResult, config: InfinityEngineConfig) => {
  if (!validDataOrder(result, config)) {
    return getErrorMessage(ValidationError.INVALID_ORDER, result, config);
  }
};

export const validDataOrder = (result: _DataResult, config: InfinityEngineConfig) => {
  if (result.data.length < 2) {
    return true;
  }
  const start = result.config.sortValue(result.data[0]);
  const end = result.config.sortValue(result.data[result.data.length - 1]);
  return config.ascending ? start <= end : start >= end;
};
