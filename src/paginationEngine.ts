import { PaginationEngineConfig, PaginationConfig, PaginationResult, OffsetResult, _DataResult } from './types';
import { getMin, getMax } from './minmax';

const DEFAULT_CONFIG: PaginationEngineConfig = { ascending: false };

export class PaginationEngine {
  private config: PaginationEngineConfig;
  constructor(config?: PaginationEngineConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async getNext(configs: PaginationConfig<any>[]): Promise<PaginationResult> {
    const queries = configs.map((config) =>
      config.query(config.offset).then((data) => ({ config, data } as _DataResult)),
    );
    const fetchedQueries = await Promise.all(queries);
    const min = getMin(fetchedQueries, this.config.ascending!);
    const max = getMax(fetchedQueries, this.config.ascending!);
    const returnObjects = [];
    const newOffsets: OffsetResult[] = [];
    for (const fetchedQuery of fetchedQueries) {
      let offsetAddition = 0;
      for (const queryData of fetchedQuery.data) {
        if (fetchedQuery.config.sortOn(queryData) <= max && fetchedQuery.config.sortOn(queryData) >= min) {
          returnObjects.push({
            sortValue: fetchedQuery.config.sortOn(queryData),
            data: queryData,
          });
          offsetAddition++;
        }
      }
      newOffsets.push({
        name: fetchedQuery.config.name,
        value: fetchedQuery.config.offset + offsetAddition,
      });
    }
    returnObjects.sort((o1, o2) => o2.sortValue - o1.sortValue);
    const response = returnObjects.map((returnObject) => returnObject.data);
    return {
      data: this.config.ascending ? response.reverse() : response,
      newOffsets,
    };
  }

  createMomoizedNext(configs: PaginationConfig<any>[]) {
    const nextConfigs = configs;
    return async () => {
      const result = await this.getNext(nextConfigs);
      result.newOffsets.forEach(
        (offset) => (nextConfigs.find((oldConfig) => oldConfig.name === offset.name)!.offset = offset.value),
      );
      return result;
    };
  }
}
