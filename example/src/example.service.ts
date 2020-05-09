const dataSource1 = Array.from(Array(50).keys()).reverse();
const dataSource2 = Array.from(Array(10).keys())
  .map((v) => v * 5)
  .reverse();
const dataSource3 = Array.from(Array(10).keys())
  .map((v) => v * 3)
  .reverse();
const dataSource4 = Array.from(Array(10).keys())
  .map((v) => v * 0)
  .reverse();

export function printDbs() {
  console.log('ds1', dataSource1);
  console.log('ds2', dataSource2);
  console.log('ds3', dataSource3);
  console.log('ds4', dataSource4);
}

export async function queryDb1(offset: number, limit: number) {
  return Promise.resolve(dataSource1.slice(offset, offset + limit));
}

export async function queryDb2(offset: number, limit: number) {
  return Promise.resolve(dataSource2.slice(offset, offset + limit));
}

export async function queryDb3(offset: number, limit: number) {
  return Promise.resolve(dataSource3.slice(offset, offset + limit));
}

export async function queryDb4(offset: number, limit: number) {
  return Promise.resolve(dataSource4.slice(offset, offset + limit));
}
