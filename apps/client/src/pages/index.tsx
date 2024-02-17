import React from 'react';
import { api } from 'api-client';
import { UserButton } from '@clerk/nextjs';
type Props = {};

const index = (props: Props) => {
  const { data } = api.post.all.useQuery();
  return (
    <div className="h-screen">
      <UserButton />
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
  );
};

export default index;
