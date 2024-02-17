import { db } from './db';
import { type PostInsert, postsTable } from './schema';

const posts: PostInsert[] = [
  {
    title: 'Hello, World!',
    content: 'This is my first post.',
  },
  {
    title: 'Goodbye, World!',
    content: 'This is my last post.',
  },
];

(async () => {
  await db.insert(postsTable).values(posts);
})();
