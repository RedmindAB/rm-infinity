export type Post = {
  id: string;
  account: string;
  date: number;
};

export const rootDate = Date.now();
let dateCounter = 1;

const generateDate = () => {
  const res = rootDate - dateCounter * 1000;
  dateCounter++;
  return res;
};

export function getPostByOffset(offset: number) {
  return Posts[offset - 1];
}

export const Posts: Post[] = [
  { id: '20', account: 'test1', date: generateDate() },
  { id: '19', account: 'test3', date: generateDate() },
  { id: '18', account: 'test', date: generateDate() },
  { id: '17', account: 'test2', date: generateDate() },
  { id: '16', account: 'test1', date: generateDate() },
  { id: '15', account: 'test1', date: generateDate() },
  { id: '14', account: 'test3', date: generateDate() },
  { id: '13', account: 'test3', date: generateDate() },
  { id: '12', account: 'test', date: generateDate() },
  { id: '11', account: 'test3', date: generateDate() },
  { id: '10', account: 'test', date: generateDate() },
  { id: '09', account: 'test2', date: generateDate() },
  { id: '08', account: 'test', date: generateDate() },
  { id: '07', account: 'test', date: generateDate() },
  { id: '06', account: 'test2', date: generateDate() },
  { id: '05', account: 'test2', date: generateDate() },
  { id: '04', account: 'test', date: generateDate() },
  { id: '03', account: 'test1', date: generateDate() },
  { id: '02', account: 'test1', date: generateDate() },
  { id: '01', account: 'test', date: generateDate() },
];

function getFilteredPosts(filter: string | undefined) {
  const posts = [...Posts];
  if (filter) {
    return posts.filter((post) => post.account === filter);
  }
  return posts;
}

export function getPosts(offset: number, limit: number, filterByAccount?: string) {
  const tmpPosts = getFilteredPosts(filterByAccount);
  return Promise.resolve(tmpPosts.slice(offset, offset + limit));
}

export function getPostByDateStartAt(startAtId: number, limit: number, filterByAccount?: string) {
  const tmpPosts = getFilteredPosts(filterByAccount);
  const filtered = tmpPosts.filter((post) => post.date < startAtId);
  return filtered.slice(0, limit);
}
