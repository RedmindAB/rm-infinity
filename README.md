![Node.js CI](https://github.com/RedmindAB/rm-infinity/workflows/Node.js%20CI/badge.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/RedmindAB/rm-infinity/badge.svg?branch=master)](https://coveralls.io/github/RedmindAB/rm-infinity?branch=master)

# rm-infinity

Get combined sorted data from multiple paginated data sources

it works by getting data from paginated sources and work out which elements that can be combined into one single response based on where the different results intersect.

# Install

`npm i rm-infinity`

# API docs

https://redmindab.github.io/rm-infinity/

# Usage

Given this dataset

```typescript
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
```

- We want to get all the cats and dogs in a stream like manor
- sorted by the age of the animal with the oldest first.

to achive this with rm-infinity we just create a `InfinityEngine` with a ascending configuration (if we convert age and birthdate to unix time)

```typescript
import { InfinityEngine, InfinityConfig } from 'rm-infinity';

// Accending because timestamps from oldest to newest are ascending.
const Engine = new InfinityEngine({ ascending: true });
```

Then we create a configuration to query the datasets

```typescript
const config = [
  {
    name: 'cats',
    offset: 0, // original offset is 0
    query: (offset) => Promise.resolve(cats.slice(offset, 3 + offset)),
    comparator: (cat) => moment().subtract(cat.age, 'years').unix(),
  } as InfinityConfig<Cat>,
  {
    name: 'dogs',
    offset: 0, // original offset is 0
    query: (offset) => Promise.resolve(dogs.slice(offset, 2 + offset)),
    comparator: (dog) => moment(dog.birthDate).unix(),
  } as InfinityConfig<Dog>,
];
```

pass the configuration to the engine

```typescript
const result = await Engine.getNext(config);
/*
 { data:
    [ { age: 9, name: 'Whiskers' },
      { birthDate: '2012-01-01', name: 'Shadow' },
      { birthDate: '2013-05-21', name: 'Lucky' } ],
    newOffsets: [ { name: 'cats', value: 1 }, { name: 'dogs', value: 2 } ] }
*/
```

## How it works

if this is the data returned by the queries

```js
const arr1 = [5, 4, 3, 2, 1];
const arr2 = [7, 5, 0];
```

The engine will first find the max value comparing `arr1[0]` and `arr2[0]` which in this case is `7`
then find the max value for `arr1[arr1.length - 1]` and `arr2[arr2.length - 1]` which is `1`

after that it will combine and sort all results in decending order.

```js
{
  data: [7, 5, 5, 4, 3, 2, 1],
  newOffsets: [
    {
      name: 'arr1',
      offset: 5,
    },
    {
      name: 'arr2',
      offset: 2,
    },
  ],
}
```
