import { InfinityEngine } from '../index';
import { InfinityConfig } from '../types';
import moment from 'moment';

type Cat = {
  age: number;
  name: string;
};

type Dog = {
  birthDate: string;
  name: string;
};

const cats: Cat[] = [
  {
    age: 9,
    name: 'Whiskers',
  },
  {
    age: 6,
    name: 'Tigger',
  },
  {
    age: 3,
    name: 'Sassy',
  },
  {
    age: 1,
    name: 'Simba',
  },
];

const dogs: Dog[] = [
  {
    birthDate: '2012-01-01',
    name: 'Shadow',
  },
  {
    birthDate: '2013-05-21',
    name: 'Lucky',
  },
  {
    birthDate: '2014-01-01',
    name: 'Sam',
  },
  {
    birthDate: '2015-01-01',
    name: 'Buddy',
  },
  {
    birthDate: '2019-01-01',
    name: 'Molly',
  },
];

describe('examples', () => {
  test('Basic', async () => {
    const Engine = new InfinityEngine({ ascending: true });

    let config = [
      {
        name: 'cats',
        offset: 0,
        query: (offset) => Promise.resolve(cats.slice(offset, 3 + offset)),
        comparator: (cat) => moment().subtract(cat.age, 'years').unix(),
      } as InfinityConfig<Cat>,
      {
        name: 'dogs',
        offset: 0,
        query: (offset) => Promise.resolve(dogs.slice(offset, 2 + offset)),
        comparator: (dog) => moment(dog.birthDate).unix(),
      } as InfinityConfig<Dog>,
    ];
    let result = await Engine.getNext(config);
    console.log(result);
    config = Engine.updateConfigsOffsetFromResult(result, config);
    result = await Engine.getNext(config);
    console.log(result);
    config = Engine.updateConfigsOffsetFromResult(result, config);
    result = await Engine.getNext(config);
    console.log(result);
    config = Engine.updateConfigsOffsetFromResult(result, config);
    result = await Engine.getNext(config);
    console.log(result);
    config = Engine.updateConfigsOffsetFromResult(result, config);
    result = await Engine.getNext(config);
    console.log(result);
  });
});
