import * as pag from '../infinityEngine';
import { InfinityConfig, OffsetResult } from '../types';

const ascpagination = new pag.InfinityEngine({ ascending: true, logErrors: false });
const descpagination = new pag.InfinityEngine({ ascending: false, logErrors: false });

describe('content pagination', () => {
  describe('smoke test', () => {
    test('smokie', async () => {
      const engine = new pag.InfinityEngine();
      const res = await engine.getNext([
        { comparator: (num) => num, name: 'smoke', offset: 0, query: () => Promise.resolve([0]) },
      ]);
      expect(res.data).toEqual([0]);
    });
  });

  describe('ascending', () => {
    describe('basic intersection tests', () => {
      test('Framed Intersection of [0, 3] & [2, 4] is [0, 2, 3]', async () => {
        const result = await ascpagination.getNext([simpleConfig([0, 3]), simpleConfig([2, 4])]);
        expect(result.data).toEqual([0, 2, 3]);
      });
      test('Framed Intersection of [-1, 34] & [0, 4] is [-1, 0, 4]', async () => {
        const result = await ascpagination.getNext([simpleConfig([-1, 34]), simpleConfig([0, 4])]);
        expect(result.data).toEqual([-1, 0, 4]);
      });
      test('Framed Intersection of [0, 3] & [4, 4] is [0, 3]', async () => {
        const result = await ascpagination.getNext([simpleConfig([0, 3]), simpleConfig([4, 4])]);
        expect(result.data).toEqual([0, 3]);
      });
      test('Framed Intersection of [0, 3] & [2, 4] & [1, 2] is [0, 1, 2, 2]', async () => {
        const result = await ascpagination.getNext([simpleConfig([0, 3]), simpleConfig([2, 4]), simpleConfig([1, 2])]);
        expect(result.data).toEqual([0, 1, 2, 2]);
      });
    });

    describe('basic offset tests', () => {
      let database1: number[] = [];
      let database2: number[] = [];
      beforeEach(() => {
        database1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        database2 = [1, 3, 6, 9];
      });

      const db1Config = (offset: number): InfinityConfig<number> => createConfig('db1', offset, database1);
      const db2Config = (offset: number): InfinityConfig<number> => createConfig('db2', offset, database2);
      test('should return a offset result', async () => {
        const result = await ascpagination.getNext([db1Config(0), db2Config(0)]);
        expect(result.newOffsets).toEqual([
          { name: 'db1', value: 5 },
          { name: 'db2', value: 2 },
        ] as OffsetResult[]);
        const db1Offset = result.newOffsets.find((nOffset) => nOffset.name === 'db1')?.value!;
        const db2Offset = result.newOffsets.find((nOffset) => nOffset.name === 'db2')?.value!;
        const result2 = await ascpagination.getNext([db1Config(db1Offset), db2Config(db2Offset)]);
        expect(result2.data).toEqual([6, 6, 7, 8, 9, 9]);
      });
    });
  });

  describe('descending', () => {
    describe('basic intersection tests', () => {
      test('descending config by default', async () => {
        const result = await new pag.InfinityEngine().getNext([simpleConfig([3, 0]), simpleConfig([4, 2])]);
        expect(result.data).toEqual([4, 3, 2]);
      });
      test('Framed Intersection of [3, 0] & [4, 2] is [4, 3, 2]', async () => {
        const result = await descpagination.getNext([simpleConfig([3, 0]), simpleConfig([4, 2])]);
        expect(result.data).toEqual([4, 3, 2]);
      });
      test('Framed Intersection of [34, -1] & [4, 0] is [34, 4, 0]', async () => {
        const result = await descpagination.getNext([simpleConfig([34, -1]), simpleConfig([4, 0])]);
        expect(result.data).toEqual([34, 4, 0]);
      });
      test('Framed Intersection of [3, 0] & [4, 4] is [4, 4]', async () => {
        const result = await descpagination.getNext([simpleConfig([3, 0]), simpleConfig([4, 4])]);
        expect(result.data).toEqual([4, 4]);
      });
      test('Framed Intersection of [3, 0] & [4, 2] & [2, 1] is [0, 1, 2, 2]', async () => {
        const result = await descpagination.getNext([simpleConfig([3, 0]), simpleConfig([4, 2]), simpleConfig([2, 1])]);
        expect(result.data).toEqual([4, 3, 2, 2]);
      });
    });

    describe('basic offset tests', () => {
      let database1: number[] = [];
      let database2: number[] = [];
      let allResults: number[] = [];
      beforeEach(() => {
        database1 = [10, 9, 8, 7, 6, 5, 4];
        database2 = [9, 6, 3, 1];
        allResults = [...database1, ...database2];
        allResults.sort((o1, o2) => o1 - o2).reverse();
      });

      const db1Config = (offset: number): InfinityConfig<number> => ({
        name: 'db1',
        offset: offset,
        // We only select the first 5 for each run
        query: (o) => Promise.resolve(database1.slice(o, o + 5)),
        comparator: (v) => v,
      });
      const db2Config = (offset: number): InfinityConfig<number> => ({
        name: 'db2',
        offset: offset,
        // We only select the first 5 for each run
        query: (o) => Promise.resolve(database2.slice(o, o + 5)),
        comparator: (v) => v,
      });

      test('should return a offset result', async () => {
        const totalResult = [];
        const result = await descpagination.getNext([db1Config(0), db2Config(0)]);
        expect(result.newOffsets).toEqual([
          { name: 'db1', value: 5 },
          { name: 'db2', value: 2 },
        ] as OffsetResult[]);
        totalResult.push(...result.data);
        expect(result.newOffsets).toEqual([
          { name: 'db1', value: 5 },
          { name: 'db2', value: 2 },
        ] as OffsetResult[]);
        const db1Offset = result.newOffsets.find((nOffset) => nOffset.name === 'db1')?.value!;
        const db2Offset = result.newOffsets.find((nOffset) => nOffset.name === 'db2')?.value!;
        const result2 = await descpagination.getNext([db1Config(db1Offset), db2Config(db2Offset)]);
        totalResult.push(...result2.data);
        expect(result2.newOffsets).toEqual([
          { name: 'db1', value: 7 },
          { name: 'db2', value: 2 },
        ] as OffsetResult[]);
        const db1Offset2 = result2.newOffsets.find((nOffset) => nOffset.name === 'db1')?.value!;
        const db2Offset2 = result2.newOffsets.find((nOffset) => nOffset.name === 'db2')?.value!;
        const result3 = await descpagination.getNext([db1Config(db1Offset2), db2Config(db2Offset2)]);
        totalResult.push(...result3.data);
        expect(result3.newOffsets).toEqual([
          { name: 'db1', value: 7 },
          { name: 'db2', value: 4 },
        ] as OffsetResult[]);
        expect(totalResult).toEqual(allResults);
      });
    });
  });

  describe('next generator', () => {
    describe('ascending', () => {
      const db1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const db2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33, 44, 55, 66];
      const db3 = [3, 4, 5, 6, 10, 11, 22, 33, 44, 55, 66, 100];
      const allNumbers = [...db1, ...db2, ...db3];

      const allNumbersSorted = allNumbers.sort((a, b) => a - b);
      const engine = new pag.InfinityEngine({ ascending: true });
      test('should get next when applied', async () => {
        const next = engine.createNextFn([
          createConfig('db1', 0, db1),
          createConfig('db2', 0, db2),
          createConfig('db3', 0, db3),
        ]);
        const results = [];
        while (results.length < allNumbers.length) {
          const res = await next();
          results.push(...res.data);
        }
        expect(results).toEqual(allNumbersSorted);
      });
    });
    describe('descending', () => {
      const db1 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      const db2 = [66, 55, 44, 33, 22, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      const db3 = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
      const allNumbers = [...db1, ...db2, ...db3];

      const allNumbersSorted = allNumbers.sort((a, b) => b - a);
      const engine = new pag.InfinityEngine({ ascending: false });
      test('should get next when applied', async () => {
        const next = engine.createNextFn([
          createConfig('db1', 0, db1),
          createConfig('db2', 0, db2),
          createConfig('db3', 0, db3),
        ]);
        const results = [];
        while (results.length < allNumbers.length) {
          const res = await next();
          results.push(...res.data);
        }
        expect(results).toEqual(allNumbersSorted);
      }, 10);
    });
  });

  describe('complex type handling', () => {
    describe('ascending', () => {
      const db1: Type1[] = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 3 }, { value: 4 }];
      const db2: Type2[] = [
        { nested: { value: 3 } },
        { nested: { value: 6 } },
        { nested: { value: 22 } },
        { nested: { value: 30 } },
        { nested: { value: 100 } },
      ];
      const comparator = (a: any, b: any) => a - b;
      const sorted = [...db1.map((val) => val.value), ...db2.map((val) => val.nested.value)].sort(comparator);
      const engine = new pag.InfinityEngine({ ascending: true, logErrors: false });
      test('Should handle complex types', async () => {
        const next = engine.createNextFn([
          createConfigComplex('db1', 0, db1, (value) => value.value, 2),
          createConfigComplex('db2', 0, db2, (value) => value.nested.value, 2),
        ]);
        const results = [];
        for (let i = 0; i < 10; i++) {
          const res = await next();
          results.push(...res.data.map((data) => data.value || data.nested.value));
        }
        expect(results).toEqual(sorted);
      }, 10);
    });
    describe('descending', () => {
      const db1: Type1[] = [{ value: 4 }, { value: 3 }, { value: 3 }, { value: 2 }, { value: 1 }];
      const db2: Type2[] = [
        { nested: { value: 100 } },
        { nested: { value: 30 } },
        { nested: { value: 22 } },
        { nested: { value: 6 } },
        { nested: { value: 3 } },
      ];
      const comparator = (a: any, b: any) => a - b;
      const sorted = [...db1.map((val) => val.value), ...db2.map((val) => val.nested.value)].sort(comparator).reverse();
      const engine = new pag.InfinityEngine({ ascending: false, logErrors: false });
      test('Should handle complex types', async () => {
        const next = engine.createNextFn([
          createConfigComplex('db1', 0, db1, (value) => value.value, 2),
          createConfigComplex('db2', 0, db2, (value) => value.nested.value, 2),
        ]);
        const results = [];
        for (let i = 0; i < 10; i++) {
          const res = await next();
          results.push(...res.data.map((data) => data.value || data.nested.value));
        }
        expect(results).toEqual(sorted);
      }, 10);
    });
  });
});

function createConfig(name: string, offset: number, database1: number[], limit: number = 5): InfinityConfig<number> {
  return {
    name,
    offset,
    query: (o) => Promise.resolve(database1.slice(o, o + limit)),
    comparator: (v) => v,
  };
}

function createConfigComplex<T>(
  name: string,
  offset: number,
  database1: T[],
  comparator: (value: T) => number,
  limit: number = 5,
): InfinityConfig<T> {
  return {
    name,
    offset,
    query: (o) => Promise.resolve(database1.slice(o, o + limit)),
    comparator,
  };
}

function simpleConfig(numbers: number[]): InfinityConfig<number> {
  return {
    name: Date.now().toString(),
    offset: 0,
    query: () => Promise.resolve(numbers),
    comparator: (v) => v,
  };
}

type Type1 = {
  value: number;
};

type Type2 = {
  nested: {
    value: number;
  };
};
