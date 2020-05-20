import { InfinityEngine, InfinityConfig } from '../../lib';

describe('import and run', () => {
  test('can import from lib and run with types', async () => {
    const engine = new InfinityEngine();
    const res = await engine.getNext([
      {
        sortValue: (num) => num,
        name: 'test',
        offset: 0,
        query: (offset) => Promise.resolve([offset]),
      } as InfinityConfig<number>,
    ]);
    expect(res.data).toEqual([0]);
  });
});
