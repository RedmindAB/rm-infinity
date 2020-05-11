export type InfinityConfig<T> = {
  name: string;
  offset: number;
  query: (offset: number) => Promise<T[]>;
  sortValue: (value: T) => number;
};

export type InfinityResult = {
  data: any[];
  newOffsets: OffsetResult[];
};

export type OffsetResult = {
  name: string;
  value: number;
};

export type InfinityEngineConfig = {
  ascending: boolean;
  onError: (msg: ValidationErrorMessage) => void;
  logErrors: boolean;
};

/** @ignore */
export type _DataResult = {
  config: InfinityConfig<any>;
  data: any[];
};

export enum ValidationError {
  INVALID_ORDER = 'INVALID_ORDER',
}

export type ValidationErrorMessage = {
  error: ValidationError;
  message: string;
};
