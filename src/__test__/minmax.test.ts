import * as minmax from '../minmax';
import { InfinityConfig } from '../types';

const config: InfinityConfig<number> = {
  name: 'hej',
  offset: 0,
  query: () => Promise.resolve([0]),
  sortOn: (value) => value,
};

describe('min/max', () => {
  describe('min', () => {
    describe('ascending', () => {
      test('should handle ascending array', () => {
        const res = minmax.getMin(
          [
            { config, data: [1, 2, 3, 4, 5, 6] },
            { config, data: [1, 5, 8] },
          ],
          true,
        );
        expect(res).toBe(1);
      });

      test('should handle ascending array with middle intersecting array', () => {
        const res = minmax.getMin(
          [
            { config, data: [5, 8] },
            { config, data: [1, 2, 3, 4, 5, 6] },
          ],
          true,
        );
        expect(res).toBe(1);
      });

      test('handle empty array', () => {
        const res = minmax.getMin(
          [
            { config, data: [] },
            { config, data: [1, 2, 3, 4, 5, 6] },
          ],
          true,
        );
        expect(res).toBe(1);
      });
    });

    describe('descending', () => {
      test('should handle descending array', () => {
        const res = minmax.getMin(
          [
            { config, data: [6, 5, 4, 3] },
            { config, data: [8, 5, 1] },
          ],
          false,
        );
        expect(res).toBe(3);
      });

      test('should handle descending array with middle intersecting array', () => {
        const res = minmax.getMin(
          [
            { config, data: [6, 5] },
            { config, data: [6, 5, 4, 3, 2, 1] },
          ],
          false,
        );
        expect(res).toBe(5);
      });

      test('should handle emty array', () => {
        const res = minmax.getMin(
          [
            { config, data: [] },
            { config, data: [6, 5, 4, 3, 2, 1] },
          ],
          false,
        );
        expect(res).toBe(1);
      });
    });
  });

  describe('max', () => {
    describe('ascending', () => {
      test('should handle ascending array', () => {
        const res = minmax.getMax(
          [
            { config, data: [1, 2, 3, 4, 5, 6] },
            { config, data: [1, 5, 8] },
          ],
          true,
        );
        expect(res).toBe(6);
      });

      test('should handle ascending array with middle intersecting array', () => {
        const res = minmax.getMax(
          [
            { config, data: [5, 8] },
            { config, data: [1, 2, 3, 4, 5, 6] },
          ],
          true,
        );
        expect(res).toBe(6);
      });

      test('should handle empty array', () => {
        const res = minmax.getMax(
          [
            { config, data: [] },
            { config, data: [1, 2, 3, 4, 5, 6] },
          ],
          true,
        );
        expect(res).toBe(6);
      });
    });

    describe('descending', () => {
      test('should handle descending array', () => {
        const res = minmax.getMax(
          [
            { config, data: [6, 5, 4, 3] },
            { config, data: [8, 5, 1] },
          ],
          false,
        );
        expect(res).toBe(8);
      });

      test('should handle descending array with middle intersecting array', () => {
        const res = minmax.getMax(
          [
            { config, data: [5, 5] },
            { config, data: [6, 5, 4, 3, 2, 1] },
          ],
          false,
        );
        expect(res).toBe(6);
      });

      test('should handle empty descending array', () => {
        const res = minmax.getMax(
          [
            { config, data: [] },
            { config, data: [6, 5, 4, 3, 2, 1] },
          ],
          false,
        );
        expect(res).toBe(6);
      });
    });
  });
});
