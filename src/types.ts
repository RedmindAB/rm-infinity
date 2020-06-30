export type InfinityConfig<T> = {
  name: string;
  offset: number;
  lastSelected?: SelectedValue;
  query: (offset: number, lastSelected?: SelectedValue) => Promise<T[]>;
  sortValue: (value: T) => number;
  select?: (value: T) => SelectedValue;
  skip?: (value: T) => boolean;
};

export type SelectedValue = string | number | Date;

export type InfinityResult = {
  data: any[];
  newOffsets: OffsetResult[];
};

export type OffsetResult = {
  name: string;
  value: number;
  lastSelected?: any;
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
