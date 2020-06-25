import { InfinityEngine } from '../index';
import * as db from './testdb';
import { InfinityConfig } from '../types';

const infinity = new InfinityEngine();

describe('Nested infinity', () => {
  test('Can handle one nested', async () => {
    const next = await infinity.getNext([
      {
        name: 'test',
        offset: 0,
        query: (offset) => db.getPosts(offset, 5, 'test'),
        sortValue: (v) => parseInt(v.id, 10),
      } as InfinityConfig<db.Post>,
      {
        name: 'test1',
        offset: 0,
        query: (offset) => db.getPosts(offset, 2, 'test1'),
        sortValue: (v) => parseInt(v.id, 10),
      } as InfinityConfig<db.Post>,
      {
        name: 'test2',
        offset: 0,
        query: (offset) => db.getPosts(offset, 2, 'test2'),
        sortValue: (v) => parseInt(v.id, 10),
      } as InfinityConfig<db.Post>,
      {
        name: 'test3',
        offset: 0,
        query: (offset) => db.getPosts(offset, 2, 'test3'),
        sortValue: (v) => parseInt(v.id, 10),
      } as InfinityConfig<db.Post>,
    ]);
  });
});
