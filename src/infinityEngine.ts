import { InfinityEngineConfig, InfinityConfig, InfinityResult, OffsetResult, _DataResult } from './types';
import { getMin, getMax } from './minmax';
import { validateData } from './validation';

// tslint:disable-next-line: no-console
const DEFAULT_CONFIG: InfinityEngineConfig = { ascending: false, onError: console.warn, logErrors: true };

export class InfinityEngine {
  private config: InfinityEngineConfig;
  constructor(config: Partial<InfinityEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async getNext(configs: InfinityConfig<any>[]): Promise<InfinityResult> {
    const queries = configs.map((config) =>
      config.query(config.offset, config.lastSelected).then((data) => ({ config, data } as _DataResult)),
    );
    const fetchedQueries = await Promise.all(queries);
    const min = getMin(fetchedQueries, this.config.ascending);
    const max = getMax(fetchedQueries, this.config.ascending);
    const returnObjects = [];
    const newOffsets: OffsetResult[] = [];
    fetchedQueries.forEach((res) => {
      const error = validateData(res, this.config);
      if (error && this.config.logErrors) {
        this.config.onError(error);
      }
    });
    for (const fetchedQuery of fetchedQueries) {
      let offsetAddition = 0;
      let lastSelected = null;
      for (const queryData of fetchedQuery.data) {
        const { skip, sortValue: sortFn } = fetchedQuery.config;
        const skipThis = skip ? skip(queryData) : false;
        if (skipThis) {
          offsetAddition++;
          continue;
        }
        const sortValue = sortFn(queryData);
        if (sortValue <= max && sortValue >= min) {
          returnObjects.push({
            sortValue,
            data: queryData,
          });
          offsetAddition++;
          if (fetchedQuery.config.select) {
            lastSelected = fetchedQuery.config.select(queryData);
          }
        }
      }
      const newOffset: OffsetResult = {
        name: fetchedQuery.config.name,
        value: fetchedQuery.config.offset + offsetAddition,
      };
      if (lastSelected) {
        newOffset.lastSelected = lastSelected;
      }
      newOffsets.push(newOffset);
    }
    returnObjects.sort((o1, o2) => o2.sortValue - o1.sortValue);
    const response = returnObjects.map((returnObject) => returnObject.data);
    return {
      data: this.config.ascending ? response.reverse() : response,
      newOffsets,
    };
  }

  createNextFn(configs: InfinityConfig<any>[]) {
    let nextConfigs = configs;
    return async () => {
      const result = await this.getNext(nextConfigs);
      nextConfigs = this.updateConfigsOffsetFromResult(result, nextConfigs);
      return result;
    };
  }

  updateConfigsOffsetFromResult(result: InfinityResult, config: InfinityConfig<any>[]) {
    return result.newOffsets.map((offset) => {
      const oldCOnfig = config.find((oldConfig) => oldConfig.name === offset.name);
      return { ...oldCOnfig!, offset: offset.value, lastSelected: offset.lastSelected };
    });
  }

  getConfig() {
    return this.config;
  }
}
