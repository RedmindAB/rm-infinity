import { InfinityEngineConfig, InfinityConfig, InfinityResult, OffsetResult, _DataResult } from './types';
import { getMin, getMax } from './minmax';

const DEFAULT_CONFIG: InfinityEngineConfig = { ascending: false };

export class InfinityEngine {
  private config: InfinityEngineConfig;
  constructor(config?: InfinityEngineConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async getNext(configs: InfinityConfig<any>[]): Promise<InfinityResult> {
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

  createNextFn(configs: InfinityConfig<any>[]) {
    const nextConfigs = configs;
    return async () => {
      const result = await this.getNext(nextConfigs);
      this.updateConfigsOffsetFromResult(result, nextConfigs);
      return result;
    };
  }

  updateConfigsOffsetFromResult(result: InfinityResult, config: InfinityConfig<any>[]) {
    result.newOffsets.forEach(
      (offset) => (config.find((oldConfig) => oldConfig.name === offset.name)!.offset = offset.value),
    );
    return config;
  }
}
