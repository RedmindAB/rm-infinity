export type PaginationConfig<T> = {
  name: string;
  offset: number;
  query: (offset: number) => Promise<T[]>;
  sortOn: (value: T) => number;
};

export type PaginationResult = {
  data: any[];
  newOffsets: OffsetResult[];
};

export type OffsetResult = {
  name: string;
  value: number;
};

export type PaginationEngineConfig = {
  ascending?: boolean;
};

export type _DataResult = {
  config: PaginationConfig<any>;
  data: any[];
};
