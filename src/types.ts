export type InfinityConfig<T> = {
  name: string;
  offset: number;
  query: (offset: number) => Promise<T[]>;
  sortOn: (value: T) => number;
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
  ascending?: boolean;
};

export type _DataResult = {
  config: InfinityConfig<any>;
  data: any[];
};
