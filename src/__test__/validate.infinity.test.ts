import * as pag from '../infinityEngine';
import { InfinityConfig, ValidationErrorMessage, ValidationError } from '../types';
import * as validation from '../validation';

let error: ValidationErrorMessage;

beforeEach(() => {
  error = undefined as any;
});

const onError = (msg: ValidationErrorMessage) => (error = msg);

const ascConfig = { ascending: true, onError };
const ascpagination = new pag.InfinityEngine(ascConfig);
const descConfig = { onError };
const descpagination = new pag.InfinityEngine(descConfig);

describe('validation', () => {
  describe('ascending', () => {
    test('invalid sort order', async () => {
      await ascpagination.getNext([simpleConfig('asc', [3, 2, 1])]);
      expect(error).toEqual(
        validation.getErrorMessage(
          ValidationError.INVALID_ORDER,
          { config: { name: 'asc' } } as any,
          ascpagination.getConfig(),
        ),
      );
    });
    test('invalid sort order one of two', async () => {
      await ascpagination.getNext([simpleConfig('asc', [3, 2, 1]), simpleConfig('asc2', [1, 2, 3])]);
      expect(error).toEqual(
        validation.getErrorMessage(
          ValidationError.INVALID_ORDER,
          { config: { name: 'asc' } } as any,
          ascpagination.getConfig(),
        ),
      );
    });
    test('valid sort order', async () => {
      await ascpagination.getNext([simpleConfig('asc', [1, 2, 3])]);
      expect(error).not.toBeDefined();
    });
    test('valid if only one element', async () => {
      await ascpagination.getNext([simpleConfig('asc', [3])]);
      expect(error).not.toBeDefined();
    });
  });

  describe('descending', () => {
    test('invalid sort order', async () => {
      await descpagination.getNext([simpleConfig('desc', [1, 2, 3])]);
      expect(error).toEqual(
        validation.getErrorMessage(
          ValidationError.INVALID_ORDER,
          { config: { name: 'desc' } } as any,
          descpagination.getConfig(),
        ),
      );
    });
    test('invalid sort order one of two', async () => {
      await descpagination.getNext([simpleConfig('desc', [3, 2, 1]), simpleConfig('desc2', [1, 2, 3])]);
      expect(error).toEqual(
        validation.getErrorMessage(
          ValidationError.INVALID_ORDER,
          { config: { name: 'desc2' } } as any,
          descpagination.getConfig(),
        ),
      );
    });
    test('valid sort order', async () => {
      await descpagination.getNext([simpleConfig('desc', [3, 2, 1])]);
      expect(error).not.toBeDefined();
    });

    test('valid if only one element', async () => {
      await descpagination.getNext([simpleConfig('desc', [1])]);
      expect(error).not.toBeDefined();
    });
  });

  test('should return unknown error if no ValidationError is passed', () => {
    expect(validation.getErrorMessage(null as any, null as any, null as any)).toEqual({
      error: null as any,
      message: 'Unknown error',
    } as ValidationErrorMessage);
  });
});

function simpleConfig(name: string, numbers: number[]): InfinityConfig<number> {
  return {
    name,
    offset: 0,
    query: () => Promise.resolve(numbers),
    sortValue: (v: any) => v,
  };
}
