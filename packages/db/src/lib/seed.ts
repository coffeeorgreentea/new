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
  console.info('Seeding databse...');
  try {
    await db.insert(postsTable).values(posts);
    console.info('Database seeded.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

process.exit(0);
