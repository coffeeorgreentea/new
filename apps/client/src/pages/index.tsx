import React from 'react';
import { api } from 'api-client';
import z from 'zod';
import { UserButton } from '@clerk/nextjs';
import { useUser, useAuth } from '@clerk/nextjs';
type Props = {};

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

type Post = z.infer<typeof postSchema>;
const index = (props: Props) => {
  const { data } = api.post.all.useQuery();
  const getToken = useAuth().getToken;
  const { mutateAsync: createPost } = api.post.create.useMutation();

  const [form, setForm] = React.useState<Post>({
    title: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost(form);
  };

  const user = useUser();

  const testFetch = async () => {
    const res = await fetch('/api/test');
    const data = await res.json();
    console.log('data', data);
  };

  const testServerFetch = async () => {
    const token = await getToken();
    const res = await fetch('http://localhost:7100/hello', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log('data', data);
  };

  return (
    <div className="h-dvh flex flex-col w-full bg-slate-900/50 items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>

      <button onClick={testFetch}>Test Fetch</button>
      <button onClick={testServerFetch}>Test Server Fetch</button>
      <h1>Client</h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 outline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Posts</h1>
          {data ? (
            <ul>
              {data.map((post) => (
                <li key={post.id}>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>

                  {post?.createdAt && (
                    <span className="text-xs">
                      {new Date(post?.createdAt).toLocaleString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Create Post</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-white"
              >
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
