import { InfinityEngine, InfinityEngineConfig, InfinityConfig } from 'rm-infinity';
import * as exampleService from './example.service';

const engine = new InfinityEngine();

async function run() {
  exampleService.printDbs();
  const config = [
    {
      comparator: (num) => num,
      name: 'test1',
      offset: 0,
      query: (offset) => exampleService.queryDb1(offset, 5),
    } as InfinityConfig<number>,
    {
      comparator: (num) => num,
      name: 'test2',
      offset: 0,
      query: (offset) => exampleService.queryDb2(offset, 2),
    } as InfinityConfig<number>,
    {
      comparator: (num) => num,
      name: 'test3',
      offset: 0,
      query: (offset) => exampleService.queryDb3(offset, 2),
    } as InfinityConfig<number>,
    {
      comparator: (num) => num,
      name: 'test4',
      offset: 0,
      query: (offset) => exampleService.queryDb4(offset, 10),
    } as InfinityConfig<number>,
  ];
  let res = await engine.getNext(config);
  let queryCounter = 1;
  while (res.data.length !== 0) {
    console.log(`req ${queryCounter}`, res.data);
    res = await engine.getNext(engine.updateConfigsOffsetFromResult(res, config));
    queryCounter++;
  }
}

run();
