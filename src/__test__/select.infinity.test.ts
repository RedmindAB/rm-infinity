import * as testDb from './testdb';
import { InfinityEngine } from '..';
import { InfinityConfig } from '../types';

const engine = new InfinityEngine();

describe('Infinity select function', () => {
  describe('select descending', () => {
    test('should return last selected in one dimesional query', async () => {
      const result = await engine.getNext([
        {
          name: 'test',
          offset: 0,
          query: (offset: number) => Promise.resolve(testDb.getPosts(offset, 5)),
          sortValue: (value: testDb.Post) => +value.id,
          select: (value: testDb.Post) => value.id,
        } as InfinityConfig<testDb.Post>,
      ]);
      expect(result.newOffsets[0].lastSelected).toEqual('16');
      expect(result.newOffsets[0].value).toEqual(5);
    });
    test('should return next selected in one dimesional query', async () => {
      const nextFn = engine.createNextFn([
        {
          name: 'test',
          offset: 0,
          query: (_, startAt: number = Date.now()) => Promise.resolve(testDb.getPostByDateStartAt(startAt, 5)),
          sortValue: (value: testDb.Post) => +value.id,
          select: (value: testDb.Post) => value.date,
        } as InfinityConfig<testDb.Post>,
      ]);
      const res1 = await nextFn();
      const res2 = await nextFn();
      const res3 = await nextFn();
      expect(res1.newOffsets[0].lastSelected).toEqual(testDb.getPostByOffset(res1.newOffsets[0].value).date);
      expect(res2.newOffsets[0].lastSelected).toEqual(testDb.getPostByOffset(res2.newOffsets[0].value).date);
      expect(res3.newOffsets[0].lastSelected).toEqual(testDb.getPostByOffset(res3.newOffsets[0].value).date);
    });
  });
});
