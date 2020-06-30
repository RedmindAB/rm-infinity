import { InfinityEngine } from '../index';
import { InfinityConfig } from '../types';

const engine = new InfinityEngine({ logErrors: false });

describe('skip', () => {
  test('descending with middle null', async () => {
    const db1 = [3, null, 1];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1)]);
    expect(res.newOffsets[0].value).toEqual(3);
    expect(res.data).toEqual([3, 1]);
  });

  test('descending with intial null', async () => {
    const db1 = [null, 3, 1];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1)]);
    expect(res.newOffsets[0].value).toEqual(3);
    expect(res.data).toEqual([3, 1]);
  });

  test('descending with ending null', async () => {
    const db1 = [3, 1, null];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1)]);
    expect(res.newOffsets[0].value).toEqual(3);
    expect(res.data).toEqual([3, 1]);
  });

  test('null in beginning and the end', async () => {
    const db1 = [null, 3, null];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1)]);
    expect(res.newOffsets[0].value).toEqual(3);
    expect(res.data).toEqual([3]);
  });

  test('all null', async () => {
    const db1 = [null, null, null];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1)]);
    expect(res.newOffsets[0].value).toEqual(3);
    expect(res.data).toEqual([]);
  });

  test('every other null', async () => {
    const db1 = [null, 3, null, 2, null, 1];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1, 10)]);
    expect(res.newOffsets[0].value).toEqual(6);
    expect(res.data).toEqual([3, 2, 1]);
  });
  test('every other null with ending null', async () => {
    const db1 = [null, 3, null, 2, null, 1, null];
    // @ts-ignore
    const res = await engine.getNext([createConfig('test', 0, db1, 10)]);
    expect(res.newOffsets[0].value).toEqual(7);
    expect(res.data).toEqual([3, 2, 1]);
  });
});

function createConfig(name: string, offset: number, database1: number[], limit: number = 5): InfinityConfig<number> {
  return {
    name,
    offset,
    // @ts-ignore
    query: (o) => Promise.resolve(database1.slice(o, o + limit)),
    // @ts-ignore
    sortValue: (v) => v,
    skip: (v) => v === null,
  };
}
